"use client";
import Image from "next/image";
import React, { useState, useRef, useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";
import {
  FaEnvelope,
  FaBuilding,
  FaUser,
  FaBriefcase,
  FaGraduationCap,
  FaPaperPlane,
  FaLinkedin,
  FaEye,
  FaExclamationTriangle,
  FaClock,
  FaCheckCircle,
  FaTimesCircle,
} from "react-icons/fa";
import PreviewModal from "@/components/PreviewModal";
import { buildAlumTemplate } from "@/templates/alumTemplate";
import { buildEmailTemplate } from "@/templates/emailTemplateNew";
import { buildRecruiterTemplate } from "@/templates/recruiterTemplate";
import { UNIVERSITY_NAME } from "@/lib/constants";

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
  const [previewModal, setPreviewModal] = useState({
    isOpen: false,
    emailHtml: "",
    emailSubject: "",
  });
  const [recipientCheck, setRecipientCheck] = useState<{
    exists: boolean;
    loading: boolean;
    data?: {
      name: string;
      email: string;
      isAlumni: boolean;
      company: string;
      emailLogs: Array<{
        sentAt: string;
        status: string;
        jobPosition: string;
      }>;
    };
  }>({ exists: false, loading: false });
  const emailCheckTimeout = useRef<NodeJS.Timeout | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value, type, checked } = e.target;

    setEmailForm((prev) => ({
      ...prev,
      [id]: type === "checkbox" ? checked : value,
    }));

    // Trigger email check when email field changes
    if (id === "email" && type !== "checkbox") {
      if (emailCheckTimeout.current) {
        clearTimeout(emailCheckTimeout.current);
      }

      if (value.trim() && value.includes("@")) {
        setRecipientCheck({ exists: false, loading: true });
        emailCheckTimeout.current = setTimeout(() => {
          checkRecipient(value);
        }, 500);
      } else {
        setRecipientCheck({ exists: false, loading: false });
      }
    }
  };

  const checkRecipient = async (email: string) => {
    try {
      const response = await fetch(
        `/api/check-recipient?email=${encodeURIComponent(email)}`,
      );
      const data = await response.json();

      if (data.exists) {
        setRecipientCheck({
          exists: true,
          loading: false,
          data: data.recipient,
        });
      } else {
        setRecipientCheck({ exists: false, loading: false });
      }
    } catch (error) {
      console.error("Error checking recipient:", error);
      setRecipientCheck({ exists: false, loading: false });
    }
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

  const generateEmailPreview = () => {
    const {
      name,
      jobPosition,
      company,
      isAlum,
      isRecruiter,
      tenureYears,
      personalMention,
    } = emailForm;

    let html_body = "";
    let emailSubject = "";

    if (isRecruiter) {
      html_body = buildRecruiterTemplate({
        name,
        jobPosition,
        company,
      });
      emailSubject = `${jobPosition} - Founding Engineer w/ 2 YOE | May 2026 Grad`;
    } else if (isAlum) {
      html_body = buildAlumTemplate({
        name,
        jobPosition,
        company,
        university: UNIVERSITY_NAME,
      });
      emailSubject = `Seeking to Learn From Your Journey to ${company}`;
    } else {
      html_body = buildEmailTemplate({
        name,
        jobPosition,
        company,
        tenureYears: tenureYears ? Number(tenureYears) : undefined,
        personalMention: personalMention || undefined,
      });
      emailSubject = `Seeking to Learn From Your Journey to ${company}`;
    }

    setPreviewModal({
      isOpen: true,
      emailHtml: html_body,
      emailSubject,
    });
  };

  const handleCopyLinkedInMessage = () => {
    const name = emailForm.name || "";
    const company = emailForm.company || "";
    const jobPosition = emailForm.jobPosition || "engineering role";

    let linkedInMessage = "";

    if (emailForm.isRecruiter) {
      // Recruiter-specific message: Direct, value-first, clear ask
      linkedInMessage = `Hi ${name},\n\nI'm a founding engineer with 2+ years building and owning production backend and full-stack systems. Graduating May 2026 from UMass Amherst (MSCS). Saw the ${jobPosition} role at ${company}. Open to a quick chat this week if you think there's a fit.`;
    } else if (emailForm.isAlum) {
      // Alumni message: Shared background, authentic networking
      linkedInMessage = `Hi ${name},\n\nJeet here, MSCS at UMass Amherst (May 2026). Great to see a fellow alum at ${company}. I've spent 2+ years as a founding engineer shipping production systems and I'm exploring roles now. Would love 10 minutes of your time to hear about your experience there and what helped you succeed.`;
    } else {
      // Non-alum engineer message: Respect their expertise, targeted question
      linkedInMessage = `Hi ${name},\n\nJeet, MSCS at UMass Amherst (May 2026). I've been building production systems as a founding engineer for 2+ years and I'm exploring roles at ${company}. From your experience, what's the single most important signal your team looks for when evaluating engineers? Even one insight would help me focus my prep.`;
    }

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
      <PreviewModal
        isOpen={previewModal.isOpen}
        onClose={() => setPreviewModal({ ...previewModal, isOpen: false })}
        emailHtml={previewModal.emailHtml}
        emailSubject={previewModal.emailSubject}
        recipientEmail={emailForm.email}
      />
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

              {/* Loading indicator */}
              {recipientCheck.loading && (
                <div className="mt-2 flex items-center gap-2 text-sm text-gray-500">
                  <FaClock className="animate-spin" />
                  <span>Checking contact...</span>
                </div>
              )}

              {/* Existing contact warning */}
              {recipientCheck.exists && recipientCheck.data && (
                <div className="mt-2 p-3 bg-yellow-50 border border-yellow-300 rounded-md">
                  <div className="flex items-start gap-2">
                    <FaExclamationTriangle className="text-yellow-600 mt-0.5 flex-shrink-0" />
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-yellow-800">
                        Contact already exists
                      </p>
                      <p className="text-xs text-yellow-700 mt-1">
                        <strong>{recipientCheck.data.name}</strong> at{" "}
                        <strong>{recipientCheck.data.company}</strong>
                      </p>

                      {recipientCheck.data.emailLogs.length > 0 && (
                        <div className="mt-2 space-y-1">
                          <p className="text-xs font-medium text-yellow-800">
                            Previous emails:
                          </p>
                          {recipientCheck.data.emailLogs
                            .slice(0, 3)
                            .map((log, idx) => (
                              <div
                                key={idx}
                                className="flex items-center gap-2 text-xs text-yellow-700"
                              >
                                {log.status === "SENT" ? (
                                  <FaCheckCircle className="text-green-600 flex-shrink-0" />
                                ) : log.status === "FAILED" ? (
                                  <FaTimesCircle className="text-red-600 flex-shrink-0" />
                                ) : (
                                  <FaClock className="text-gray-600 flex-shrink-0" />
                                )}
                                <span>
                                  {log.jobPosition} -{" "}
                                  {new Date(log.sentAt).toLocaleDateString()} (
                                  {log.status})
                                </span>
                              </div>
                            ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
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

            <div className="flex flex-col sm:flex-row gap-4 p-3 bg-gray-50 rounded-md border border-gray-200">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isAlum"
                  checked={emailForm.isAlum}
                  onChange={handleChange}
                  className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                />
                <label
                  htmlFor="isAlum"
                  className="text-sm font-medium flex items-center gap-1.5 cursor-pointer"
                >
                  <FaGraduationCap className="text-indigo-600" /> Is Alumni?
                </label>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isRecruiter"
                  checked={emailForm.isRecruiter}
                  onChange={handleChange}
                  className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                />
                <label
                  htmlFor="isRecruiter"
                  className="text-sm font-medium flex items-center gap-1.5 cursor-pointer"
                >
                  <FaBriefcase className="text-indigo-600" /> Is Recruiter?
                </label>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 mt-2">
              <button
                type="button"
                onClick={generateEmailPreview}
                className="flex-1 flex items-center justify-center gap-2 border border-gray-300 rounded-md px-4 py-2.5 bg-white hover:bg-gray-50 text-gray-700 font-medium transition shadow-sm"
              >
                <FaEye /> Preview
              </button>
              <button
                type="submit"
                className="flex-1 flex items-center justify-center gap-2 border border-indigo-600 rounded-md px-4 py-2.5 bg-indigo-500 hover:bg-indigo-600 text-white font-medium transition shadow-sm"
              >
                <FaPaperPlane /> Send Email
              </button>
              <button
                type="button"
                onClick={handleCopyLinkedInMessage}
                className="flex-1 flex items-center justify-center gap-2 border border-blue-600 rounded-md px-4 py-2.5 bg-blue-500 hover:bg-blue-600 text-white font-medium transition shadow-sm"
              >
                <FaLinkedin /> LinkedIn
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
