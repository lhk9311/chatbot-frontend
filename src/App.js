import { useState, useEffect, useRef } from 'react';
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
  const bottomRef = useRef(null);

  const [faqList, setFaqList] = useState([]);

  useEffect(() => {
    fetch("http://localhost:3000/chat/messages")
        .then(res => res.json())
        .then(data => {
          const formatted = data.map(item => [
            { sender: "user", text: item.message },
            { sender: "bot", text: item.reply }
          ]).flat();
          setChatList(formatted);
        });

    fetch("http://localhost:3000/chat/faqs")
        .then(res => res.json())
        .then(data => {
          setFaqList(data);
        });

    socket.on("chat response", (reply) => {
      setChatList(prev => [
        ...prev,
        { sender: "bot", text: reply }
      ]);
    });

    return () => {
      socket.off("chat response");
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
      { sender: "user", text: currentMessage }
    ]);

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
    }
  ];

  return (
      <div style={styles.page}>

        <div style={styles.layout}>

          {/* 왼쪽 SW 목록 */}
          <div style={styles.sidebar}>

            <h2 style={{ marginTop: 0 }}>
              사내 SW 자산 목록
            </h2>

            <div style={styles.softwareGrid}>

              {softwareList.map((sw) => (

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
                        ...(chat.sender === "user" ? styles.userBubble : styles.botBubble)
                      }}
                  >
                    {chat.text}
                  </div>
                </div>
            ))}
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
                placeholder="예) 인텔리제이 재고 있어요?"
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
    padding: "18px 20px 0",

    maxHeight: "260px",
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
};

export default App;