import React, { useState } from 'react';
import Swal from 'sweetalert2';

import { doc, updateDoc } from "firebase/firestore"; 
import { db } from "../firebase";


const Edit = ({ messages, selectedMessage, setMessages, setIsEditing, getMessages }) => {
  const id = selectedMessage.id;

  const [text, setText] = useState(selectedMessage.text);



  
  // const handleEdit = (id) => {
  //   if (selectedMessage.uid === user.uid) {
  //     const [message] = messages.filter((message) => message.id === id);
  //     setSelectedMessage(message);
  //   } else {
  //     // Add a notification that the user can only edit their own messages
  //     Swal.fire({
  //       icon: 'error',
  //       title: 'Permission denied',
  //       text: 'You can only edit your own messages.',
  //     });
  //   }
  // };

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

  return (
    <div className="small-container">
      <br />
      <form onSubmit={handleUpdate}>
        <label htmlFor="messageInput">Edit Message</label>
        <input
          id="messageInput"
          type="text"
          name="messageInput"
          value={text}
          onChange={e => setText(e.target.value)}
          style={{ width: '400px', height: '100px' }}
        />
        <div style={{ marginTop: '30px' }}>
          <input type="submit" value="Update" />
          <input
            style={{ marginLeft: '12px' }}
            className="muted-button"
            type="button"
            value="Cancel"
            onClick={() => setIsEditing(false)}
          />
        </div>
      </form>
    </div>
  );
};

export default Edit;