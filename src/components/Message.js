import React, { useState, useEffect, useRef } from "react";
import Swal from "sweetalert2"
import { auth } from "../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { db } from "../firebase";
import { deleteDoc, doc, collection, query, orderBy, limit, onSnapshot, setDoc, getDocs } from "firebase/firestore";
// import Edit from "./Edit";
const Message = ({ message }) => {
  const [user] = useAuthState(auth);
  const [messages, setMessages] = useState([]);
  const [selectedMessage, setSelectedMessage] = useState(null);

  const id = selectedMessage ? selectedMessage.id : null;

  const [text, setText] = useState(selectedMessage ? selectedMessage.text : '');

  const scroll = useRef();

  const handleEdit = (id) => {
    if (message.uid === user.uid) {
      const [message] = messages.filter((message) => message.id === id);
      setSelectedMessage(message);
    } else {
      // Add a notification that the user can only edit their own messages
      Swal.fire({
        icon: 'error',
        title: 'Permission denied',
        text: 'You can only edit your own messages.',
      });
    }
  };

  const handleUpdate = async (e) => {
    // e.preventDefault();
    console.log(e);
    // if (!text) {
    //   return Swal.fire({
    //     icon: 'error',
    //     title: 'Error!',
    //     text: 'Input required.',
    //     showConfirmButton: true,
    //   });
    // }

    const message = {
      text: text,
    };

    // await setDoc(doc(db, "messages", id), {
    //   ...message
    // });

    // setMessages(messages);
    // getMessages();

    Swal.fire({
      icon: 'success',
      title: 'Updated!',
      text: 'Message has been updated.',
      showConfirmButton: false,
      timer: 1500,
    });
  };

  const showEditForm = () => {
    Swal.fire({
      html: `
      <form id="editForm" onSubmit={handleUpdate}>
        <label for="messageInput">Edit Message</label>
        <input id="messageInput" 
          type="text" 
          class="swal2-input" 
          value="${text}"
          onChange=${(e) => {
            setText(e.target.value);
            console.log(text);
          }} 
        />
      </form>
    `,
      showCancelButton: true,
      showCloseButton: true,
      focusConfirm: false,
      preConfirm: () => {
        const newText = document.getElementById('messageInput').value;
        setText(newText);
      }
    }).then((result) => {
      if (result.isConfirmed) {
        console.log(text);
        handleUpdate(text);
      }
    });
  };

  const handleEditAndShowForm = (id) => {
    handleEdit(id);
    showEditForm();
  };

  const getMessages = async () => {
    const q = query(
      collection(db, "messages"),
      orderBy("createdAt", "desc"),
      limit(50)
    );
    const querySnapshot = await getDocs(q);
    const messages = [];
    querySnapshot.forEach((doc) => {
      messages.push({ ...doc.data(), id: doc.id });
    });
    setMessages(messages);
  }

  useEffect(() => {
    getMessages();
  })
  

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
        <button onClick={() => handleEditAndShowForm(message.id)}>Edit</button>
      </div>
    </div>
  );
};

export default Message;
