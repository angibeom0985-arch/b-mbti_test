import React, { useEffect, useState } from 'react';

interface FloatingAdProps {
  adSlot: string;
  adClient: string;
}

const FloatingAd: React.FC<FloatingAdProps> = ({ adSlot, adClient }) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    // AdSense 스크립트 로드
    try {
      ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
    } catch (e) {
      console.error('AdSense error:', e);
    }

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        width: '100%',
        backgroundColor: '#fff',
        boxShadow: '0 -2px 10px rgba(0,0,0,0.1)',
        zIndex: 9999,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '8px 0',
      }}
    >
      <ins
        className="adsbygoogle"
        style={{
          display: 'inline-block',
          width: isMobile ? '320px' : '728px',
          height: isMobile ? '50px' : '90px',
        }}
        data-ad-client={adClient}
        data-ad-slot={adSlot}
      />
    </div>
  );
};

export default FloatingAd;
