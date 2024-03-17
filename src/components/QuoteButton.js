import React, { useState } from 'react';
import axios from 'axios';

const QuoteButton = () => {
 
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

  return (
    <div>
      <button onClick={getQuote}>Get Quote</button>

    </div>
  );
};

export default QuoteButton;
