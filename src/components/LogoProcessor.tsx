import { useEffect, useState } from 'react';
import { removeBackground, loadImageFromSrc } from '@/utils/backgroundRemoval';
import notaryLogo from '@/assets/notary-logo.png';

interface LogoProcessorProps {
  onProcessed: (processedImageUrl: string) => void;
}

export const LogoProcessor = ({ onProcessed }: LogoProcessorProps) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const processLogo = async () => {
      setIsProcessing(true);
      setError(null);
      
      try {
        console.log('Loading original logo...');
        const imageElement = await loadImageFromSrc(notaryLogo);
        
        console.log('Removing background...');
        const processedBlob = await removeBackground(imageElement);
        
        console.log('Creating processed image URL...');
        const processedImageUrl = URL.createObjectURL(processedBlob);
        onProcessed(processedImageUrl);
        
        console.log('Logo processing completed successfully');
      } catch (err) {
        console.error('Error processing logo:', err);
        setError('Failed to process logo. Using original image.');
        onProcessed(notaryLogo); // Fallback to original
      } finally {
        setIsProcessing(false);
      }
    };

    processLogo();
  }, [onProcessed]);

  if (error) {
    console.warn('Logo processing error:', error);
  }

  return null; // This component doesn't render anything
};