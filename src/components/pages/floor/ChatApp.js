import React, { useState, useEffect, useRef } from "react";

const ChatApp = () => {
  const [ws, setWs] = useState(null);
  const [currentUser, setCurrentUser] = useState("");
  const [connected, setConnected] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const messagesEndRef = useRef(null);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const connect = () => {
    const token = sessionStorage.getItem("token");
    const socketUrl = new URL("ws://localhost:8080/api/v1");
    if (token) socketUrl.searchParams.set("token", token);
    const socket = new WebSocket(socketUrl.toString());

    socket.onmessage = (e) => {
      const messageData = JSON.parse(e.data);
      setMessages((prev) => [
        ...prev,
        { type: "incoming", ...messageData },
      ]);
    };

    socket.onopen = () => {
      setConnected(true);
    };

    setWs(socket);
  };

  const sendToGroupChat = () => {
    if (!ws || ws.readyState !== WebSocket.OPEN) return;

    const messageObject = {
      name: currentUser,
      message: message,
    };

    // Show outgoing message immediately
    setMessages((prev) => [
      ...prev,
      { type: "outgoing", name: currentUser, message },
    ]);

    ws.send(JSON.stringify(messageObject));
    setMessage("");
  };

  return (
    <div className="container mt-3">
      <div className="row mb-2">
        <div className="col">
          <input
            type="text"
            id="name"
            className="form-control mb-2"
            placeholder="Your Name"
            value={currentUser}
            onChange={(e) => setCurrentUser(e.target.value)}
            disabled={connected}
          />
          <input
            id="connectButton"
            type="button"
            value={connected ? "Connected" : "Connect"}
            className="btn btn-primary mb-2"
            onClick={connect}
            disabled={connected || !currentUser}
          />
        </div>
      </div>

      <div className="row mb-2">
        <div className="col">
          <input
            type="text"
            id="message"
            className="form-control mb-2"
            placeholder="Type a message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            disabled={!connected}
          />
          <input
            type="button"
            value="Send"
            className="btn btn-success mb-2"
            onClick={sendToGroupChat}
            disabled={!connected || !message}
          />
        </div>
      </div>

      <div className="row">
        <div className="col">
          <div id="messages" className="border p-3" style={{ minHeight: "200px" }}>
            {messages.map((msg, index) => (
              <div
                key={index}
                className={msg.type === "incoming" ? "text-primary" : "text-success"}
              >
                {msg.name} : {msg.message}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatApp;
