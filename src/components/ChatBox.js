import React, { useEffect, useRef, useState } from "react";
import Swal from "sweetalert2";
import {
  query,
  collection,
  orderBy,
  onSnapshot,
  limit,
  deleteDoc,
  doc,
  getDocs
} from "firebase/firestore";
import { db } from "../firebase";
import Message from "./Message";
import SendMessage from "./SendMessage";

const ChatBox = () => {
  const [messages, setMessages] = useState([]);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  const scroll = useRef();


  useEffect(() => {
    const q = query(
      collection(db, "messages"),
      orderBy("createdAt", "desc"),
      limit(50)
    );
    const handleEdit = id => {
      const [message] = messages.filter(message => message.id === id);
      setSelectedMessage(message);
      setIsEditing(true);
    };
  
    const handleDelete = id => {
      Swal.fire({
        icon: 'warning',
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        showCancelButton: true,
        confirmButtonText: 'Yes, delete it!',
        cancelButtonText: 'No, cancel!',
      }).then(result => {
        if (result.value) {
          const [message] = messages.filter(message => message.id === id);
  
          deleteDoc(doc(db, "messages", id));
  
          Swal.fire({
            icon: 'success',
            title: 'Deleted!',
            text: 'Message has been deleted.',
            showConfirmButton: false,
            timer: 1500,
          });
  
          const messagesCopy = messages.filter(message => message.id !== id);
          setMessages(messagesCopy);
        }
      });
    };

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

  return (
    <main className="chat-box">
      <div className="messages-wrapper">
        {messages?.map((message) => (
          <Message key={message.id} message={message} />
        ))}
      </div>
      {/* when a new message enters the chat, the screen scrolls down to the scroll div */}
      <span ref={scroll}></span>
      <SendMessage scroll={scroll} />
    </main>
  );
};

export default ChatBox;
