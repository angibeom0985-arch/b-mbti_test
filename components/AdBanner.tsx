import React, { useEffect, useRef } from 'react';

interface AdBannerProps {
  slot: string;
  format?: 'auto' | 'rectangle' | 'horizontal' | 'vertical';
  responsive?: boolean;
  style?: React.CSSProperties;
  className?: string;
}

declare global {
  interface Window {
    adsbygoogle: any[];
  }
}

const AdBanner: React.FC<AdBannerProps> = ({ 
  slot, 
  format = 'auto', 
  responsive = true,
  style = {},
  className = '' 
}) => {
  const adRef = useRef<HTMLModElement>(null);

  useEffect(() => {
    try {
      if (typeof window !== 'undefined' && window.adsbygoogle) {
        window.adsbygoogle.push({});
      }
    } catch (error) {
      console.error('AdSense 광고 로드 실패:', error);
    }
  }, []);

  return (
    <div className={`ad-container ${className}`} style={style}>
      <center>
        <ins
          ref={adRef}
          className="adsbygoogle"
          style={{ display: 'block', ...style }}
          data-ad-client="ca-pub-2686975437928535"
          data-ad-slot={slot}
          data-ad-format={format}
          data-full-width-responsive={responsive.toString()}
        />
      </center>
    </div>
  );
};

export default AdBanner;