import React from 'react';

const PrivacyPage: React.FC = () => {
  return (
    <div style={{
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", "Malgun Gothic", sans-serif',
      lineHeight: '1.6',
      color: '#333',
      maxWidth: '800px',
      margin: '0 auto',
      padding: '20px',
      background: '#f5f5f5',
      minHeight: '100vh'
    }}>
      <div style={{
        background: 'white',
        padding: '40px',
        borderRadius: '10px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
      }}>
        <h1 style={{
          color: '#2c3e50',
          marginBottom: '20px',
          fontSize: '28px',
          borderBottom: '3px solid #3498db',
          paddingBottom: '10px'
        }}>
          개인정보처리방침
        </h1>

        <div style={{ marginBottom: '20px', color: '#7f8c8d' }}>
          <p><strong>시행일:</strong> 2025년 1월 1일</p>
          <p><strong>최종 수정일:</strong> 2025년 1월 1일</p>
        </div>

        <section style={{ marginTop: '30px' }}>
          <h2 style={{
            color: '#2c3e50',
            marginBottom: '15px',
            fontSize: '20px'
          }}>
            1. 개인정보의 수집 및 이용 목적
          </h2>
          <p style={{ marginBottom: '15px', lineHeight: '1.8' }}>
            B-MBTI(이하 "서비스")는 다음의 목적을 위하여 개인정보를 처리합니다. 
            처리하고 있는 개인정보는 다음의 목적 이외의 용도로는 이용되지 않으며, 
            이용 목적이 변경되는 경우에는 「개인정보 보호법」 제18조에 따라 별도의 동의를 받는 등 
            필요한 조치를 이행할 예정입니다.
          </p>
        </section>

        <section style={{ marginTop: '30px' }}>
          <h2 style={{
            color: '#2c3e50',
            marginBottom: '15px',
            fontSize: '20px'
          }}>
            2. 수집하는 개인정보 항목
          </h2>
          <div style={{ 
            background: '#f8f9fa', 
            padding: '20px', 
            borderRadius: '5px',
            marginBottom: '15px'
          }}>
            <h3 style={{
              color: '#34495e',
              marginBottom: '10px',
              fontSize: '16px'
            }}>
              필수 수집 항목
            </h3>
            <p style={{ marginBottom: '10px' }}>본 서비스는 다음과 같은 정보를 수집합니다:</p>
            <ul style={{ paddingLeft: '20px', marginBottom: '15px' }}>
              <li style={{ marginBottom: '8px' }}>테스트 결과 (MBTI 유형)</li>
              <li style={{ marginBottom: '8px' }}>기기 정보 (브라우저 종류, OS 정보)</li>
              <li style={{ marginBottom: '8px' }}>접속 로그 (IP 주소, 접속 시간)</li>
              <li style={{ marginBottom: '8px' }}>쿠키 및 로컬 스토리지 정보</li>
            </ul>
            <p style={{ color: '#e74c3c', fontWeight: 'bold' }}>
              ⚠️ 본 서비스는 이름, 이메일, 전화번호 등의 개인 식별 정보를 수집하지 않습니다.
            </p>
          </div>
        </section>

        <section style={{ marginTop: '30px' }}>
          <h2 style={{
            color: '#2c3e50',
            marginBottom: '15px',
            fontSize: '20px'
          }}>
            3. 개인정보의 보유 및 이용기간
          </h2>
          <p style={{ marginBottom: '15px', lineHeight: '1.8' }}>
            수집된 정보는 서비스 제공 기간 동안 보유하며, 사용자가 브라우저 쿠키 및 
            로컬 스토리지를 삭제할 경우 즉시 삭제됩니다.
          </p>
          <ul style={{ paddingLeft: '20px', marginBottom: '15px' }}>
            <li style={{ marginBottom: '8px' }}><strong>테스트 결과:</strong> 로컬 스토리지에 저장되며 사용자가 직접 삭제 가능</li>
            <li style={{ marginBottom: '8px' }}><strong>접속 로그:</strong> 서버 로그는 최대 1년간 보관</li>
            <li style={{ marginBottom: '8px' }}><strong>쿠키:</strong> 브라우저 설정에 따라 관리</li>
          </ul>
        </section>

        <section style={{ marginTop: '30px' }}>
          <h2 style={{
            color: '#2c3e50',
            marginBottom: '15px',
            fontSize: '20px'
          }}>
            4. 개인정보의 제3자 제공
          </h2>
          <p style={{ 
            marginBottom: '15px', 
            lineHeight: '1.8',
            background: '#e8f5e9',
            padding: '15px',
            borderRadius: '5px',
            borderLeft: '4px solid #4caf50'
          }}>
            ✅ 본 서비스는 사용자의 개인정보를 제3자에게 제공하지 않습니다.
          </p>
        </section>

        <section style={{ marginTop: '30px' }}>
          <h2 style={{
            color: '#2c3e50',
            marginBottom: '15px',
            fontSize: '20px'
          }}>
            5. 개인정보의 파기 절차 및 방법
          </h2>
          <div style={{ marginBottom: '15px' }}>
            <h3 style={{
              color: '#34495e',
              marginBottom: '10px',
              fontSize: '16px'
            }}>
              파기 절차
            </h3>
            <p style={{ marginBottom: '15px', lineHeight: '1.8' }}>
              사용자가 테스트 결과를 삭제하거나 브라우저 데이터를 삭제하면 즉시 파기됩니다.
            </p>
          </div>
          <div>
            <h3 style={{
              color: '#34495e',
              marginBottom: '10px',
              fontSize: '16px'
            }}>
              파기 방법
            </h3>
            <ul style={{ paddingLeft: '20px', marginBottom: '15px' }}>
              <li style={{ marginBottom: '8px' }}>전자적 파일: 복구 불가능한 방법으로 영구 삭제</li>
              <li style={{ marginBottom: '8px' }}>로컬 스토리지: 브라우저 설정에서 삭제 가능</li>
            </ul>
          </div>
        </section>

        <section style={{ marginTop: '30px' }}>
          <h2 style={{
            color: '#2c3e50',
            marginBottom: '15px',
            fontSize: '20px'
          }}>
            6. 정보주체의 권리·의무 및 행사방법
          </h2>
          <p style={{ marginBottom: '15px', lineHeight: '1.8' }}>
            정보주체는 다음과 같은 권리를 행사할 수 있습니다:
          </p>
          <ul style={{ paddingLeft: '20px', marginBottom: '15px' }}>
            <li style={{ marginBottom: '8px' }}>개인정보 열람 요구</li>
            <li style={{ marginBottom: '8px' }}>개인정보 정정·삭제 요구</li>
            <li style={{ marginBottom: '8px' }}>개인정보 처리정지 요구</li>
          </ul>
          <p style={{ 
            background: '#fff3cd', 
            padding: '15px', 
            borderRadius: '5px',
            borderLeft: '4px solid #ffc107'
          }}>
            💡 본 서비스는 개인 식별 정보를 수집하지 않으므로, 브라우저 설정에서 
            쿠키 및 로컬 스토리지를 직접 관리하실 수 있습니다.
          </p>
        </section>

        <section style={{ marginTop: '30px' }}>
          <h2 style={{
            color: '#2c3e50',
            marginBottom: '15px',
            fontSize: '20px'
          }}>
            7. 개인정보 보호책임자
          </h2>
          <div style={{ 
            background: '#f8f9fa', 
            padding: '20px', 
            borderRadius: '5px',
            marginBottom: '15px'
          }}>
            <p style={{ marginBottom: '10px' }}><strong>담당자:</strong> B-MBTI 운영팀</p>
            <p style={{ marginBottom: '10px' }}><strong>이메일:</strong> privacy@b-mbti.com</p>
            <p><strong>연락처:</strong> 문의사항은 이메일로 접수해 주시기 바랍니다.</p>
          </div>
        </section>

        <section style={{ marginTop: '30px' }}>
          <h2 style={{
            color: '#2c3e50',
            marginBottom: '15px',
            fontSize: '20px'
          }}>
            8. 쿠키(Cookie) 사용
          </h2>
          <p style={{ marginBottom: '15px', lineHeight: '1.8' }}>
            본 서비스는 사용자 경험 향상을 위해 쿠키를 사용합니다.
          </p>
          <div style={{ marginBottom: '15px' }}>
            <h3 style={{
              color: '#34495e',
              marginBottom: '10px',
              fontSize: '16px'
            }}>
              쿠키 사용 목적
            </h3>
            <ul style={{ paddingLeft: '20px', marginBottom: '15px' }}>
              <li style={{ marginBottom: '8px' }}>테스트 결과 임시 저장</li>
              <li style={{ marginBottom: '8px' }}>사용자 설정 저장</li>
              <li style={{ marginBottom: '8px' }}>웹사이트 방문 통계 수집</li>
            </ul>
          </div>
          <div>
            <h3 style={{
              color: '#34495e',
              marginBottom: '10px',
              fontSize: '16px'
            }}>
              쿠키 거부 방법
            </h3>
            <p style={{ marginBottom: '10px' }}>
              웹 브라우저 상단의 도구 &gt; 인터넷 옵션 &gt; 개인정보 메뉴에서 쿠키 수신을 거부할 수 있습니다.
            </p>
            <p style={{ color: '#e74c3c', fontSize: '14px' }}>
              ⚠️ 쿠키 저장을 거부할 경우 일부 서비스 이용에 어려움이 있을 수 있습니다.
            </p>
          </div>
        </section>

        <section style={{ marginTop: '30px' }}>
          <h2 style={{
            color: '#2c3e50',
            marginBottom: '15px',
            fontSize: '20px'
          }}>
            9. 개인정보처리방침 변경
          </h2>
          <p style={{ marginBottom: '15px', lineHeight: '1.8' }}>
            본 개인정보처리방침은 2025년 1월 1일부터 적용되며, 법령 및 방침에 따른 
            변경사항이 있을 경우 웹사이트 공지사항을 통해 고지하겠습니다.
          </p>
        </section>

        <section style={{ 
          marginTop: '40px', 
          paddingTop: '20px', 
          borderTop: '1px solid #e0e0e0',
          textAlign: 'center',
          color: '#7f8c8d'
        }}>
          <p style={{ fontSize: '14px', marginBottom: '10px' }}>
            본 개인정보처리방침은 2025년 1월 1일부터 시행됩니다.
          </p>
          <button 
            onClick={() => window.history.back()}
            style={{
              marginTop: '20px',
              padding: '12px 30px',
              background: '#3498db',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              fontSize: '16px',
              cursor: 'pointer',
              transition: 'background 0.3s'
            }}
            onMouseOver={(e) => e.currentTarget.style.background = '#2980b9'}
            onMouseOut={(e) => e.currentTarget.style.background = '#3498db'}
          >
            돌아가기
          </button>
        </section>
      </div>
    </div>
  );
};

export default PrivacyPage;
