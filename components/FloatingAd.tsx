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
        bottom: "0",
        left: "0",
        right: "0",
        zIndex: 9999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: isMobile ? "200px" : "150px",
        padding: "0",
        margin: "0",
      }}
    >
      <div
        style={{
          width: isMobile ? "300px" : "350px",
          height: isMobile ? "200px" : "150px",
          margin: "0 auto",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <ins
          className="adsbygoogle"
          style={{
            display: "inline-block",
            width: isMobile ? "300px" : "350px",
            height: isMobile ? "200px" : "150px",
            margin: "0 auto",
          }}
          data-ad-client={adClient}
          data-ad-slot={adSlot}
        />
      </div>
    </div>
  );
};

export default FloatingAd;
