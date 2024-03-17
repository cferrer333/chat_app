import React, { useState, useEffect, useRef } from "react";
import Swal from "sweetalert2"
import { auth } from "../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { db } from "../firebase";
import { getDocs, deleteDoc, doc, collection, query, orderBy, limit, onSnapshot, } from "firebase/firestore";

const Message = ({ message }) => {
  const [user] = useAuthState(auth);
  const [messages, setMessages] = useState([]);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  const scroll = useRef();

  const handleEdit = (id) => {
    if (message.uid === user.uid) {
      const [message] = messages.filter((message) => message.id === id);
      setSelectedMessage(message);
      setIsEditing(true);
    } else {
      // Add a notification that the user can only edit their own messages
      Swal.fire({
        icon: 'error',
        title: 'Permission denied',
        text: 'You can only edit your own messages.',
      });
    }
  };
  const handleDelete = (id) => {
    if (message.uid === user.uid) {
      Swal.fire({
        icon: 'warning',
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        showCancelButton: true,
        confirmButtonText: 'Yes, delete it!',
        cancelButtonText: 'No, cancel!',
      }).then((result) => {
        if (result.value) {
          deleteDoc(doc(db, "messages", id));
          
          Swal.fire({
            icon: 'success',
            title: 'Deleted!',
            text: 'Message has been deleted.',
            showConfirmButton: false,
            timer: 1500,
          });
          
          const messagesCopy = messages.filter((message) => message.id !== id);
          setMessages(messagesCopy);
        }
      });
    } else {
      // Add a notification that the user can only delete their own messages
      Swal.fire({
        icon: 'error',
        title: 'Permission denied',
        text: 'You can only delete your own messages.',
      });
    }
  };

  useEffect(() => {
    const q = query(
      collection(db, "messages"),
      orderBy("createdAt", "desc"),
      limit(50)
    );
    
    const unsubscribe = onSnapshot(q, (QuerySnapshot) => {
      const fetchedMessages = [];
      QuerySnapshot.forEach((doc) => {
        fetchedMessages.push({ ...doc.data(), id: doc.id });
      });
      const sortedMessages = fetchedMessages.sort(
        (a, b) => a.createdAt - b.createdAt
      );
      setMessages(sortedMessages);
    });
    return () => unsubscribe;
  }, []);

//  const getMessages = async () => {const querySnapshot = await getDocs(collection(db, "messages"));
//  querySnapshot.forEach((doc) => {
//    // doc.data() is never undefined for query doc snapshots
//    console.log(doc.id, " => ", doc.data());
//  });  
//  setMessages(messages);
//  }
 
//  useEffect(() => {
//    getMessages();
//  }, []);
  // const getMessageRef = async () => {
  //   const messageRef = collection(db, "messages");
  //   const docSnap = await getDoc(doc(db, "messages", messageRef.id));
  // if (docSnap.exists()) {
  //   console.log("Document ID:", docSnap.id);
  //   // deleteMessage(docSnap.id);
  //   // Perform further actions with the document ID as needed
  // } else {
  //   console.log("Document does not exist");
  // }
  //   }



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
          onClick={() => handleDelete(message.id)}
        >
          x
        </button>
        <button
          className="edit-message"
          onClick={() => handleEdit(message.id)}
        >
          Edit
        </button>

        
      </div>
    </div>
  );
};

export default Message;
