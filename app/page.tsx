"use client";
import Image from "next/image";
import Link from "next/link";
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
  FaEnvelopeOpen,
  FaCheckCircle,
  FaTimesCircle,
  FaHistory,
  FaClock,
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
    tenureYears: "",
    personalMention: "",
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
  const [formErrors, setFormErrors] = useState({
    email: "",
    name: "",
    company: "",
    jobPosition: "",
  });
  const [touched, setTouched] = useState({
    email: false,
    name: false,
    company: false,
    jobPosition: false,
  });

  const validateEmail = (email: string): string => {
    if (!email.trim()) return "Email is required";
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return "Please enter a valid email address";
    return "";
  };

  const validateField = (fieldName: string, value: string): string => {
    if (fieldName === "email") return validateEmail(value);
    if (!value.trim()) {
      const fieldLabels: { [key: string]: string } = {
        name: "Name",
        company: "Company",
        jobPosition: "Job Position",
      };
      return `${fieldLabels[fieldName]} is required`;
    }
    return "";
  };

  const isFormValid = (): boolean => {
    return (
      emailForm.email.trim() !== "" &&
      validateEmail(emailForm.email) === "" &&
      emailForm.name.trim() !== "" &&
      emailForm.company.trim() !== "" &&
      emailForm.jobPosition.trim() !== ""
    );
  };

  const isLinkedInFormValid = (): boolean => {
    return (
      emailForm.name.trim() !== "" &&
      emailForm.company.trim() !== "" &&
      emailForm.jobPosition.trim() !== ""
    );
  };

  const handleBlur = (fieldName: string) => {
    setTouched((prev) => ({ ...prev, [fieldName]: true }));
    const value = emailForm[fieldName as keyof typeof emailForm] as string;
    const error = validateField(fieldName, value);
    setFormErrors((prev) => ({ ...prev, [fieldName]: error }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value, type, checked } = e.target;

    setEmailForm((prev) => ({
      ...prev,
      [id]: type === "checkbox" ? checked : value,
    }));

    // Validate field on change if already touched
    if (type !== "checkbox" && touched[id as keyof typeof touched]) {
      const error = validateField(id, value);
      setFormErrors((prev) => ({ ...prev, [id]: error }));
    }

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

    // Validate all fields before submitting
    if (!isFormValid()) {
      // Mark all fields as touched to show errors
      setTouched({
        email: true,
        name: true,
        company: true,
        jobPosition: true,
      });
      setFormErrors({
        email: validateEmail(emailForm.email),
        name: validateField("name", emailForm.name),
        company: validateField("company", emailForm.company),
        jobPosition: validateField("jobPosition", emailForm.jobPosition),
      });
      toast.error("Please fill in all required fields correctly");
      return;
    }

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
          // Reset only optional fields, keep recipient info for potential follow-up
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
          // Reset validation errors
          setFormErrors({
            email: "",
            name: "",
            company: "",
            jobPosition: "",
          });
          setTouched({
            email: false,
            name: false,
            company: false,
            jobPosition: false,
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

  const handleCopyEmailForInMail = () => {
    const { name, jobPosition, company, personalMention } = emailForm;

    const inMailContent = `Hi ${name},

I hope this message finds you well! I recently came across the ${jobPosition} position at ${company} and was excited to see how my experience aligns with the role. As a founding engineer, I've designed and deployed backend and distributed systems for AI-driven platforms, which I believe would contribute significantly to the innovative work you're doing at ${company}.

I'm particularly impressed by ${company}'s mission${personalMention ? ` and ${personalMention.toLowerCase()}` : " to help emerging tech companies find the talent they need for growth"}. I'm eager to be a part of a team that is shaping the future of technology.

Could you please let me know if there are current openings that match my background?

Thank you, and I look forward to your response!

Best regards,
Jeet Sharma`;

    navigator.clipboard
      .writeText(inMailContent)
      .then(() => {
        toast.success("LinkedIn InMail content copied!");
      })
      .catch(() => {
        toast.error("Failed to copy InMail content.");
      });
  };

  const handleCopyLinkedInMessage = () => {
    const name = emailForm.name || "there";
    const company = emailForm.company || "your company";
    const jobPosition = emailForm.jobPosition || "engineering role";

    let linkedInMessage = "";

    if (emailForm.isRecruiter) {
      linkedInMessage = `Hi ${name},\n\nI'm a founding engineer with 2+ years building and owning production backend and full-stack systems. Graduating May 2026 from UMass Amherst (MSCS). Saw the ${jobPosition} role at ${company}. Open to a quick chat this week if you think there's a fit.`;
    } else if (emailForm.isAlum) {
      linkedInMessage = `Hi ${name},\n\nJeet here, MSCS at UMass Amherst (May 2026). Great to see a fellow alum at ${company}. I've spent 2+ years as a founding engineer shipping production systems and I'm exploring roles now. Would love 10 minutes of your time to hear about your experience there and what helped you succeed.`;
    } else {
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
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-semibold">Send Email</h1>
            <Link
              href="/history"
              className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50 rounded-md transition"
            >
              <FaHistory /> Email History
            </Link>
          </div>

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
                <FaEnvelope /> Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                name="email"
                id="email"
                value={emailForm.email}
                onChange={handleChange}
                onBlur={() => handleBlur("email")}
                required
                className={`border mt-1 px-3 py-2 rounded-md focus:outline-none focus:ring ${
                  touched.email && formErrors.email
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-300 focus:ring-indigo-500"
                }`}
              />
              {touched.email && formErrors.email && (
                <p className="mt-1 text-sm text-red-600">{formErrors.email}</p>
              )}

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
                <FaBuilding /> Company Name{" "}
                <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="company"
                id="company"
                value={emailForm.company}
                onChange={handleChange}
                onBlur={() => handleBlur("company")}
                required
                className={`border mt-1 px-3 py-2 rounded-md focus:outline-none focus:ring ${
                  touched.company && formErrors.company
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-300 focus:ring-indigo-500"
                }`}
              />
              {touched.company && formErrors.company && (
                <p className="mt-1 text-sm text-red-600">
                  {formErrors.company}
                </p>
              )}
            </div>

            <div className="flex flex-col">
              <label
                htmlFor="name"
                className="text-sm font-medium text-gray-700 flex items-center gap-2"
              >
                <FaUser /> Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                id="name"
                value={emailForm.name}
                onChange={handleChange}
                onBlur={() => handleBlur("name")}
                required
                className={`border mt-1 px-3 py-2 rounded-md focus:outline-none focus:ring ${
                  touched.name && formErrors.name
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-300 focus:ring-indigo-500"
                }`}
              />
              {touched.name && formErrors.name && (
                <p className="mt-1 text-sm text-red-600">{formErrors.name}</p>
              )}
            </div>

            <div className="flex flex-col">
              <label
                htmlFor="jobPosition"
                className="text-sm font-medium text-gray-700 flex items-center gap-2"
              >
                <FaBriefcase /> Job Position{" "}
                <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="jobPosition"
                name="jobPosition"
                value={emailForm.jobPosition}
                onChange={handleChange}
                onBlur={() => handleBlur("jobPosition")}
                required
                className={`border mt-1 px-3 py-2 rounded-md focus:outline-none focus:ring ${
                  touched.jobPosition && formErrors.jobPosition
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-300 focus:ring-indigo-500"
                }`}
              />
              {touched.jobPosition && formErrors.jobPosition && (
                <p className="mt-1 text-sm text-red-600">
                  {formErrors.jobPosition}
                </p>
              )}
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

            <div className="flex flex-col gap-3 mt-2">
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  type="button"
                  onClick={generateEmailPreview}
                  disabled={!isFormValid()}
                  className={`flex-1 flex items-center justify-center gap-2 border rounded-md px-4 py-2.5 font-medium transition shadow-sm ${
                    isFormValid()
                      ? "border-gray-300 bg-white hover:bg-gray-50 text-gray-700 cursor-pointer"
                      : "border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed"
                  }`}
                >
                  <FaEye /> Preview
                </button>
                <button
                  type="submit"
                  disabled={!isFormValid() || isPending}
                  className={`flex-1 flex items-center justify-center gap-2 border rounded-md px-4 py-2.5 font-medium transition shadow-sm ${
                    isFormValid() && !isPending
                      ? "border-indigo-600 bg-indigo-500 hover:bg-indigo-600 text-white cursor-pointer"
                      : "border-gray-300 bg-gray-300 text-gray-500 cursor-not-allowed"
                  }`}
                >
                  <FaPaperPlane /> Send Email
                </button>
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  type="button"
                  onClick={handleCopyLinkedInMessage}
                  disabled={!isLinkedInFormValid()}
                  className={`flex-1 flex items-center justify-center gap-2 border rounded-md px-4 py-2.5 font-medium transition shadow-sm ${
                    isLinkedInFormValid()
                      ? "border-blue-600 bg-blue-500 hover:bg-blue-600 text-white cursor-pointer"
                      : "border-gray-300 bg-gray-300 text-gray-500 cursor-not-allowed"
                  }`}
                >
                  <FaLinkedin /> LinkedIn Message
                </button>
                <button
                  type="button"
                  onClick={handleCopyEmailForInMail}
                  disabled={!isLinkedInFormValid()}
                  className={`flex-1 flex items-center justify-center gap-2 border rounded-md px-4 py-2.5 font-medium transition shadow-sm ${
                    isLinkedInFormValid()
                      ? "border-purple-600 bg-purple-500 hover:bg-purple-600 text-white cursor-pointer"
                      : "border-gray-300 bg-gray-300 text-gray-500 cursor-not-allowed"
                  }`}
                >
                  <FaEnvelopeOpen /> InMail Email
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
