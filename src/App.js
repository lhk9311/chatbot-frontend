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
//import xmanagerLogo from './assets/Xmanager.png';
import xshellLogo from './assets/Xshell.jpg';

const socket = io("http://localhost:3000");

function App() {
  const [message, setMessage] = useState("");
  const [chatList, setChatList] = useState([]);
  const bottomRef = useRef(null)
  const [faqList, setFaqList] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null); // faq
  const [searchKeyword, setSearchKeyword] = useState(""); // 검색
  const [pendingRequests, setPendingRequests] = useState([]); // 관리자 문의 패널
  const [isLoading, setIsLoading] = useState(false); // 로딩

  /*
  페이지 최초 실행 시
  이전 채팅 내역 불러오기
*/
  useEffect(() => {

    axios
        .get('http://localhost:3000/messages')

        .then((res) => {

          const loadedMessages = [];

          // DB 채팅 데이터를
          // 화면용 messages 형태로 변환
          res.data.forEach((item) => {

            // 사용자 질문
            loadedMessages.push({
              sender: 'user',
              text: item.message,
              time: new Date(item.created_at).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit'
              })
            });

            // 챗봇 답변
            loadedMessages.push({
              sender: 'bot',
              text: item.reply,
              time: new Date(item.created_at).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit'
              })
            });

          });

          // 화면에 채팅 세팅
          setChatList(loadedMessages);

        })

        .catch((err) => {

          console.error('채팅 불러오기 실패:', err);

        });

  }, []);

  useEffect(() => {

    fetch("http://localhost:3000/chat/faqs")
        .then(res => res.json())
        .then(data => {
          setFaqList(data);
        });

    socket.on("chat response", (reply) => {

      setIsLoading(false);

      setChatList(prev => [
        ...prev,
        { sender: "bot",
          text: reply,
          time: new Date().toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit'
          })}
      ]);
    });

    socket.on("admin-request", (data) => {

      console.log("미처리 문의 들어옴", data);

      setPendingRequests(prev => [
        data,
        ...prev
      ]);

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

    setChatList(prev => [
      ...prev,
      { sender: "user",
        text: currentMessage,
        time: new Date().toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit'
        })
      }
    ]);

    setIsLoading(true); // 로딩

    socket.emit("chat message", currentMessage);
    setMessage("");
  };

  const softwareList = [
    {
      name: "Adobe Creative Cloud",
      type: "기간제 / 계정형",
      image: adobeLogo
    },
    {
      name: "AutoCAD",
      type: "기간제 / 계정형",
      image: autocadLogo
    },
    {
      name: "Beyond Compare",
      type: "영구제 / 키형",
      image: beyondLogo
    },
    {
      name: "DataGrip",
      type: "기간제 / 계정형",
      image: datagripLogo
    },
    {
      name: "DBeaver Enterprise",
      type: "영구제 / 키형",
      image: dbeaverLogo
    },
    {
      name: "eXERD",
      type: "영구제 / 키형",
      image: exerdLogo
    },
    {
      name: "Illustrator",
      type: "기간제 / 계정형",
      image: illustratorLogo
    },
    {
      name: "IntelliJ IDEA",
      type: "기간제 / 계정형",
      image: intellijLogo
    },
    {
      name: "Microsoft 365",
      type: "기간제 / 계정형",
      image: microsoft365Logo
    },
    {
      name: "Office 2021 Pro",
      type: "영구제 / 키형",
      image: officeLogo
    },
    {
      name: "Photoshop",
      type: "기간제 / 계정형",
      image: photoshopLogo
    },
    {
      name: "PyCharm",
      type: "기간제 / 계정형",
      image: pycharmLogo
    },
    {
      name: "SecureCRT",
      type: "영구제 / 키형",
      image: securecrtLogo
    },
    {
      name: "Toad for Oracle",
      type: "영구제 / 키형",
      image: toadLogo
    },
    {
      name: "WebStorm",
      type: "기간제 / 계정형",
      image: webstormLogo
    },
    {
      name: "Xshell",
      type: "영구제 / 키형",
      image: xshellLogo
    }];

  {/*
  검색어 기반 SW 필터링
*/}
  const filteredSoftwareList = softwareList.filter((sw) =>
      sw.name.toLowerCase().includes(searchKeyword.toLowerCase())
  );

  {/*
  FAQ 카테고리 목록
  */}
  const faqCategoryMap = {

    "신청/승인": [
      "신청 어떻게 하나요?",
      "결재 프로세스는 어떻게 되나요?",
      "VDI환경은 어떻게 하나요?"
    ],

    "재고/구매": [
      "구매 후 실 지급까지 얼마나 걸리나요?",
      "당장 필요한 경우는 어떻게 하나요?"
    ],

    "설치": [
      "설치 링크가 차단되는데 어떻게 하나요?",
      "다운로드는 어디서 하나요?"
    ],

    "라이선스/키": [
      "인증키는 어디서 받나요?",
      "계정 할당 방식인가요?",
      "BP인력도 사용 가능한가요?"
    ],

    "기간제/갱신": [
      "라이선스 연장 가능한가요?",
      "갱신일자가 지났으면 어떻게 하나요?"
    ],

    "반납/이관": [
      "다른 사람에게 이관 가능한가요?",
      "라이선스 반납 방법이 어떻게 되나요?",
      "퇴사자 라이선스는 어떻게 되나요?"
    ],

    "NetHelper": [
      "NetHelper 차단됩니다.",
      "삭제키 발급 어떻게 하나요?",
      "사용자 변경 요청 / 사용자 인증 불가",
      "NetHelper 인가 처리 문의"
    ],

    "기술지원": [
      "프로그램 실행 안됩니다."
    ]
  };


  return (
      <div style={styles.page}>

        <div style={styles.layout}>

          {/* 왼쪽 SW 목록 */}
          <div style={styles.sidebar}>

            <h2 style={{ marginTop: 0 }}>
              사내 SW 자산 목록
            </h2>

            <div style={styles.searchWrapper}>

              <span style={styles.searchIcon}>
                🔍
              </span>

              <input
                  type="text"
                  placeholder="SW 검색..."
                  value={searchKeyword}
                  onChange={(e) => setSearchKeyword(e.target.value)}
                  style={styles.searchInput}
              />
            </div>

            <div style={styles.softwareGrid}>

              {filteredSoftwareList.map((sw) => (

                  <div key={sw.name} style={styles.softwareCard}>

                    <img
                        src={sw.image}
                        alt={sw.name}
                        style={styles.softwareLogo}
                    />

                    <div style={styles.softwareName}>
                      {sw.name}
                    </div>

                    <div style={styles.softwareType}>
                      {sw.type}
                    </div>

                  </div>

              ))}

            </div>

          </div>

          {/* 오른쪽 채팅 */}
          <div style={styles.chatSection}>
            <div style={styles.header}>
              <div>
                <h1 style={styles.title}>Software Helpdesk</h1>
                <p style={styles.subtitle}>사내 소프트웨어 라이선스 문의 챗봇</p>
              </div>
              <span style={styles.badge}>LIVE</span>
            </div>

            <div style={styles.notice}>
              재고 · 설치 · 라이선스 · 반납 · 승인 · NetHelper 문의를 입력해보세요.
            </div>

            <div style={styles.pendingMiniPanel}>

              <div style={styles.pendingMiniTitle}>
                미처리 문의
              </div>

              {pendingRequests.length === 0 ? (

                  <div style={styles.emptyPending}>
                    없음
                  </div>

              ) : (

                  pendingRequests.slice(0, 3).map((item, index) => (

                      <div key={index} style={styles.pendingMiniItem}>
                        {item.message}
                      </div>

                  ))

              )}

            </div>

            {/*
          <div style={styles.quickArea}>
            {faqList.map((faq) => (
                <button
                    key={faq.id}
                    style={styles.quickButton}
                    onClick={() => sendMessage(`${faq.software_name} ${faq.question_keyword}`)}
                >
                  {faq.software_name} {faq.question_keyword}
                </button>
            ))}
          </div>
          */}

            {/*
          FAQ 대분류 버튼 영역
          */}
            <div style={styles.faqTitle}>
              📌 FAQ
            </div>

            <div style={styles.categoryArea}>

              {Object.keys(faqCategoryMap).map((category) => (

                  <button
                      key={category}
                      style={styles.categoryButton}
                      onClick={() =>
                          setSelectedCategory(
                              selectedCategory === category ? null : category
                          )
                      }
                  >
                    {category}
                  </button>

              ))}

            </div>
            {/*
            선택된 카테고리 FAQ 버튼
            */}
            {selectedCategory && (

                <div style={styles.faqArea}>

                  {faqCategoryMap[selectedCategory].map((faq) => (

                      <button
                          key={faq}
                          style={styles.faqButton}
                          onClick={() => sendMessage(faq)}
                      >
                        {faq}
                      </button>

                  ))}

                </div>

            )}


            <div style={styles.chatBox}>
              {chatList.map((chat, index) => (
                  <div
                      key={index}
                      style={{
                        ...styles.messageRow,
                        justifyContent: chat.sender === "user" ? "flex-end" : "flex-start"
                      }}
                  >
                    {chat.sender === "bot" && (
                        <div style={styles.botAvatar}>🤖</div>
                    )}

                    <div
                        style={{
                          ...styles.bubble,
                          ...(chat.sender === "user"
                              ? styles.userBubble
                              : styles.botBubble)
                        }}
                    >

                      {/* 채팅 내용 */}
                      <div style={{ whiteSpace: 'pre-line' }}>
                        {chat.text}
                      </div>

                      {/* 시간 */}
                      <div style={styles.messageTime}>
                        {chat.time}
                      </div>

                    </div>
                  </div>
              ))}

              {isLoading && (
                  <div style={styles.loadingMessage}>
                    🧠 AI 답변 생성중...
                  </div>
              )}

              <div ref={bottomRef}></div>
            </div>

            <div style={styles.inputArea}>
              <input
                  style={styles.input}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") sendMessage();
                  }}
                  placeholder="예) 신청 어떻게 하나요?"
              />

              <button style={styles.button} onClick={() => sendMessage()}>
                전송
              </button>
            </div>
          </div>
        </div>
      </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #eef2ff 0%, #f8fafc 45%, #e0f2fe 100%)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontFamily: "'Segoe UI', 'Noto Sans KR', sans-serif",
  },
  chatCard: {
    width: "520px",
    height: "720px",
    backgroundColor: "#ffffff",
    borderRadius: "24px",
    boxShadow: "0 20px 60px rgba(15, 23, 42, 0.18)",
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
    border: "1px solid #e5e7eb",
  },
  header: {
    padding: "24px",
    background: "linear-gradient(135deg, #2563eb, #1e40af)",
    color: "#ffffff",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    margin: 0,
    fontSize: "26px",
    fontWeight: 800,
  },
  subtitle: {
    margin: "6px 0 0",
    fontSize: "14px",
    opacity: 0.9,
  },
  badge: {
    backgroundColor: "#22c55e",
    color: "#ffffff",
    fontSize: "12px",
    fontWeight: 700,
    padding: "6px 10px",
    borderRadius: "999px",
  },
  notice: {
    margin: "16px 20px 0",
    padding: "12px 14px",
    backgroundColor: "#f1f5f9",
    borderRadius: "14px",
    fontSize: "13px",
    color: "#475569",
  },
  quickArea: {
    display: "flex",
    gap: "8px",
    flexWrap: "wrap",
    padding: "12px 20px 0",
  },
  quickButton: {
    border: "1px solid #bfdbfe",
    backgroundColor: "#eff6ff",
    color: "#1d4ed8",
    borderRadius: "999px",
    padding: "8px 11px",
    fontSize: "12px",
    fontWeight: 600,
    cursor: "pointer",
  },
  chatBox: {
    flex: 1,
    padding: "20px",
    overflowY: "auto",
    marginTop: "30px",
  },
  messageRow: {
    display: "flex",
    alignItems: "flex-end",
    gap: "8px",
    marginBottom: "14px",
  },
  botAvatar: {
    width: "32px",
    height: "32px",
    borderRadius: "50%",
    backgroundColor: "#e0f2fe",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "17px",
  },
  bubble: {
    maxWidth: "72%",
    padding: "12px 14px",
    borderRadius: "18px",
    fontSize: "14px",
    lineHeight: 1.5,
    wordBreak: "keep-all",
  },
  userBubble: {
    backgroundColor: "#2563eb",
    color: "#ffffff",
    borderBottomRightRadius: "4px",
  },
  botBubble: {
    backgroundColor: "#f1f5f9",
    color: "#0f172a",
    borderBottomLeftRadius: "4px",
  },
  inputArea: {
    display: "flex",
    gap: "10px",
    padding: "18px 20px",
    borderTop: "1px solid #e5e7eb",
    backgroundColor: "#ffffff",
  },
  input: {
    flex: 1,
    border: "1px solid #cbd5e1",
    borderRadius: "14px",
    padding: "13px 14px",
    fontSize: "14px",
    outline: "none",
  },
  button: {
    border: "none",
    borderRadius: "14px",
    padding: "0 20px",
    backgroundColor: "#2563eb",
    color: "#ffffff",
    fontSize: "14px",
    fontWeight: 700,
    cursor: "pointer",
  },
  softwareGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(2, 1fr)",
    gap: "12px",
    padding: "18px 20px 40P",
    overflowY: "auto",
  },
  softwareCard: {
    backgroundColor: "#ffffff",
    border: "1px solid #dbe4ff",
    borderRadius: "16px",
    padding: "16px",
    textAlign: "center",
    boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
  },

  softwareLogo: {
    width: "42px",
    height: "42px",
    objectFit: "contain",
    marginBottom: "10px",
  },

  softwareName: {
    fontSize: "14px",
    fontWeight: 700,
    color: "#1e293b",
  },

  softwareType: {
    marginTop: "4px",
    fontSize: "12px",
    color: "#64748b",
  },
  layout: {
    width: "1400px",
    height: "90vh",
    display: "flex",
    gap: "24px",
  },

  sidebar: {
    width: "340px",
    backgroundColor: "#ffffff",
    borderRadius: "24px",
    padding: "24px",
    overflowY: "auto",
    boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
  },

  chatSection: {
    flex: 1,
    backgroundColor: "#ffffff",
    borderRadius: "24px",
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
    boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
  },

  categoryArea: {
    display: "flex",
    flexWrap: "wrap",
    gap: "10px",
    padding: "16px 20px 0",
  },

  categoryButton: {
    border: "none",
    backgroundColor: "#2563eb",
    color: "#fff",
    borderRadius: "20px",
    padding: "10px 16px",
    cursor: "pointer",
    fontSize: "13px",
    fontWeight: 600,
  },

  faqArea: {
    display: "flex",
    flexWrap: "wrap",
    gap: "10px",
    padding: "14px 20px",
  },

  faqButton: {
    border: "1px solid #cbd5e1",
    backgroundColor: "#ffffff",
    borderRadius: "18px",
    padding: "8px 14px",
    cursor: "pointer",
    fontSize: "13px",
  },

  faqTitle: {
    fontSize: "18px",
    fontWeight: "800",
    padding: "20px 20px 10px",
    color: "#1e293b",
  },

  messageTime: {
    fontSize: "11px",
    marginTop: "6px",
    opacity: 0.6,
  },

  searchInput: {
    width: "100%",
    padding: "12px 14px 12px 38px",
    borderRadius: "14px",
    border: "1px solid #dbe4ff",
    marginTop: "16px",
    marginBottom: "20px",
    fontSize: "14px",
    outline: "none",
    boxSizing: "border-box",
  },
  searchWrapper: {
    position: "relative",
    marginTop: "16px",
    marginBottom: "20px",
  },

  searchIcon: {
    position: "absolute",
    left: "14px",
    top: "50%",
    transform: "translateY(-50%)",
    fontSize: "14px",
    opacity: 0.6,
  },
  pendingPanel: {
    marginTop: "30px",
    borderTop: "1px solid #e5e7eb",
    paddingTop: "20px",
  },

  pendingTitle: {
    fontSize: "16px",
    fontWeight: "700",
    marginBottom: "14px",
    color: "#1e293b",
  },

  emptyPending: {
    fontSize: "13px",
    color: "#94a3b8",
  },

  pendingItem: {
    backgroundColor: "#f8fafc",
    borderRadius: "14px",
    padding: "12px",
    marginBottom: "10px",
  },

  pendingSoftware: {
    fontSize: "13px",
    fontWeight: "700",
    color: "#2563eb",
  },

  pendingMessage: {
    marginTop: "4px",
    fontSize: "13px",
    color: "#334155",
  },
  pendingMiniPanel: {
    margin: "14px 20px 0",
    backgroundColor: "#f8fafc",
    border: "1px solid #dbe4ff",
    borderRadius: "16px",
    padding: "14px",
  },

  pendingMiniTitle: {
    fontSize: "14px",
    fontWeight: "700",
    color: "#2563eb",
    marginBottom: "10px",
  },

  pendingMiniItem: {
    fontSize: "13px",
    color: "#334155",
    marginBottom: "6px",
  },

  loadingMessage: {
    fontSize: "13px",
    color: "#64748b",
    marginTop: "8px",
    marginLeft: "8px",
  },
};

export default App;