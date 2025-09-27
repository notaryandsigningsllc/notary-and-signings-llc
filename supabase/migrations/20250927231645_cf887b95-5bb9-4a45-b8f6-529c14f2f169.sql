-- Create news_feed table
CREATE TABLE public.news_feed (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title text NOT NULL,
  content text NOT NULL,
  author_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.news_feed ENABLE ROW LEVEL SECURITY;

-- Create policies as requested
CREATE POLICY "Only permanent users can post to the news feed"
ON public.news_feed AS RESTRICTIVE FOR INSERT
TO authenticated
WITH CHECK ((SELECT (auth.jwt()->>'is_anonymous')::boolean) IS FALSE);

CREATE POLICY "Anonymous and permanent users can view the news feed"
ON public.news_feed FOR SELECT
TO authenticated
USING (TRUE);

-- Add trigger for updated_at
CREATE TRIGGER update_news_feed_updated_at
  BEFORE UPDATE ON public.news_feed
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();