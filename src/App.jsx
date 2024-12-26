import React, { useState, useEffect } from "react";
import ProfileForm from "./components/CreateProfile";
import { db } from "./instantDB/db";
import ContactViewer from "./components/ContactList";
import MessageBox from "./components/ChatBox";

const App = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [selectedContact, setSelectedContact] = useState(null);

  useEffect(() => {
    const savedUserId = localStorage.getItem("userId");

    if (savedUserId) {
      // Subscribe to user data
      const unsubscribe = db.subscribeQuery(
        {
          users: {
            $filter: { id: savedUserId },
          },
        },
        (response) => {
          if (response.data?.users?.length > 0) {
            setCurrentUser(response.data.users[0]);
          } else {
            console.warn("User not found in the database.");
            localStorage.removeItem("userId");
          }
        }
      );

      // Cleanup subscription on component unmount
      return () => unsubscribe();
    }
  }, []);

  const handleProfileCreated = (user) => {
    setCurrentUser(user);
    localStorage.setItem("userId", user.id);
  };

  const handleSelectContact = (contact) => {
    setSelectedContact(contact);
  };

  if (!currentUser) {
    return <ProfileForm onProfileCreated={handleProfileCreated} />;
  }

  return (
    <div className="h-screen flex">
      {/* Contact Viewer Section */}
      <div className="w-1/3 border-r p-4">
        <ContactViewer
          activeUser={currentUser}
          onContactSelect={handleSelectContact}
        />
      </div>

      {/* Message Box Section */}
      <div className="w-2/3">
        {selectedContact ? (
          <MessageBox user={currentUser} contact={selectedContact} />
        ) : (
          <p className="text-center text-gray-500 mt-8">
            Select a contact to chat
          </p>
        )}
      </div>
    </div>
  );
};

export default App;
