"use client";

import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function Page() {
  const [navbars, setNavbars] = useState<any[]>([]);

  useEffect(() => {
    axios.get('http://localhost:1337/api/navbars')
      .then(response => {
        setNavbars(response.data.data);
        console.log(response.data.data); // Add this line
      })
      .catch(error => console.error(error));
  }, []);

  return (
    <div>
      <h1>Navbar Items</h1>
      <ul>
        {navbars.map(item => (
          <li key={item.id}>
            <a href={item.link} target="_blank" rel="noopener noreferrer">
              {item.title}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}