"use client";
import Image from "next/image";
import React, { useState, useRef } from "react";
import toast, { Toaster } from "react-hot-toast";
import {
  FaEnvelope,
  FaBuilding,
  FaUser,
  FaBriefcase,
  FaGraduationCap,
  FaPaperPlane,
} from "react-icons/fa";

export default function Home() {
  const [emailForm, setEmailForm] = useState({
    email: "",
    name: "",
    company: "",
    jobPosition: "",
    isAlum: false,
  });
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const [isPending, setIsPending] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value, type, checked } = e.target;

    setEmailForm((prev) => ({
      ...prev,
      [id]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async () => {
    if (isPending) return;
    setIsPending(true);

    toast(
      (t) => (
        <span>
          Sending Email ....
          <button
            onClick={() => {
              if (timerRef.current) {
                clearTimeout(timerRef.current);
                timerRef.current = null;
              }
              toast.dismiss(t.id);
              toast("Email sending cancelled.");
              setIsPending(false);
            }}
            className="ml-4 text-red-500 underline"
          >
            Click To Cancel
          </button>
        </span>
      ),
      { duration: 10000 }
    );

    timerRef.current = setTimeout(async () => {
      try {
        const response = await fetch("/api/send-email", {
          headers: { Accept: "application/json" },
          method: "POST",
          body: JSON.stringify({ ...emailForm }),
        });

        const data = await response.json();
        if (response.ok) {
          toast.success("Email Sent Successfully!");
        } else {
          console.error(
            `Failed to send email: ${data.error || "Unknown error"}`
          );
          toast.error("Failed to Send Email");
        }
      } catch (error) {
        console.error("Send email error:", error);
        toast.error("Failed to Send Email");
      } finally {
        setIsPending(false);
        timerRef.current = null;
      }
    }, 10000);
  };

  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />
      <div className="min-h-screen flex justify-center items-center bg-gray-100">
        <div className="bg-white p-8 shadow-md rounded-lg w-lg">
          <h1 className="text-2xl font-semibold text-center mb-6">
            Send Email
          </h1>

          <form
            className="flex flex-col gap-4"
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmit();
            }}
          >
            <div className="flex flex-col">
              <label
                htmlFor="email"
                className="text-sm font-medium text-gray-700 flex items-center gap-2"
              >
                <FaEnvelope /> Email
              </label>
              <input
                type="email"
                name="email"
                id="email"
                onChange={handleChange}
                className="border border-gray-300 mt-1 px-3 py-2 rounded-md focus:outline-none focus:ring focus:ring-indigo-500"
              />
            </div>

            <div className="flex flex-col">
              <label
                htmlFor="company"
                className="text-sm font-medium text-gray-700 flex items-center gap-2"
              >
                <FaBuilding /> Company Name
              </label>
              <input
                type="text"
                name="company"
                id="company"
                onChange={handleChange}
                className="border border-gray-300 mt-1 px-3 py-2 rounded-md focus:outline-none focus:ring focus:ring-indigo-500"
              />
            </div>

            <div className="flex flex-col">
              <label
                htmlFor="name"
                className="text-sm font-medium text-gray-700 flex items-center gap-2"
              >
                <FaUser /> Name
              </label>
              <input
                type="text"
                name="name"
                id="name"
                onChange={handleChange}
                className="border border-gray-300 mt-1 px-3 py-2 rounded-md focus:outline-none focus:ring focus:ring-indigo-500"
              />
            </div>

            <div className="flex flex-col">
              <label
                htmlFor="jobPosition"
                className="text-sm font-medium text-gray-700 flex items-center gap-2"
              >
                <FaBriefcase /> Job Position
              </label>
              <input
                type="text"
                id="jobPosition"
                name="jobPosition"
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
              />
              <label
                htmlFor="isAlum"
                className="text-sm flex items-center gap-1"
              >
                <FaGraduationCap /> Is Alum?
              </label>
            </div>

            <button
              type="submit"
              className="flex items-center justify-center gap-2 border border-black rounded-md px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white"
            >
              <FaPaperPlane /> Send Email
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
