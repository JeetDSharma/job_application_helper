"use client"
import Image from "next/image";
import React, { useState } from 'react';

export default function Home() {
  const [emailForm, setEmailForm] = useState({
    email: "",
    name: "",
    company: "",
    job_position: "",
    isAlum: false
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const { id, value, type, checked } = e.target;

  setEmailForm(prev => ({
    ...prev,
    [id]: type === 'checkbox' ? checked : value,
  }));
};


  const handleSubmit = async () => {
    console.log(emailForm)

  }

  return (
    <div>
      <h1>Email Sender</h1>
      <div className="">
        <form className="flex flex-row w-xl px-8 py-4 mx-4">
          <input
            type="text"
            placeholder="email"
            id="email"
            onChange={handleChange}
            className="border border-black p-2 ml-4"
          />
          <input
            type="text"
            placeholder="company"
            id="company"
            onChange={handleChange}
            className="border border-black p-2 ml-4"
          />
          <input
            type="text"
            placeholder="name"
            id="name"
            onChange={handleChange}
            className="border border-black p-2 ml-4"
          />
          <input
            type="text"
            placeholder="Job Position"
            id="job_position"
            onChange={handleChange}
            className="border border-black p-2 ml-4"
          />
          <label> <input
            type="checkbox"
            id="isAlum"
            checked={emailForm.isAlum}
            onChange={handleChange}
            className="h-4 w-4"
          />
          <span>Is Alum?</span></label>
          <button type="button"  onClick={handleSubmit} className="border border-black py-2 px-4 rounded">Send Email</button>
        </form>
      </div>
    </div>
  );
}
