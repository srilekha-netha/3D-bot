import React from "react";
import ChatBox from "./ChatBox";
import "./styles.css";

function App() {
  return (
    <div className="chatbox-container">
      {/* Orbiting planets */}
      <div className="planet planet1"></div>
      <div className="planet planet2"></div>
      <div className="planet planet3"></div>

      {/* Floating Chatbox */}
      <ChatBox />
    </div>
  );
}

export default App;
