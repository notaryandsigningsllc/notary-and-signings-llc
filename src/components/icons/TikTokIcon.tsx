import tiktokLogo from "@/assets/tiktok-logo-outline.png";

interface TikTokIconProps {
  className?: string;
}

const TikTokIcon = ({ className = "w-4 h-4" }: TikTokIconProps) => {
  return (
    <img
      src={tiktokLogo}
      alt="TikTok"
      loading="lazy"
      width="16"
      height="16"
      className={className}
      decoding="async"
    />
  );
};

export default TikTokIcon;