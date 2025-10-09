import React, { useEffect, useState } from "react";

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
    window.addEventListener("resize", checkMobile);

    // AdSense 스크립트 로드
    try {
      ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push(
        {}
      );
    } catch (e) {
      console.error("AdSense error:", e);
    }

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return (
    <ins
      className="adsbygoogle"
      style={{
        display: "block",
        position: "fixed",
        bottom: "10px",
        left: "50%",
        transform: "translateX(-50%)",
        width: isMobile ? "300px" : "350px",
        height: isMobile ? "200px" : "150px",
        zIndex: 9999,
      }}
      data-ad-client={adClient}
      data-ad-slot={adSlot}
    />
  );
};

export default FloatingAd;
