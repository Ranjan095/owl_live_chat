import React, { useState, useEffect, useRef } from "react";
import { db, generateId } from "../instantDB/db";

const MessageBox = ({ user, contact }) => {
  const [chatHistory, setChatHistory] = useState([]);
  const [messageText, setMessageText] = useState("");
  const chatEndRef = useRef(null); // Reference to the end of the chat container

  useEffect(() => {
    // Subscribe to retrieve messages from the database
    const unsubscribe = db.subscribeQuery({ messages: {} }, (response) => {
      console.log(response);
      if (response.data?.messages) {
        // Filter chat messages between the current user and the selected contact
        const conversation = response.data.messages.filter(
          (message) =>
            (message.senderId === user.id && message.receiverId === contact.id) ||
            (message.senderId === contact.id && message.receiverId === user.id)
        );

        // Sort messages by timestamp for chronological order
        const orderedMessages = conversation.sort(
          (msgA, msgB) => msgA.timestamp - msgB.timestamp
        );
        setChatHistory(orderedMessages);
      }
    });

    return () => {
      // Unsubscribe from the query when the component unmounts
      unsubscribe();
    };
  }, [user, contact]);

  useEffect(() => {
    // Scroll to the bottom whenever chatHistory changes
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory]);

  const sendMessage = () => {
    if (messageText.trim()) {
      db.transact(
        db.tx.messages[generateId()].update({
          senderId: user.id,
          receiverId: contact.id,
          text: messageText,
          timestamp: Date.now(),
        })
      );
      setMessageText("");
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      sendMessage();
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* Chat History */}
      <div className="flex-grow overflow-y-scroll px-4 py-3 space-y-3">
        {chatHistory.map((message) => (
          <div
            key={message.id}
            className={`flex ${
              message.senderId === user.id ? "justify-end" : "justify-start"
            }`}
          >
            <span
              className={`inline-block px-5 py-2 rounded-lg ${
                message.senderId === user.id
                  ? "bg-green-500 text-white"
                  : "bg-gray-300 text-black"
              }`}
            >
              {message.text}
            </span>
          </div>
        ))}
        {/* This element acts as the anchor to scroll to */}
        <div ref={chatEndRef} />
      </div>
      {/* Input Section */}
      <div className="p-4 border-t flex items-center gap-3">
        <input
          type="text"
          className="flex-grow border border-gray-300 px-4 py-2 rounded-md focus:outline-none focus:ring focus:border-blue-400"
          placeholder="Write your message..."
          value={messageText}
          onChange={(e) => setMessageText(e.target.value)}
          onKeyDown={handleKeyDown} // Add this event handler
        />
        <button
          className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
          onClick={sendMessage}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default MessageBox;
