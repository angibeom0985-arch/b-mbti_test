import React, { useEffect, useState } from 'react';

interface SideAdProps {
  adSlot: string;
  adClient: string;
  position: 'left' | 'right';
}

const SideAd: React.FC<SideAdProps> = ({ adSlot, adClient, position }) => {
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const checkDesktop = () => {
      setIsDesktop(window.innerWidth > 768);
    };

    checkDesktop();
    window.addEventListener('resize', checkDesktop);

    // AdSense 스크립트 로드
    if (isDesktop) {
      try {
        ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
      } catch (e) {
        console.error('AdSense error:', e);
      }
    }

    return () => window.removeEventListener('resize', checkDesktop);
  }, [isDesktop]);

  if (!isDesktop) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: '50%',
        [position]: '10px',
        transform: 'translateY(-50%)',
        width: '160px',
        minHeight: '600px',
        zIndex: 1000,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <ins
        className="adsbygoogle"
        style={{
          display: 'block',
          width: '160px',
          height: '600px',
        }}
        data-ad-client={adClient}
        data-ad-slot={adSlot}
        data-ad-format="vertical"
      />
    </div>
  );
};

export default SideAd;
