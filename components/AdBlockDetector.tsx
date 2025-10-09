import React, { useEffect, useState } from "react";

const AdBlockDetector: React.FC = () => {
  const [adBlockDetected, setAdBlockDetected] = useState(false);

  useEffect(() => {
    // 애드블록 감지 방법 1: 테스트 광고 요소 생성
    const detectAdBlock = async () => {
      // 광고 테스트 요소 생성
      const testAd = document.createElement("div");
      testAd.innerHTML = "&nbsp;";
      testAd.className = "adsbox adsbygoogle ad-placement";
      testAd.style.cssText =
        "width: 1px !important; height: 1px !important; position: absolute !important; left: -10000px !important; top: -1000px !important;";

      document.body.appendChild(testAd);

      // 짧은 지연 후 확인
      await new Promise((resolve) => setTimeout(resolve, 100));

      // 요소가 숨겨졌거나 제거되었는지 확인
      const isBlocked =
        testAd.offsetHeight === 0 ||
        testAd.offsetWidth === 0 ||
        window.getComputedStyle(testAd).display === "none" ||
        window.getComputedStyle(testAd).visibility === "hidden";

      document.body.removeChild(testAd);

      if (isBlocked) {
        setAdBlockDetected(true);
      }

      // 추가 감지: AdSense 스크립트 확인
      if (!(window as any).adsbygoogle) {
        setAdBlockDetected(true);
      }
    };

    // 페이지 로드 후 감지
    const timer = setTimeout(detectAdBlock, 1000);

    return () => clearTimeout(timer);
  }, []);

  if (!adBlockDetected) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.95)",
        zIndex: 99999,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "20px",
      }}
    >
      <div
        style={{
          backgroundColor: "white",
          borderRadius: "20px",
          padding: "40px",
          maxWidth: "500px",
          textAlign: "center",
          boxShadow: "0 10px 40px rgba(0,0,0,0.3)",
        }}
      >
        <div style={{ fontSize: "60px", marginBottom: "20px" }}>🚫</div>
        <h2
          style={{
            fontSize: "28px",
            fontWeight: "bold",
            color: "#333",
            marginBottom: "16px",
          }}
        >
          광고 차단 프로그램 감지
        </h2>
        <p
          style={{
            fontSize: "16px",
            color: "#666",
            lineHeight: "1.6",
            marginBottom: "24px",
          }}
        >
          광고 차단 프로그램(AdBlock)이 활성화되어 있습니다.
          <br />
          <br />
          무료로 서비스를 제공하기 위해 광고가 필요합니다.
          <br />
          광고 차단 프로그램을 비활성화하고 페이지를 새로고침해 주세요.
        </p>
        <div
          style={{
            padding: "16px",
            backgroundColor: "#f8f9fa",
            borderRadius: "10px",
            marginBottom: "24px",
          }}
        >
          <p style={{ fontSize: "14px", color: "#555", fontWeight: "600" }}>
            💡 광고 차단 해제 방법:
          </p>
          <ol
            style={{
              fontSize: "14px",
              color: "#666",
              textAlign: "left",
              paddingLeft: "20px",
              marginTop: "12px",
            }}
          >
            <li>브라우저 확장 프로그램에서 AdBlock 비활성화</li>
            <li>이 사이트를 허용 목록에 추가</li>
            <li>페이지 새로고침 (F5)</li>
          </ol>
        </div>
        <button
          onClick={() => window.location.reload()}
          style={{
            backgroundColor: "#667eea",
            color: "white",
            border: "none",
            borderRadius: "10px",
            padding: "14px 32px",
            fontSize: "16px",
            fontWeight: "bold",
            cursor: "pointer",
            transition: "all 0.3s",
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.backgroundColor = "#5568d3";
            e.currentTarget.style.transform = "scale(1.05)";
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.backgroundColor = "#667eea";
            e.currentTarget.style.transform = "scale(1)";
          }}
        >
          새로고침
        </button>
      </div>
    </div>
  );
};

export default AdBlockDetector;
