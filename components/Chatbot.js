import React, { useState, useEffect, useRef } from "react";

const Chatbot = () => {
  const [messages, setMessages] = useState([
    { role: 'bot', content: 'My name is Meta AI. How can I help you?' }
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false); // New: Show when AI is thinking
  const fileInputRef = useRef(null); // Ref for hidden file input
  const scrollRef = useRef(null);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Handle File Selection and Upload
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    setMessages((prev) => [...prev, { role: "user", content: `📎 Uploading: ${file.name}` }]);
    setIsTyping(true);

    try {
      const res = await fetch("http://localhost:8000/upload", {
        method: "POST",
        body: formData
      });
      const data = await res.json();
      setMessages((prev) => [
        ...prev,
        { role: "bot", content: data.message || "File received!" }
      ]);
    } catch (err) {
      setMessages((prev) => [...prev, { role: "bot", content: "File upload failed." }]);
    } finally {
      setIsTyping(false);
      e.target.value = null; // Reset input
    }
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg = { role: 'user', content: input };
    setMessages((prev) => [...prev, userMsg]);
    const currentInput = input;
    setInput("");
    setIsTyping(true); // Start loading animation

    try {
      const response = await fetch("http://localhost:8000/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: currentInput }),
      });
      
      const data = await response.json();
      
      if (data.reply) {
        setMessages((prev) => [...prev, { role: 'bot', content: data.reply }]);
      } else if (data.error) {
        setMessages((prev) => [...prev, { role: 'bot', content: "Error: " + data.error }]);
      }
    } catch (err) {
      setMessages((prev) => [...prev, { role: 'bot', content: "Cannot connect to server." }]);
    } finally {
      setIsTyping(false); // Stop loading animation
    }
  };

  return (
    <div style={{ border: '1px solid #ddd', borderRadius: '20px', width: '380px', height: '500px', display: 'flex', flexDirection: 'column', backgroundColor: 'white', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }}>
      {/* Meta AI Header */}
      <div style={{ padding: '15px', borderBottom: '1px solid #eee', display: 'flex', alignItems: 'center', gap: '10px' }}>
        <div style={{ width: '30px', height: '30px', borderRadius: '50%', background: 'linear-gradient(to right, #4facfe 0%, #00f2fe 100%)' }}></div>
        <span style={{ fontWeight: 'bold' }}>Meta AI</span>
      </div>

      {/* Messages */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '15px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {messages.map((msg, index) => (
          <div key={index} style={{
            alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
            backgroundColor: msg.role === 'user' ? '#007bff' : '#f1f1f2',
            color: msg.role === 'user' ? 'white' : '#1c1e21',
            padding: '10px 15px',
            borderRadius: msg.role === 'user' ? '18px 18px 2px 18px' : '18px 18px 18px 2px',
            maxWidth: '75%',
            fontSize: '14px',
            lineHeight: '1.4'
          }}>
            {msg.content}
          </div>
        ))}
        {isTyping && <div style={{ fontSize: '12px', color: '#999' }}>AI is typing...</div>}
        <div ref={scrollRef} />
      </div>

      

      {/* Input Field */}
      <div style={{ padding: '15px', borderTop: '1px solid #eee' }}>
        <div style={{ display: 'flex', gap: '8px', backgroundColor: '#f0f2f5', padding: '5px 12px', borderRadius: '25px' }}>
          {/* Hidden File Input */}
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            style={{ display: 'none' }} 
            accept="image/*,video/*,.pdf,.doc"
          />
          
          {/* Attachment Button (The + Icon) */}
          <button 
            onClick={() => fileInputRef.current.click()}
            style={{ border: 'none', background: 'transparent', cursor: 'pointer', fontSize: '20px', color: '#65676b', display: 'flex', alignItems: 'center' }}
          >
            +
          </button>
          <input 
            style={{ flex: 1, border: 'none', background: 'transparent', outline: 'none', padding: '8px', fontSize: '14px' }}
            value={input} 
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask Meta AI anything..."
          />
          <button onClick={handleSend} style={{ border: 'none', background: 'transparent', color: '#007bff', fontWeight: 'bold', cursor: 'pointer' }}>Send</button>
        </div>
      </div>
      </div>
  
  );
};

export default Chatbot;