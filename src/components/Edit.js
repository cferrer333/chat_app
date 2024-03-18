import React, { useState } from 'react';
import Swal from 'sweetalert2';

import { doc, updateDoc } from "firebase/firestore"; 
import { db } from "../firebase";

const Edit = ({ messages, selectedMessage, setMessages, setIsEditing, getMessages }) => {
  const id = selectedMessage ? selectedMessage.id : null;

  const [text, setText] = useState(selectedMessage ? selectedMessage.text : '');

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

    await updateDoc(doc(db, "messages", id), {
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
          value={text}
          onChange={e => setText(e.target.value)} 
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

  return (
    <div className="small-container">
      <button onClick={showEditForm}>Edit</button>
    </div>
  );
};

export default Edit;