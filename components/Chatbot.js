import React, { useState, useEffect, useRef } from "react";

const Chatbot = () => {
  const [messages, setMessages] = useState([{ role: 'bot', content: 'My name is Meta AI. How can I help you?' }]);
  const [input, setInput] = useState("");
  const [selectedFile, setSelectedFile] = useState(null); 
  const [isTyping, setIsTyping] = useState(false);
  const fileInputRef = useRef(null);
  const scrollRef = useRef(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) setSelectedFile(file);
  };

  const handleSend = async () => {
    if (!input.trim() && !selectedFile) return;

    // Display image name and text together in the bubble
    const userDisplay = selectedFile ? `📎 ${selectedFile.name}${input ? `: ${input}` : ""}` : input;
    setMessages((prev) => [...prev, { role: 'user', content: userDisplay }]);
    
    const currentInput = input;
    const currentFile = selectedFile;
    
    setInput("");
    setSelectedFile(null);
    setIsTyping(true);

    try {
      const formData = new FormData();
      formData.append("message", currentInput || "Analyze this image");
      if (currentFile) formData.append("file", currentFile);

      const response = await fetch("http://localhost:8000/upload", {
        method: "POST",
        body: formData, 
      });
      
      const data = await response.json();
      if (data.reply) {
        setMessages((prev) => [...prev, { role: 'bot', content: data.reply }]);
      } else if (data.error) {
        setMessages((prev) => [...prev, { role: 'bot', content: "Error: " + data.error }]);
      }
    } catch (err) {
      setMessages((prev) => [...prev, { role: 'bot', content: "Server connection failed." }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div style={{ border: '1px solid #ddd', borderRadius: '20px', width: '400px', height: '550px', display: 'flex', flexDirection: 'column', backgroundColor: 'white', fontFamily: 'sans-serif', margin: '20px auto', boxShadow: '0 8px 24px rgba(0,0,0,0.1)' }}>
      {/* Header */}
      <div style={{ padding: '15px 20px', borderBottom: '1px solid #eee', display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'linear-gradient(45deg, #00f2fe 0%, #4facfe 100%)' }}></div>
        <span style={{ fontWeight: '600', fontSize: '16px' }}>Meta AI</span>
      </div>

      {/* Messages area */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '20px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
        {messages.map((msg, index) => (
          <div key={index} style={{
            alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
            backgroundColor: msg.role === 'user' ? '#007bff' : '#f0f2f5',
            color: msg.role === 'user' ? 'white' : '#1c1e21',
            padding: '10px 16px',
            borderRadius: msg.role === 'user' ? '18px 18px 2px 18px' : '18px 18px 18px 2px',
            maxWidth: '80%',
            fontSize: '14px',
            lineHeight: '1.5',
            whiteSpace: 'pre-wrap'
          }}>
            {msg.content}
          </div>
        ))}
        {isTyping && <div style={{ fontSize: '12px', color: '#888', fontStyle: 'italic' }}>Meta AI is thinking...</div>}
        <div ref={scrollRef} />
      </div>

      {/* Input section */}
      <div style={{ padding: '15px' }}>
        {selectedFile && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px', padding: '5px 10px', backgroundColor: '#e7f3ff', borderRadius: '10px', width: 'fit-content' }}>
            <span style={{ fontSize: '12px', color: '#007bff' }}>📎 {selectedFile.name}</span>
            <button onClick={() => setSelectedFile(null)} style={{ border: 'none', background: 'none', color: '#ff4d4f', cursor: 'pointer', fontWeight: 'bold' }}>×</button>
          </div>
        )}
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', backgroundColor: '#f0f2f5', padding: '8px 15px', borderRadius: '25px' }}>
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            style={{ display: 'none' }} 
            accept="image/*" 
          />
          <button 
            onClick={() => fileInputRef.current.click()} 
            style={{ border: 'none', background: 'transparent', fontSize: '22px', color: '#65676b', cursor: 'pointer', display: 'flex' }}
          >+</button>
          
          <input 
            style={{ flex: 1, border: 'none', background: 'transparent', outline: 'none', fontSize: '14px', padding: '5px' }}
            value={input} 
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask Meta AI anything..." 
          />
          
          <button 
            onClick={handleSend} 
            style={{ border: 'none', background: 'transparent', color: '#007bff', fontWeight: '600', cursor: 'pointer', fontSize: '14px' }}
          >Send</button>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;
