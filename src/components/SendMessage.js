import React, { useState } from "react";
import { auth, db } from "../firebase";
import { addDoc, collection, serverTimestamp, doc, getDoc, deleteDoc } from "firebase/firestore";
import axios from 'axios';

const SendMessage = ({ scroll }) => {
  const [message, setMessage] = useState("");
  const [quote, setQuote] = useState({});

  const getQuote = () => {
    axios.get('https://api.api-ninjas.com/v1/quotes?category=inspirational', {
      headers: { 'X-Api-Key': '41jyAaHwG7y0dKb6QQqydA==CkRlWyYGa90kjayK' }
    })
      .then(response => {
        setQuote(response.data[0]);
        console.log(response.data);
      })
      .catch(error => {
        console.error('Error: ', error);
      });
  };

  const sendMessage = async (event) => {
    event.preventDefault();

    const { uid, displayName, photoURL } = auth.currentUser;

    await addDoc(collection(db, "messages"), {
      text: message ? message : `${quote.quote} - ${quote.author}`,
      name: displayName,
      avatar: photoURL,
      createdAt: serverTimestamp(),
      uid,
    });


    setMessage("");
    setQuote({});
    scroll.current.scrollIntoView({ behavior: "smooth" });
  };

  const deleteMessage = async (messageId) => {
    try {
      await deleteDoc(doc(db, "messages", messageId));
      console.log("Message deleted successfully");
    } catch (error) {
      console.error("Error deleting message: ", error);
    }
  };

  return (
    <form onSubmit={(event) => sendMessage(event)} className="send-message">
      <label htmlFor="messageInput" hidden>
        Enter Message
      </label>
      <input
        id="messageInput"
        name="messageInput"
        type="text"
        className="form-input__input"
        placeholder="type message..."
        value={[message ? message : `"${quote.quote}"  -${quote.author}`]}
        onChange={(e) => setMessage(e.target.value)}
      />
      <button type="submit"><i class="fa-regular fa-paper-plane"></i></button>
      <button type="button" onClick={getQuote}>Get Quote</button>
    </form>
  );
};

export default SendMessage;