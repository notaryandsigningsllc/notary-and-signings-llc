import { useEffect, useRef } from "react";

declare global {
  interface Window {
    adsbygoogle: unknown[];
  }
}

interface AdSenseProps {
  adSlot: string;
  adFormat?: "auto" | "rectangle" | "horizontal" | "vertical";
  className?: string;
  style?: React.CSSProperties;
  fullWidthResponsive?: boolean;
}

/**
 * Google AdSense Ad Unit Component
 * 
 * Usage:
 * 1. Replace "YOUR_AD_SLOT_ID" with your actual ad slot ID from AdSense dashboard
 * 2. Place the component where you want ads to appear
 * 
 * Example: <AdSense adSlot="1234567890" adFormat="auto" />
 */
export default function AdSense({
  adSlot,
  adFormat = "auto",
  className = "",
  style,
  fullWidthResponsive = true,
}: AdSenseProps) {
  const adRef = useRef<HTMLModElement>(null);
  const isAdLoaded = useRef(false);

  useEffect(() => {
    // Only load ad once and only in production/when AdSense is ready
    if (isAdLoaded.current) return;
    
    try {
      if (typeof window !== "undefined" && window.adsbygoogle) {
        window.adsbygoogle.push({});
        isAdLoaded.current = true;
      }
    } catch (error) {
      console.error("AdSense error:", error);
    }
  }, []);

  return (
    <div className={`adsense-container ${className}`}>
      <ins
        ref={adRef}
        className="adsbygoogle"
        style={{
          display: "block",
          ...style,
        }}
        data-ad-client="ca-pub-9764321901957718"
        data-ad-slot={adSlot}
        data-ad-format={adFormat}
        data-full-width-responsive={fullWidthResponsive ? "true" : "false"}
      />
    </div>
  );
}
