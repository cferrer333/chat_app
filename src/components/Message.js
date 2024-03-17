import React from "react";
import { auth } from "../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { db } from "../firebase";
import { deleteDoc, updateDoc, collection } from "firebase/firestore";


const Message = ({ message }) => {
  const [user] = useAuthState(auth);

  // const deleteMessage = async (messageId) => {
  //   await deleteDoc(collection(db, "messages/", + messageId, ""));
  // }

  return (
    <div
      className={`chat-bubble ${message.uid === user.uid ? "right" : ""}`}>
      <img
        className="chat-bubble__left"
        src={message.avatar}
        alt="user avatar"
      />
      <div className="chat-bubble__right">
        <p className="user-name">{message.name} &nbsp; <span className="message-time">{message.createdAt && message.createdAt.seconds && (
      new Date(message.createdAt.seconds * 1000).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })
    )}</span> </p>
        <p className="user-message">{message.text}</p>
        {/* <button className="delete-message" onClick={() => deleteMessage(message.id)}>x</button> */}

        
      </div>
    </div>
  );
};

export default Message;
