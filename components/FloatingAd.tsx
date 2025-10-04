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
    <div
      style={{
        position: "fixed",
        bottom: "10px",
        left: "50%",
        transform: "translateX(-50%)",
        backgroundColor: "#fff",
        boxShadow: "0 -2px 10px rgba(0,0,0,0.1)",
        borderRadius: "8px",
        zIndex: 9999,
        padding: "8px",
        width: isMobile ? "min(328px, calc(100vw - 20px))" : "min(736px, calc(100vw - 40px))",
        maxWidth: isMobile ? "328px" : "736px",
        height: isMobile ? "66px" : "106px",
      }}
    >
      <ins
        className="adsbygoogle"
        style={{
          display: "inline-block",
          width: isMobile ? "320px" : "728px",
          height: isMobile ? "50px" : "90px",
          maxWidth: "100%",
        }}
        data-ad-client={adClient}
        data-ad-slot={adSlot}
      />
    </div>
  );
};

export default FloatingAd;
