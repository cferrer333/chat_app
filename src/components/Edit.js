import React, { useState } from 'react';
import Swal from 'sweetalert2';

import { doc, setDoc } from "firebase/firestore"; 
import { db } from "../firebase";


const Edit = ({ messages, selectedMessage, setMessages, setIsEditing, getMessages }) => {
  const id = selectedMessage ? selectedMessage.id : null;

  const [text, setText] = useState(selectedMessage ? selectedMessage.text : '');

  
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
    e.preventDefault();

    if (!text) {
      return Swal.fire({
        icon: 'error',
        title: 'Error!',
        text: 'Input required.',
        showConfirmButton: true,
      });
    }

    const message = {
      text: text,
    };

    await setDoc(doc(db, "messages", id), {
      ...message
    });

    setMessages(messages);
    setIsEditing(false);
    getMessages();

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
          onChange=${e => setText(e.target.value)} 
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
        handleUpdate();
      }
    });
  };

  const handleEditAndShowForm = (id) => {
    handleEdit(id);
    showEditForm();
  };
  

  return (
    <div className="small-container">
      <button onClick={() => handleEditAndShowForm(message.id)}>Edit</button>
    </div>
  );
};

export default Edit;