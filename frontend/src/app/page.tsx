"use client";


// Example: src/App.js
import React, {  useEffect, useState } from 'react';
import axios from 'axios';

function App() {
  const [navbars, setNavbars] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:1337/api/navbars')
      .then(response => setNavbars(response.data.data))
      .catch(error => console.error(error));
  }, []);

  return (
    <div>
      <h1>Navbar Items</h1>
      <ul>
        {navbars.map(item => (
          <li key={item.id}>{item.attributes.title}</li>
        ))}
      </ul>
    </div>
  );
}

export default App;