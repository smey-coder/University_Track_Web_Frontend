import React, { useState } from "react";
import axios from "axios";

const DashboardChat = () => {
  const API_URL = "http://192.168.100.39:8000/api/web/chat";

  const [messages, setMessages] = useState([
    {
      role: "assistant",
      message: "👋 Hello! I'm UniTrack Assistant. How can I help you?",
    },
  ]);

  const [input, setInput] = useState("");

  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = {
      role: "user",

      message: input,
    };

    setMessages((prev) => [...prev, userMessage]);

    setInput("");

    setLoading(true);

    try {
      const response = await axios.post(
        API_URL,

        {
          message: input,
        },

        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,

            Accept: "application/json",
          },
        },
      );

      setMessages((prev) => [
        ...prev,

        {
          role: "assistant",

          message: response.data.reply,
        },
      ]);
    } catch (error) {
      console.log("CHAT ERROR:", error.response?.data || error.message);

      setMessages((prev) => [
        ...prev,

        {
          role: "assistant",

          message: "❌ Sorry, I cannot connect right now.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      sendMessage();
    }
  };

  return (
    <div className="chat-container">
      <div className="chat-header">🤖 UniTrack AI Assistant</div>

      <div className="chat-body">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={
              msg.role === "user"
                ? "chat-message user-message"
                : "chat-message bot-message"
            }
          >
            {msg.message}
          </div>
        ))}

        {loading && <div className="chat-message bot-message">Thinking...</div>}
      </div>

      <div className="chat-input-area">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder="Ask UniTrack Assistant..."
        />

        <button onClick={sendMessage} disabled={loading}>
          ➤
        </button>
      </div>
    </div>
  );
};

export default DashboardChat;
