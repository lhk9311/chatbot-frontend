import { useState } from 'react';

function App() {
  const [message, setMessage] = useState("");
  const [reply, setReply] = useState("");

  const sendMessage = async () => {
    const res = await fetch("http://localhost:3000/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ message })
    });

    const data = await res.json();
    setReply(data.reply);
  };

  return (
    <div style={{ padding: "50px" }}>
      <h1>챗봇</h1>

      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="메시지 입력"
      />

      <button onClick={sendMessage}>전송</button>

      <h2>응답:</h2>
      <p>{reply}</p>
    </div>
  );
}

export default App;