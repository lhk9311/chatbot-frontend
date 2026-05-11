import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { io } from "socket.io-client";
import adobeLogo from './assets/Adobe Creative Cloud.png';
import autocadLogo from './assets/AutoCAD.png';
import beyondLogo from './assets/Beyond Compare.png';
import datagripLogo from './assets/DataGrip.jpg';
import dbeaverLogo from './assets/DBeaver Enterprise.jpg';
import exerdLogo from './assets/eXERD.jpg';
import illustratorLogo from './assets/Illustrator.jpg';
import intellijLogo from './assets/IntelliJ IDEA.png';
import microsoft365Logo from './assets/Microsoft 365.png';
import officeLogo from './assets/Office 2021 Pro.png';
import photoshopLogo from './assets/Photoshop.jpg';
import pycharmLogo from './assets/PyCharm.webp';
import securecrtLogo from './assets/SecureCRT.png';
import toadLogo from './assets/Toad for Oracle.jpg';
import webstormLogo from './assets/WebStorm.png';
import xshellLogo from './assets/Xshell.jpg';

const socket = io("http://52.78.28.91:4000");

function App() {
  const [message, setMessage] = useState("");
  const [chatList, setChatList] = useState([]);
  const bottomRef = useRef(null);
  const [faqList, setFaqList] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [pendingRequests, setPendingRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false); // 모바일 사이드바 토글

  useEffect(() => {
    axios
        .get('http://52.78.28.91:4000/messages')
        .then((res) => {
          const loadedMessages = [];
          res.data.forEach((item) => {
            loadedMessages.push({
              sender: 'user',
              text: item.message,
              time: new Date(item.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            });
            loadedMessages.push({
              sender: 'bot',
              text: item.reply,
              time: new Date(item.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            });
          });
          setChatList(loadedMessages);
        })
        .catch((err) => console.error('채팅 불러오기 실패:', err));
  }, []);

  useEffect(() => {
    fetch("http://52.78.28.91:4000/chat/faqs")
        .then(res => res.json())
        .then(data => setFaqList(data));

    socket.on("chat response", (reply) => {
      setIsLoading(false);
      setChatList(prev => [...prev, {
        sender: "bot",
        text: reply,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    });

    socket.on("admin-request", (data) => {
      setPendingRequests(prev => [data, ...prev]);
    });

    return () => {
      socket.off("chat response");
      socket.off("admin-request");
    };
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatList]);

  const sendMessage = (text) => {
    const currentMessage = text || message;
    if (currentMessage.trim() === "") return;
    setChatList(prev => [...prev, {
      sender: "user",
      text: currentMessage,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }]);
    setIsLoading(true);
    socket.emit("chat message", currentMessage);
    setMessage("");
  };

  const softwareList = [
    { name: "Adobe Creative Cloud", type: "기간제 / 계정형", image: adobeLogo },
    { name: "AutoCAD", type: "기간제 / 계정형", image: autocadLogo },
    { name: "Beyond Compare", type: "영구제 / 키형", image: beyondLogo },
    { name: "DataGrip", type: "기간제 / 계정형", image: datagripLogo },
    { name: "DBeaver Enterprise", type: "영구제 / 키형", image: dbeaverLogo },
    { name: "eXERD", type: "영구제 / 키형", image: exerdLogo },
    { name: "Illustrator", type: "기간제 / 계정형", image: illustratorLogo },
    { name: "IntelliJ IDEA", type: "기간제 / 계정형", image: intellijLogo },
    { name: "Microsoft 365", type: "기간제 / 계정형", image: microsoft365Logo },
    { name: "Office 2021 Pro", type: "영구제 / 키형", image: officeLogo },
    { name: "Photoshop", type: "기간제 / 계정형", image: photoshopLogo },
    { name: "PyCharm", type: "기간제 / 계정형", image: pycharmLogo },
    { name: "SecureCRT", type: "영구제 / 키형", image: securecrtLogo },
    { name: "Toad for Oracle", type: "영구제 / 키형", image: toadLogo },
    { name: "WebStorm", type: "기간제 / 계정형", image: webstormLogo },
    { name: "Xshell", type: "영구제 / 키형", image: xshellLogo },
  ];

  const filteredSoftwareList = softwareList.filter((sw) =>
      sw.name.toLowerCase().includes(searchKeyword.toLowerCase())
  );

  const faqCategoryMap = {
    "신청/승인": ["신청 어떻게 하나요?", "결재 프로세스는 어떻게 되나요?", "VDI환경은 어떻게 하나요?"],
    "재고/구매": ["구매 후 실 지급까지 얼마나 걸리나요?", "당장 필요한 경우는 어떻게 하나요?"],
    "설치": ["설치 링크가 차단되는데 어떻게 하나요?", "다운로드는 어디서 하나요?"],
    "라이선스/키": ["인증키는 어디서 받나요?", "계정 할당 방식인가요?", "BP인력도 사용 가능한가요?"],
    "기간제/갱신": ["라이선스 연장 가능한가요?", "갱신일자가 지났으면 어떻게 하나요?"],
    "반납/이관": ["다른 사람에게 이관 가능한가요?", "라이선스 반납 방법이 어떻게 되나요?", "퇴사자 라이선스는 어떻게 되나요?"],
    "NetHelper": ["NetHelper 차단됩니다.", "삭제키 발급 어떻게 하나요?", "사용자 변경 요청 / 사용자 인증 불가", "NetHelper 인가 처리 문의"],
    "기술지원": ["프로그램 실행 안됩니다."]
  };

  return (
      <>
        <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'Segoe UI', 'Noto Sans KR', sans-serif; }

        .app-page {
          min-height: 100vh;
          background: linear-gradient(135deg, #eef2ff 0%, #f8fafc 45%, #e0f2fe 100%);
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 16px;
        }

        .app-layout {
          width: 100%;
          max-width: 1400px;
          height: 90vh;
          display: flex;
          gap: 24px;
        }

        /* 사이드바 */
        .sidebar {
          width: 340px;
          min-width: 340px;
          background: #fff;
          border-radius: 24px;
          padding: 24px;
          overflow-y: auto;
          box-shadow: 0 10px 30px rgba(0,0,0,0.08);
        }

        /* 채팅 섹션 */
        .chat-section {
          flex: 1;
          background: #fff;
          border-radius: 24px;
          display: flex;
          flex-direction: column;
          overflow: hidden;
          box-shadow: 0 10px 30px rgba(0,0,0,0.08);
          min-width: 0;
        }

        .chat-header {
          padding: 20px 24px;
          background: linear-gradient(135deg, #2563eb, #1e40af);
          color: #fff;
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-shrink: 0;
        }

        .chat-title { font-size: 22px; font-weight: 800; }
        .chat-subtitle { font-size: 13px; opacity: 0.9; margin-top: 4px; }

        .badge {
          background: #22c55e;
          color: #fff;
          font-size: 11px;
          font-weight: 700;
          padding: 5px 10px;
          border-radius: 999px;
          white-space: nowrap;
        }

        /* 모바일 SW목록 버튼 */
        .sw-toggle-btn {
          display: none;
          border: none;
          background: rgba(255,255,255,0.2);
          color: #fff;
          padding: 6px 12px;
          border-radius: 12px;
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
          margin-left: 8px;
          white-space: nowrap;
        }

        .notice {
          margin: 12px 16px 0;
          padding: 10px 14px;
          background: #f1f5f9;
          border-radius: 14px;
          font-size: 12px;
          color: #475569;
          flex-shrink: 0;
        }

        .pending-panel {
          margin: 10px 16px 0;
          background: #f8fafc;
          border: 1px solid #dbe4ff;
          border-radius: 14px;
          padding: 12px;
          flex-shrink: 0;
        }

        .pending-title { font-size: 13px; font-weight: 700; color: #2563eb; margin-bottom: 6px; }
        .pending-empty { font-size: 12px; color: #94a3b8; }
        .pending-item { font-size: 12px; color: #334155; margin-bottom: 4px; }

        .faq-title {
          font-size: 16px;
          font-weight: 800;
          padding: 12px 16px 6px;
          color: #1e293b;
          flex-shrink: 0;
        }

        .category-area {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
          padding: 0 16px 8px;
          flex-shrink: 0;
        }

        .category-btn {
          border: none;
          background: #2563eb;
          color: #fff;
          border-radius: 20px;
          padding: 7px 12px;
          cursor: pointer;
          font-size: 12px;
          font-weight: 600;
        }

        .faq-area {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
          padding: 0 16px 8px;
          flex-shrink: 0;
        }

        .faq-btn {
          border: 1px solid #cbd5e1;
          background: #fff;
          border-radius: 16px;
          padding: 6px 12px;
          cursor: pointer;
          font-size: 12px;
        }

        .chat-box {
          flex: 1;
          padding: 16px;
          overflow-y: auto;
        }

        .message-row {
          display: flex;
          align-items: flex-end;
          gap: 8px;
          margin-bottom: 12px;
        }

        .bot-avatar {
          width: 28px;
          height: 28px;
          border-radius: 50%;
          background: #e0f2fe;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 15px;
          flex-shrink: 0;
        }

        .bubble {
          max-width: 75%;
          padding: 10px 12px;
          border-radius: 16px;
          font-size: 13px;
          line-height: 1.5;
          word-break: keep-all;
        }

        .user-bubble {
          background: #2563eb;
          color: #fff;
          border-bottom-right-radius: 4px;
        }

        .bot-bubble {
          background: #f1f5f9;
          color: #0f172a;
          border-bottom-left-radius: 4px;
        }

        .message-time { font-size: 10px; margin-top: 4px; opacity: 0.6; }

        .loading-msg { font-size: 12px; color: #64748b; margin: 8px; }

        .input-area {
          display: flex;
          gap: 8px;
          padding: 14px 16px;
          border-top: 1px solid #e5e7eb;
          background: #fff;
          flex-shrink: 0;
        }

        .chat-input {
          flex: 1;
          border: 1px solid #cbd5e1;
          border-radius: 12px;
          padding: 11px 12px;
          font-size: 13px;
          outline: none;
          min-width: 0;
        }

        .send-btn {
          border: none;
          border-radius: 12px;
          padding: 0 16px;
          background: #2563eb;
          color: #fff;
          font-size: 13px;
          font-weight: 700;
          cursor: pointer;
          white-space: nowrap;
        }

        /* SW 목록 스타일 */
        .sw-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 10px;
          padding-top: 8px;
        }

        .sw-card {
          background: #fff;
          border: 1px solid #dbe4ff;
          border-radius: 14px;
          padding: 14px;
          text-align: center;
          box-shadow: 0 2px 8px rgba(0,0,0,0.05);
        }

        .sw-logo { width: 38px; height: 38px; object-fit: contain; margin-bottom: 8px; }
        .sw-name { font-size: 12px; font-weight: 700; color: #1e293b; }
        .sw-type { margin-top: 3px; font-size: 11px; color: #64748b; }

        .search-wrapper { position: relative; margin: 12px 0; }
        .search-icon { position: absolute; left: 12px; top: 50%; transform: translateY(-50%); font-size: 13px; opacity: 0.6; }
        .search-input {
          width: 100%;
          padding: 10px 12px 10px 34px;
          border-radius: 12px;
          border: 1px solid #dbe4ff;
          font-size: 13px;
          outline: none;
        }

        /* 모바일 오버레이 사이드바 */
        .sidebar-overlay {
          display: none;
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.4);
          z-index: 100;
        }

        .sidebar-drawer {
          position: absolute;
          top: 0;
          left: 0;
          width: 85%;
          max-width: 340px;
          height: 100%;
          background: #fff;
          padding: 20px;
          overflow-y: auto;
        }

        .drawer-close {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
        }

        .close-btn {
          border: none;
          background: #f1f5f9;
          border-radius: 8px;
          padding: 6px 12px;
          cursor: pointer;
          font-size: 13px;
        }

        /* 반응형 */
        @media (max-width: 768px) {
          .app-page { padding: 0; align-items: stretch; }
          .app-layout { height: 100vh; height: 100dvh; gap: 0; }
          .sidebar { display: none; }
          .chat-section { border-radius: 0; }
          .sw-toggle-btn { display: block; }
          .sidebar-overlay { display: block; }
          .chat-title { font-size: 18px; }
          .bubble { max-width: 85%; }
        }

        @media (max-width: 480px) {
          .chat-header { padding: 14px 16px; }
          .category-btn { font-size: 11px; padding: 6px 10px; }
          .faq-btn { font-size: 11px; padding: 5px 10px; }
        }
      `}</style>

        <div className="app-page">
          <div className="app-layout">

            {/* 데스크탑 사이드바 */}
            <div className="sidebar">
              <h2 style={{ marginTop: 0, fontSize: '18px' }}>사내 SW 자산 목록</h2>
              <div className="search-wrapper">
                <span className="search-icon">🔍</span>
                <input
                    type="text"
                    placeholder="SW 검색..."
                    value={searchKeyword}
                    onChange={(e) => setSearchKeyword(e.target.value)}
                    className="search-input"
                />
              </div>
              <div className="sw-grid">
                {filteredSoftwareList.map((sw) => (
                    <div key={sw.name} className="sw-card">
                      <img src={sw.image} alt={sw.name} className="sw-logo" />
                      <div className="sw-name">{sw.name}</div>
                      <div className="sw-type">{sw.type}</div>
                    </div>
                ))}
              </div>
            </div>

            {/* 모바일 드로어 */}
            {showSidebar && (
                <div className="sidebar-overlay" onClick={() => setShowSidebar(false)}>
                  <div className="sidebar-drawer" onClick={(e) => e.stopPropagation()}>
                    <div className="drawer-close">
                      <h2 style={{ fontSize: '16px' }}>사내 SW 자산 목록</h2>
                      <button className="close-btn" onClick={() => setShowSidebar(false)}>닫기 ✕</button>
                    </div>
                    <div className="search-wrapper">
                      <span className="search-icon">🔍</span>
                      <input
                          type="text"
                          placeholder="SW 검색..."
                          value={searchKeyword}
                          onChange={(e) => setSearchKeyword(e.target.value)}
                          className="search-input"
                      />
                    </div>
                    <div className="sw-grid">
                      {filteredSoftwareList.map((sw) => (
                          <div key={sw.name} className="sw-card">
                            <img src={sw.image} alt={sw.name} className="sw-logo" />
                            <div className="sw-name">{sw.name}</div>
                            <div className="sw-type">{sw.type}</div>
                          </div>
                      ))}
                    </div>
                  </div>
                </div>
            )}

            {/* 채팅 섹션 */}
            <div className="chat-section">
              <div className="chat-header">
                <div>
                  <div className="chat-title">Software Helpdesk</div>
                  <div className="chat-subtitle">사내 소프트웨어 라이선스 문의 챗봇</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <button className="sw-toggle-btn" onClick={() => setShowSidebar(true)}>
                    📋 SW목록
                  </button>
                  <span className="badge">LIVE</span>
                </div>
              </div>

              <div className="notice">
                재고 · 설치 · 라이선스 · 반납 · 승인 · NetHelper 문의를 입력해보세요.
              </div>

              <div className="pending-panel">
                <div className="pending-title">미처리 문의</div>
                {pendingRequests.length === 0 ? (
                    <div className="pending-empty">없음</div>
                ) : (
                    pendingRequests.slice(0, 3).map((item, index) => (
                        <div key={index} className="pending-item">{item.message}</div>
                    ))
                )}
              </div>

              <div className="faq-title">📌 FAQ</div>

              <div className="category-area">
                {Object.keys(faqCategoryMap).map((category) => (
                    <button
                        key={category}
                        className="category-btn"
                        onClick={() => setSelectedCategory(selectedCategory === category ? null : category)}
                    >
                      {category}
                    </button>
                ))}
              </div>

              {selectedCategory && (
                  <div className="faq-area">
                    {faqCategoryMap[selectedCategory].map((faq) => (
                        <button key={faq} className="faq-btn" onClick={() => sendMessage(faq)}>
                          {faq}
                        </button>
                    ))}
                  </div>
              )}

              <div className="chat-box">
                {chatList.map((chat, index) => (
                    <div
                        key={index}
                        className="message-row"
                        style={{ justifyContent: chat.sender === "user" ? "flex-end" : "flex-start" }}
                    >
                      {chat.sender === "bot" && <div className="bot-avatar">🤖</div>}
                      <div className={`bubble ${chat.sender === "user" ? "user-bubble" : "bot-bubble"}`}>
                        <div style={{ whiteSpace: 'pre-line' }}>{chat.text}</div>
                        <div className="message-time">{chat.time}</div>
                      </div>
                    </div>
                ))}
                {isLoading && <div className="loading-msg">🧠 AI 답변 생성중...</div>}
                <div ref={bottomRef}></div>
              </div>

              <div className="input-area">
                <input
                    className="chat-input"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={(e) => { if (e.key === "Enter") sendMessage(); }}
                    placeholder="예) 신청 어떻게 하나요?"
                />
                <button className="send-btn" onClick={() => sendMessage()}>전송</button>
              </div>
            </div>
          </div>
        </div>
      </>
  );
}

export default App;