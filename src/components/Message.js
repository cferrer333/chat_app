import React, { useState, useEffect, useRef } from "react";
import Swal from "sweetalert2"
import { auth } from "../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { db } from "../firebase";
import { deleteDoc, doc, collection, query, orderBy, limit, onSnapshot, setDoc, getDocs } from "firebase/firestore";
import Edit from "./Edit";
const Message = ({ message }) => {
  const [user] = useAuthState(auth);
  const [messages, setMessages] = useState([]);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isToolbarOpen, setIsToolbarOpen] = useState(false);

  const id = selectedMessage ? selectedMessage.id : null;

  // const [text, setText] = useState(selectedMessage.text);

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

  // const handleUpdate = async (e) => {
    // e.preventDefault();
    // console.log(e);
    // if (!text) {
    //   return Swal.fire({
    //     icon: 'error',
    //     title: 'Error!',
    //     text: 'Input required.',
    //     showConfirmButton: true,
    //   });
    // }

    // const message = {
    //   text: text,
    // };

    // await setDoc(doc(db, "messages", id), {
    //   ...message
    // });

    // setMessages(messages);
    // getMessages();

  //   Swal.fire({
  //     icon: 'success',
  //     title: 'Updated!',
  //     text: 'Message has been updated.',
  //     showConfirmButton: false,
  //     timer: 1500,
  //   });
  // };

  // const showEditForm = () => {
  //   const inputElement = document.createElement('input');
  //   inputElement.id = 'messageInput';
  //   inputElement.type = 'text';
  //   inputElement.className = 'swal2-input';
  //   inputElement.value = text;
  //   inputElement.addEventListener('input', (e) => {
  //     setText(e.target.value);
  //   });
  
  //   const form = document.createElement('form');
  //   form.id = 'editForm';
  //   form.addEventListener('submit', handleUpdate);
  //   form.appendChild(document.createTextNode('Edit Message'));
  //   form.appendChild(inputElement);
  
  //   Swal.fire({
  //     html: form,
  //     showCancelButton: true,
  //     showCloseButton: true,
  //     focusConfirm: false,
  //     preConfirm: () => {
  //       const newText = inputElement.value;
  //       setText(newText);
  //       console.log(newText);
  //     }
  //   }).then((result) => {
  //     if (result.isConfirmed) {
  //       console.log(text);
  //       handleUpdate(); // Assuming handleUpdate does not need any arguments
  //     }
  //   });
  // };

  // const handleEditAndShowForm = (id) => {
  //   handleEdit(id);
  //   showEditForm();
  // };

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
  
  const toggleToolbar = () => {
    setIsToolbarOpen(!isToolbarOpen);
  };

  return (
    <div className={`chat-bubble ${message.uid === user.uid ? "right" : ""}`}>
      <img
        className="chat-bubble__left"
        src={message.avatar}
        alt="user avatar"
      />
      <div className="chat-bubble__right">
        <p className="user-name">
          {message.name} &nbsp;
          <span className="message-time">
            {message.createdAt &&
              message.createdAt.seconds && (
                new Date(message.createdAt.seconds * 1000).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })
              )}
          </span>
        </p>
        <p className="user-message">{message.text}</p>
        <p className="toggle-toolbar" onClick={toggleToolbar}>
        <i class="fa-light fa-ellipsis-vertical"></i>
        </p>
        {isToolbarOpen && (
          <div className="toolbar-menu">
            <button className="delete-message" onClick={() => handleDelete(message.id)}>
              Delete
            </button>
            <button onClick={() => handleEdit(message.id)}>Edit</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Message;