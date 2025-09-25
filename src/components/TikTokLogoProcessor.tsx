import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { removeBackground, loadImageFromSrc } from '@/utils/backgroundRemoval';
import tiktokLogo from '@/assets/tiktok-logo.webp';

const TikTokLogoProcessor = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [processedImageUrl, setProcessedImageUrl] = useState<string | null>(null);

  const processLogo = async () => {
    setIsProcessing(true);
    try {
      console.log('Loading TikTok logo...');
      const imageElement = await loadImageFromSrc(tiktokLogo);
      
      console.log('Removing background...');
      const processedBlob = await removeBackground(imageElement);
      
      // Create URL for the processed image
      const url = URL.createObjectURL(processedBlob);
      setProcessedImageUrl(url);
      
      // Create download link
      const link = document.createElement('a');
      link.href = url;
      link.download = 'tiktok-logo-no-background.png';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      console.log('Background removal completed!');
    } catch (error) {
      console.error('Error processing logo:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 space-y-4">
      <h2 className="text-2xl font-bold text-center">TikTok Logo Background Remover</h2>
      
      <div className="space-y-4">
        <div className="text-center">
          <h3 className="font-semibold mb-2">Original TikTok Logo:</h3>
          <img src={tiktokLogo} alt="Original TikTok Logo" className="w-24 h-24 mx-auto border rounded" />
        </div>
        
        <Button 
          onClick={processLogo} 
          disabled={isProcessing}
          className="w-full"
        >
          {isProcessing ? 'Removing Background...' : 'Remove Background'}
        </Button>
        
        {processedImageUrl && (
          <div className="text-center">
            <h3 className="font-semibold mb-2">Processed Logo (Background Removed):</h3>
            <img 
              src={processedImageUrl} 
              alt="Processed TikTok Logo" 
              className="w-24 h-24 mx-auto border rounded"
              style={{ backgroundColor: '#f0f0f0' }}
            />
            <p className="text-sm text-muted-foreground mt-2">
              The processed image has been downloaded automatically.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TikTokLogoProcessor;