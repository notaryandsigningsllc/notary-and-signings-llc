import tiktokLogo from "@/assets/tiktok-logo.webp";

interface TikTokIconProps {
  className?: string;
}

const TikTokIcon = ({ className = "w-4 h-4" }: TikTokIconProps) => {
  return (
    <img
      src={tiktokLogo}
      alt="TikTok"
      className={className}
    />
  );
};

export default TikTokIcon;