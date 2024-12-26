import React, { useState, useEffect } from "react";
import { db } from "../instantDB/db";

const ContactViewer = ({ activeUser, onContactSelect }) => {
  const [userList, setUserList] = useState([]);
  const [searchQuery, setSearchQuery] = useState(""); // Track the search query
  const [activeContact, setActiveContact] = useState(null); // Tracks currently selected contact

  useEffect(() => {
    // Fetch user list while excluding the active user
    const unsubscribe = db.subscribeQuery(
      {
        users: {},
      },
      (response) => {
        if (response.data && Array.isArray(response.data.users)) {
          const filteredUsers = response.data.users.filter(
            (user) => user.id !== activeUser.id
          );
          setUserList(filteredUsers);
        }
      }
    );

    // Cleanup subscription on unmount or activeUser change
    return () => unsubscribe();
  }, [activeUser]);

  // Handle selection of a contact
  const handleContactClick = (user) => {
    setActiveContact(user); // Set the clicked contact as active
    onContactSelect(user); // Trigger callback function
  };

  // Filter users based on the search query
  const filteredUsers = userList.filter((user) =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-4 overflow-y-scroll px-4 h-full">
      {/* Display active user profile name */}

      {/* Sticky Search input */}
      <div className="mb-4 sticky top-0 bg-white z-10">
        <div className="mb-4">
          <p className="text-xl font-semibold text-gray-800">
            {activeUser.name}
          </p>
        </div>
        <input
          type="text"
          placeholder="Search contacts..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-3 py-2 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Display filtered contacts */}
      {filteredUsers.length > 0 ? (
        filteredUsers.map((user) => (
          <div
            key={user.id}
            className={`flex items-center gap-3 p-3 rounded-md cursor-pointer transform transition-all ${
              activeContact?.id === user.id
                ? "bg-blue-600 text-white"
                : "hover:bg-gray-300"
            }`}
            onClick={() => handleContactClick(user)}
          >
            {/* User Avatar */}
            <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-xl font-medium">
              {user.name.charAt(0).toUpperCase()}
            </div>
            {/* User Name and Details */}
            <div className="flex-grow">
              <p className="text-gray-900 text-sm font-bold">
                {user.name}
              </p>
              <p className="text-gray-500 text-xs truncate">
                {/* Add preview or custom text here */}
              </p>
            </div>
          </div>
        ))
      ) : (
        <p className="text-center text-gray-500 mt-4">No contacts found</p>
      )}
    </div>
  );
};

export default ContactViewer;
