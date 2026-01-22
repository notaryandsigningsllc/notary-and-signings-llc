import AdSense from "@/components/AdSense";

interface StickyAdSidebarProps {
  adSlot: string;
  className?: string;
}

/**
 * Sticky Sidebar Ad Component
 * Follows users as they scroll on content-heavy pages
 * 
 * Usage: Wrap your main content in a flex container with this sidebar
 */
export default function StickyAdSidebar({ adSlot, className = "" }: StickyAdSidebarProps) {
  return (
    <aside className={`hidden xl:block w-[300px] flex-shrink-0 ${className}`}>
      <div className="sticky top-24 space-y-4">
        <AdSense 
          adSlot={adSlot} 
          adFormat="vertical"
          style={{ minHeight: "250px", width: "300px" }}
        />
        
        {/* Optional: Second ad unit below for more revenue */}
        <div className="mt-8">
          <AdSense 
            adSlot={`${adSlot}_2`} 
            adFormat="rectangle"
            style={{ minHeight: "250px", width: "300px" }}
          />
        </div>
      </div>
    </aside>
  );
}
