import React from "react";
import { auth } from "../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { db } from "../firebase";
import { getDoc, deleteDoc, doc, collection } from "firebase/firestore";

const Message = ({ message }) => {
  const [user] = useAuthState(auth);

 
  const getMessageRef = async () => {
    const messageRef = collection(db, "messages");
    const docSnap = await getDoc(doc(db, "messages", messageRef.id));
  if (docSnap.exists()) {
    console.log("Document ID:", docSnap.id);
    // deleteMessage(docSnap.id);
    // Perform further actions with the document ID as needed
  } else {
    console.log("Document does not exist");
  }
    }



  // const deleteMessage = async (messageId) => {
  //   try {
  //     const docSnap = await getDoc(doc(db, "messages", messageRef.id));
  //   if (docSnap.exists()) {
  //     console.log("Document ID:", docSnap.id);
  //     deleteMessage(docSnap.id);
  //     // Perform further actions with the document ID as needed
  //   } else {
  //     console.log("Document does not exist");
  //   }
  //     console.log("Message deleted successfully");
  //   } catch (error) {
  //     console.error("Error deleting message: ", error);
  //   }
  // };
  
  


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
        <button
          className="delete-message"
          onClick={() => getMessageRef()}
        >
          x
        </button>

        
      </div>
    </div>
  );
};

export default Message;
