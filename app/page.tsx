"use client"
import Image from "next/image";
import React, { useState } from 'react';
import toast, {Toaster} from 'react-hot-toast';

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
    const sendEmail = async() => {
      try {
        const response = await fetch("/api/send-email", {
          headers: {
            Accept: "application/json",
            
          },

            method: "POST",
            body: JSON.stringify({
              ...emailForm
            })
        })
        if (response) {
          const data = await response.json()
          if (response.ok) {
          // alert("Email Sent Successfully!");
          toast.success("Email Sent Successfully!")
          } else { 
            console.log((`Failed to send email: ${data.error || "Unknown error"}`))
            toast.error("Failed to Send Email")
          }
        }
        
      } catch (error) {
        console.error("Send email error:", error);
        alert("Something went wrong.");
      }
    }
    sendEmail()
  }

  return (
    <>
    
    <Toaster position="top-center" reverseOrder={false} />
    <div className="min-h-screen flex justify-center items-center bg-gray-100">
      <div className="bg-white p-8 shadow-md rounded-lg w-lg">
        <h1 className="text-2xl font-semibold text-center mb-6">Send Email</h1>
        <form className="flex flex-col gap-4" onSubmit={(e)=>{
          e.preventDefault(); handleSubmit();
        }}>
          <div className="flex flex-col">

          <label htmlFor="email" className="text-sm font-medium text-gray-700">Email</label>
          <input
            type="email"
            name = "email"
            id="email"
            onChange={handleChange}
            className="border border-gray-300 mt-1 px-3 py-2 rounded-md focus:outline-none focus:ring focus:ring-indigo-500" 
            />
            </div>
            <div className="flex flex-col">

          <label htmlFor="company" className="text-sm font-medium text-gray-700">Company Name</label>
          <input
            type="text"
            name="company"
            id="company"
            onChange={handleChange}
            className="border border-gray-300 mt-1 px-3 py-2 rounded-md focus:outline-none focus:ring focus:ring-indigo-500" 
            />
            </div>
            <div className="flex flex-col">

          <label htmlFor="name" className="text-sm font-medium text-gray-700">Name</label>
          <input
            type="text"
            name="name"
            id="name"
            onChange={handleChange}
            className="border border-gray-300 mt-1 px-3 py-2 rounded-md focus:outline-none focus:ring focus:ring-indigo-500" 
            />
            </div>
            <div className="flex flex-col">

          <label htmlFor="job_position" className="text-sm font-medium text-gray-700">Job Position</label>
          <input
            type="text"
            id="job_position"
            name="job_position"
            onChange={handleChange}
            className="border border-gray-300 mt-1 px-3 py-2 rounded-md focus:outline-none focus:ring focus:ring-indigo-500" 
            />
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="isAlum"
                checked={emailForm.isAlum}
                onChange={handleChange}
                className=""
                />
               <label className="text-sm"> Is Alum?</label>
            </div>
          <button type="submit" className="border border-black rounded-md px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white">Send Email</button>
        </form>
      </div>
    </div>
    </>
  );
}
