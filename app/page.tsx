"use client"
import Image from "next/image";
import React, { useState } from 'react';

export default function Home() {
  const [emailForm, setEmailForm] = useState({
    email: "",
    name: "",
    company: "",
    job_position: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmailForm(prev => ({...prev, [e.target.id]: e.target.value}));
  }

  const handleSubmit = async () => {
    console.log(emailForm)
  }

  return (
    <div>
      <h1>Email Sender</h1>
      <div className="">
        <form className="flex flex-col w-xl py-8">
          <input
            type="text"
            placeholder="email"
            id="email"
            onChange={handleChange}
            className="border border-black p-2 mb-2"
          />
          <input
            type="text"
            placeholder="company"
            id="company"
            onChange={handleChange}
            className="border border-black p-2 mb-2"
          />
          <input
            type="text"
            placeholder="name"
            id="name"
            onChange={handleChange}
            className="border border-black p-2 mb-2"
          />
          <input
            type="text"
            placeholder="job_position"
            id="job_position"
            onChange={handleChange}
            className="border border-black p-2 mb-2"
          />
          <button type="button"  onClick={handleSubmit} className="border border-black py-2 px-4 rounded">Send Email</button>
        </form>
      </div>
    </div>
  );
}
