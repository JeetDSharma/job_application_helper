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
  FaLinkedin,
} from "react-icons/fa";

export default function Home() {
  const [emailForm, setEmailForm] = useState({
    email: "",
    name: "",
    company: "",
    jobPosition: "",
    isAlum: false,
    isRecruiter: false,
    tenureYears: "", // New field for tenure
    personalMention: "", // New field for personal mention
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
      { duration: 6000 },
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
          setEmailForm({
            email: emailForm.email,
            name: emailForm.name,
            company: emailForm.company,
            jobPosition: emailForm.jobPosition,
            isAlum: emailForm.isAlum,
            isRecruiter: emailForm.isRecruiter,
            tenureYears: "",
            personalMention: "",
          });
        } else {
          console.error(
            `Failed to send email: ${data.error || "Unknown error"}`,
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
    }, 6000);
  };

  const handleCopyLinkedInMessage = () => {
    const name = emailForm.name || "";
    const company = emailForm.company || "";
    // const linkedInMessage = emailForm.isAlum
    //   ? `Hi ${name},\n\nI'm Jeet, MSCS student at UMass Amherst. As a fellow alum, it’s inspiring to see your impactful work at ${company}. I have 1+ year of experience in building scalable apps. I excel in software engineering, data analysis & development. I’d appreciate if you could refer me for any open software positions. Thanks!`
    //   : `Hi ${name},\n\nI'm Jeet, MSCS student at UMass Amherst. I am impressed by your work at ${company}. I have 1+ year of experience in building scalable apps. I excel in software engineering, data analysis & development. I’d appreciate if you could refer me for any open software positions. Thanks!`;
    // const linkedInMessage = emailForm.isAlum
    //   ? `Hi ${name},\n\nI'm Jeet, an MSCS student at UMass Amherst. It is great to see a UMass Alum working at ${company}, I would love to connect and ask a few questions about what makes a great engineer. Looking forward to learning from your experience.`
    //   : `Hi ${name},\n\nI'm Jeet, an MSCS student at UMass Amherst. I came across your work at ${company} and found it super interesting. I would love to connect and ask a few questions about what makes a great engineer. Looking forward to learning from your experience.`;
    const linkedInMessage = emailForm.isAlum
      ? `Hi ${name},\n\nI'm Jeet, an MSCS student at UMass Amherst. I'm actively job searching and would love your insight on ${company}'s engineering culture and what helped you succeed there. I would really value 10-15 minutes of your time for a quick chat.`
      : `Hi ${name}, I’m Jeet, MSCS at UMass Amherst. I’m exploring engineering roles at ${company} and want to focus on what actually moves candidates forward. From your experience, what is the single signal your team treats as most predictive of success? Even one line would help me target my preparation`;
    navigator.clipboard
      .writeText(linkedInMessage)
      .then(() => {
        toast.success("LinkedIn message copied to clipboard!");
      })
      .catch(() => {
        toast.error("Failed to copy message.");
      });
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

            {/* Tenure Input */}
            <div className="flex flex-col">
              <label
                htmlFor="tenureYears"
                className="text-sm font-medium text-gray-700 flex items-center gap-2"
              >
                Tenure (in years)
              </label>
              <input
                type="number"
                id="tenureYears"
                name="tenureYears"
                onChange={handleChange}
                value={emailForm.tenureYears}
                className="border border-gray-300 mt-1 px-3 py-2 rounded-md focus:outline-none focus:ring focus:ring-indigo-500"
                placeholder="e.g., 2"
              />
            </div>

            {/* Personal Mention Input */}
            <div className="flex flex-col">
              <label
                htmlFor="personalMention"
                className="text-sm font-medium text-gray-700 flex items-center gap-2"
              >
                Personal Mention (Post/Comment/Work)
              </label>
              <input
                type="text"
                id="personalMention"
                name="personalMention"
                onChange={handleChange}
                value={emailForm.personalMention}
                className="border border-gray-300 mt-1 px-3 py-2 rounded-md focus:outline-none focus:ring focus:ring-indigo-500"
                placeholder="Mention something relevant from their LinkedIn"
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

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="isRecruiter"
                checked={emailForm.isRecruiter}
                onChange={handleChange}
              />
              <label
                htmlFor="isRecruiter"
                className="text-sm flex items-center gap-1"
              >
                <FaBriefcase /> Is Recruiter?
              </label>
            </div>

            <button
              type="submit"
              className="flex items-center justify-center gap-2 border border-black rounded-md px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white"
            >
              <FaPaperPlane /> Send Email
            </button>
            <button
              type="button"
              onClick={handleCopyLinkedInMessage}
              className="flex items-center justify-center gap-2 border border-black rounded-md px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white"
            >
              <FaLinkedin />
              Copy LinkedIn Message
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
