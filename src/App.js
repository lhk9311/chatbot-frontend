import { useState, useEffect, useRef } from 'react';
import { io } from "socket.io-client";

const socket = io("http://localhost:3000");

function App() {
  const [message, setMessage] = useState("");
  const [chatList, setChatList] = useState([]);
  const bottomRef = useRef(null);

  useEffect(() => {
    fetch("http://localhost:3000/messages")
      .then(res => res.json())
      .then(data => {
        const formatted = data.map(item => [
          { sender: "user", text: item.message },
          { sender: "bot", text: item.reply }
        ]).flat();

        setChatList(formatted);
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

  const sendMessage = () => {
    if (message.trim() === "") return;

    const currentMessage = message;

    setChatList(prev => [
      ...prev,
      { sender: "user", text: currentMessage }
    ]);

    socket.emit("chat message", currentMessage);

    setMessage("");
  };

  return (
    <div style={{ width: "500px", margin: "50px auto", fontFamily: "Arial" }}>
      <h1>소프트웨어 문의 챗봇</h1>

      <div style={{
        border: "1px solid #ddd",
        padding: "20px",
        height: "400px",
        overflowY: "auto",
        backgroundColor: "#f9f9f9"
      }}>
        {chatList.map((chat, index) => (
          <div
            key={index}
            style={{
              textAlign: chat.sender === "user" ? "right" : "left",
              margin: "10px 0"
            }}
          >
            <span style={{
              display: "inline-block",
              padding: "10px",
              borderRadius: "10px",
              backgroundColor: chat.sender === "user" ? "#d1e7ff" : "#eee"
            }}>
              {chat.text}
            </span>
          </div>
        ))}

      <div ref={bottomRef}></div> 
      </div>

      <div style={{ marginTop: "10px", display: "flex", gap: "10px" }}>
      <input
        style={{ flex: 1, padding: "10px" }}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            sendMessage();
          }
        }}
        placeholder="문의 내용을 입력하세요"
      />

        <button onClick={sendMessage}>
          전송
        </button>
      </div>
    </div>
  );
}

export default App;