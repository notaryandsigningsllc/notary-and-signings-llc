-- Create a rate_limits table for persistent rate limiting across edge function cold starts
CREATE TABLE IF NOT EXISTS public.rate_limits (
  key TEXT PRIMARY KEY,
  count INTEGER NOT NULL DEFAULT 1,
  window_start TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.rate_limits ENABLE ROW LEVEL SECURITY;

-- Block all access except from service role (edge functions)
CREATE POLICY "rate_limits_service_only" ON public.rate_limits
  FOR ALL
  USING (false)
  WITH CHECK (false);

-- Create function for atomic rate limit check and update
CREATE OR REPLACE FUNCTION public.check_rate_limit(
  p_key TEXT,
  p_max_requests INTEGER DEFAULT 5,
  p_window_seconds INTEGER DEFAULT 3600
)
RETURNS TABLE(
  is_limited BOOLEAN,
  remaining INTEGER,
  reset_in_seconds INTEGER
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_window_start TIMESTAMPTZ;
  v_count INTEGER;
  v_now TIMESTAMPTZ := now();
  v_window_duration INTERVAL := (p_window_seconds || ' seconds')::INTERVAL;
BEGIN
  -- Try to get existing record
  SELECT rl.count, rl.window_start INTO v_count, v_window_start
  FROM rate_limits rl
  WHERE rl.key = p_key
  FOR UPDATE;
  
  IF FOUND THEN
    -- Check if window has expired
    IF v_window_start + v_window_duration < v_now THEN
      -- Reset the window
      UPDATE rate_limits rl
      SET count = 1, window_start = v_now, updated_at = v_now
      WHERE rl.key = p_key;
      
      RETURN QUERY SELECT 
        FALSE::BOOLEAN AS is_limited, 
        (p_max_requests - 1)::INTEGER AS remaining,
        p_window_seconds AS reset_in_seconds;
    ELSE
      -- Window still active
      IF v_count >= p_max_requests THEN
        -- Rate limited
        RETURN QUERY SELECT 
          TRUE::BOOLEAN AS is_limited, 
          0::INTEGER AS remaining,
          EXTRACT(EPOCH FROM (v_window_start + v_window_duration - v_now))::INTEGER AS reset_in_seconds;
      ELSE
        -- Increment counter
        UPDATE rate_limits rl
        SET count = count + 1, updated_at = v_now
        WHERE rl.key = p_key;
        
        RETURN QUERY SELECT 
          FALSE::BOOLEAN AS is_limited, 
          (p_max_requests - v_count - 1)::INTEGER AS remaining,
          EXTRACT(EPOCH FROM (v_window_start + v_window_duration - v_now))::INTEGER AS reset_in_seconds;
      END IF;
    END IF;
  ELSE
    -- Create new record
    INSERT INTO rate_limits (key, count, window_start, updated_at)
    VALUES (p_key, 1, v_now, v_now);
    
    RETURN QUERY SELECT 
      FALSE::BOOLEAN AS is_limited, 
      (p_max_requests - 1)::INTEGER AS remaining,
      p_window_seconds AS reset_in_seconds;
  END IF;
END;
$$;

-- Create cleanup function to remove old rate limit entries (run periodically)
CREATE OR REPLACE FUNCTION public.cleanup_old_rate_limits()
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  deleted_count INTEGER;
BEGIN
  DELETE FROM rate_limits
  WHERE updated_at < now() - INTERVAL '24 hours';
  
  GET DIAGNOSTICS deleted_count = ROW_COUNT;
  RETURN deleted_count;
END;
$$;