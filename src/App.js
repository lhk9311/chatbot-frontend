import { useState, useEffect } from 'react';

function App() {
  const [message, setMessage] = useState("");
  const [chatList, setChatList] = useState([]);

  useEffect(() => {
    const fetchMessages = async () => {
      const res = await fetch("http://localhost:3000/messages");
      const data = await res.json();
  
      const formatted = data.map(item => [
        { sender: "user", text: item.message },
        { sender: "bot", text: item.reply }
      ]).flat();
  
      setChatList(formatted);
    };
  
    fetchMessages();
  }, []);

  const sendMessage = async () => {
    if (message.trim() === "") return;

    const userMessage = {
      sender: "user",
      text: message
    };

    setChatList(prev => [...prev, userMessage]);

    const res = await fetch("http://localhost:3000/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ message })
    });

    const data = await res.json();

    const botMessage = {
      sender: "bot",
      text: data.reply
    };

    setChatList(prev => [...prev, botMessage]);
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
      </div>

      <div style={{ marginTop: "10px", display: "flex", gap: "10px" }}>
        <input
          style={{ flex: 1, padding: "10px" }}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
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