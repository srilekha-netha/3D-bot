import React, { useState, useEffect, useRef } from "react";

// Remove only emoji/pictographic characters, preserving normal text
function sanitizeText(text) {
  if (!text) return "";
  try {
    // Prefer precise Unicode property escapes when supported
    const emojiProps = /\p{Extended_Pictographic}|\p{Emoji_Presentation}|\p{Emoji_Modifier_Base}|\p{Emoji_Modifier}|[\u200D\uFE0F]/gu;
    return text.replace(emojiProps, "").replace(/\s{2,}/g, " ").trim();
  } catch (e) {
    // Fallback for environments without Unicode property escapes
    const emojiRanges = /[\u200D\uFE0F]|[\u{1F1E6}-\u{1F1FF}]|[\u{1F300}-\u{1FAFF}]|[\u2600-\u27BF]/gu;
    return text.replace(emojiRanges, "").replace(/\s{2,}/g, " ").trim();
  }
}

function ChatBox() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const messagesContainerRef = useRef(null);
  const [listening, setListening] = useState(false);
  const recognitionRef = useRef(null);
  const speakingRef = useRef(false);
  const quickReplies = [
    "Plan a Mars trip",
    "Best time to visit Saturn",
    "How long to reach Neptune?",
    "Cost of lunar tourism"
  ];

  const sendMessage = async (overrideText) => {
    const textToSend = overrideText ?? input;
    if (!textToSend) return;
    const userMessage = { id: Date.now() + "-u", sender: "user", text: textToSend, likes: 0, dislikes: 0, myFeedback: null };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    try {
      const res = await fetch("http://localhost:5000/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: textToSend }),
      });
      const data = await res.json();
      const clean = sanitizeText(data.reply);
      // Truncate overly long responses to avoid visual overflow
      const MAX_CHARS = 450;
      const trimmed = clean.length > MAX_CHARS ? clean.slice(0, MAX_CHARS).trim() + "…" : clean;
      const botMessage = { id: Date.now() + "-b", sender: "bot", text: trimmed, likes: 0, dislikes: 0, myFeedback: null };
      setMessages((prev) => [...prev, botMessage]);
    } catch (err) {
      console.error(err);
    }
  };

  // Auto-scroll to the latest message
  useEffect(() => {
    const container = messagesContainerRef.current;
    if (container) {
      container.scrollTo({ top: container.scrollHeight, behavior: "smooth" });
    }
  }, [messages]);

  // Init SpeechRecognition for voice input
  useEffect(() => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SR) {
      const rec = new SR();
      rec.lang = "en-US";
      rec.interimResults = false;
      rec.maxAlternatives = 1;
      rec.onresult = (e) => {
        const transcript = e.results[0][0].transcript;
        setInput(transcript);
        try { rec.stop(); } catch {}
      };
      rec.onend = () => setListening(false);
      rec.onerror = () => setListening(false);
      rec.onspeechend = () => { try { rec.stop(); } catch {} };
      recognitionRef.current = rec;
    } else {
      recognitionRef.current = null;
    }
  }, []);

  const handleMic = () => {};
  const toggleLike = (id) => {
    setMessages((prev) => prev.map((m) => {
      if (m.id !== id) return m;
      let likes = m.likes || 0;
      let dislikes = m.dislikes || 0;
      let my = m.myFeedback || null;
      if (my === 'like') {
        likes -= 1; my = null;
      } else if (my === 'dislike') {
        dislikes -= 1; likes += 1; my = 'like';
      } else {
        likes += 1; my = 'like';
      }
      return { ...m, likes, dislikes, myFeedback: my };
    }));
  };

  const toggleDislike = (id) => {
    setMessages((prev) => prev.map((m) => {
      if (m.id !== id) return m;
      let likes = m.likes || 0;
      let dislikes = m.dislikes || 0;
      let my = m.myFeedback || null;
      if (my === 'dislike') {
        dislikes -= 1; my = null;
      } else if (my === 'like') {
        likes -= 1; dislikes += 1; my = 'dislike';
      } else {
        dislikes += 1; my = 'dislike';
      }
      return { ...m, likes, dislikes, myFeedback: my };
    }));
  };

  const speakText = (text) => {
    try {
      // Ensure it speaks once: cancel any queued/ongoing speech
      window.speechSynthesis.cancel();
      const utter = new SpeechSynthesisUtterance(text);
      utter.rate = 1;
      speakingRef.current = true;
      utter.onend = () => { speakingRef.current = false; };
      window.speechSynthesis.speak(utter);
    } catch {}
  };

  const copyText = async (text) => {
    try { await navigator.clipboard.writeText(text); } catch {}
  };

  const deleteMessage = (id) => {
    setMessages((prev) => prev.filter((m) => m.id !== id));
  };

  const regenerateFromPreviousUser = () => {
    // find last user message
    for (let i = messages.length - 1; i >= 0; i -= 1) {
      if (messages[i].sender === "user") {
        sendMessage(messages[i].text);
        break;
      }
    }
  };

  return (
    <div className="chatbox">
      <div className="header">
        <div className="title">Space Travel Assistant</div>
      </div>
      <div className="messages" ref={messagesContainerRef}>
        {messages.map((msg, index) => (
          <div key={msg.id || index} className={`message ${msg.sender}`}>
            <div className="message-text">{msg.text}</div>
            <div className="message-actions">
              <button title="Copy" aria-label="Copy" onClick={() => copyText(msg.text)}>📋</button>
              <button title="Delete" aria-label="Delete" onClick={() => deleteMessage(msg.id)}>🗑️</button>
              {msg.sender === "bot" && (
                <>
                  <button title="Regenerate" aria-label="Regenerate" onClick={regenerateFromPreviousUser}>♻️</button>
                  <button title="Speak" aria-label="Speak" onClick={() => speakText(msg.text)}>🔊</button>
                  <button className={msg.myFeedback === 'like' ? 'active like' : ''} title="Like" aria-label="Like" onClick={() => toggleLike(msg.id)}>👍 {msg.likes || 0}</button>
                  <button className={msg.myFeedback === 'dislike' ? 'active dislike' : ''} title="Dislike" aria-label="Dislike" onClick={() => toggleDislike(msg.id)}>👎 {msg.dislikes || 0}</button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
      <div className="suggestions">
        {quickReplies.map((q) => (
          <button key={q} className="chip" onClick={() => sendMessage(q)}>{q}</button>
        ))}
      </div>
      <div className="input-area">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about space tours..."
        />
        <button onClick={() => sendMessage()}>Send</button>
      </div>
    </div>
  );
}

export default ChatBox;