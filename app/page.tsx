"use client";
import Link from "next/link";
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
  FaEye,
  FaExclamationTriangle,
  FaEnvelopeOpen,
  FaCheckCircle,
  FaTimesCircle,
  FaHistory,
  FaClock,
  FaReply,
  FaCalendarAlt,
  FaTimes,
  FaChartLine,
} from "react-icons/fa";
import PreviewModal from "@/components/PreviewModal";
import QuickActionModal from "@/components/QuickActionModal";
import { buildAlumTemplate } from "@/templates/alumTemplate";
import { buildEmailTemplate } from "@/templates/emailTemplateNew";
import { buildRecruiterTemplate } from "@/templates/recruiterTemplate";
import { UNIVERSITY_NAME } from "@/lib/constants";

type TimePreset = {
  label: string;
  date: string;
  time: string;
  description: string;
};

function getOptimalTimePresets(): TimePreset[] {
  const now = new Date();
  const currentHour = now.getHours();
  const currentDay = now.getDay();
  const presets: TimePreset[] = [];

  const getNextWeekday = (targetDay: number): Date => {
    const result = new Date(now);
    result.setHours(0, 0, 0, 0);
    const daysUntilTarget = (targetDay + 7 - result.getDay()) % 7;
    result.setDate(result.getDate() + (daysUntilTarget || 7));
    return result;
  };

  const formatDate = (date: Date): string => date.toISOString().split("T")[0];

  if (currentDay === 0 || currentDay === 6) {
    const nextTuesday = getNextWeekday(2);
    nextTuesday.setHours(10, 0, 0, 0);
    presets.push({
      label: "Next Tuesday 10 AM",
      date: formatDate(nextTuesday),
      time: "10:00",
      description: "Best day & time for responses",
    });

    const nextWednesday = getNextWeekday(3);
    nextWednesday.setHours(10, 0, 0, 0);
    presets.push({
      label: "Next Wednesday 10 AM",
      date: formatDate(nextWednesday),
      time: "10:00",
      description: "Peak engagement time",
    });
  } else if (currentHour >= 16) {
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(10, 0, 0, 0);

    if (tomorrow.getDay() === 6) {
      const nextMonday = new Date(tomorrow);
      nextMonday.setDate(nextMonday.getDate() + 2);
      presets.push({
        label: "Monday 10 AM",
        date: formatDate(nextMonday),
        time: "10:00",
        description: "Start of week",
      });
    } else if (tomorrow.getDay() === 0) {
      const nextMonday = new Date(tomorrow);
      nextMonday.setDate(nextMonday.getDate() + 1);
      presets.push({
        label: "Monday 10 AM",
        date: formatDate(nextMonday),
        time: "10:00",
        description: "Start of week",
      });
    } else {
      presets.push({
        label: "Tomorrow 10 AM",
        date: formatDate(tomorrow),
        time: "10:00",
        description: "Morning priority",
      });
    }

    const dayAfter = new Date(now);
    dayAfter.setDate(dayAfter.getDate() + 2);
    if (dayAfter.getDay() !== 0 && dayAfter.getDay() !== 6) {
      dayAfter.setHours(10, 0, 0, 0);
      const dayName = dayAfter.toLocaleDateString("en-US", {
        weekday: "short",
      });
      presets.push({
        label: `${dayName} 10 AM`,
        date: formatDate(dayAfter),
        time: "10:00",
        description: "Optimal timing",
      });
    }
  } else {
    const today = new Date(now);
    if (currentHour < 10) {
      today.setHours(10, 0, 0, 0);
      presets.push({
        label: "Today 10 AM",
        date: formatDate(today),
        time: "10:00",
        description: "Peak morning time",
      });
    }

    if (currentHour < 14) {
      today.setHours(14, 0, 0, 0);
      presets.push({
        label: "Today 2 PM",
        date: formatDate(today),
        time: "14:00",
        description: "Post-lunch check",
      });
    }

    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    if (tomorrow.getDay() === 6) {
      const nextMonday = new Date(tomorrow);
      nextMonday.setDate(nextMonday.getDate() + 2);
      nextMonday.setHours(10, 0, 0, 0);
      presets.push({
        label: "Monday 10 AM",
        date: formatDate(nextMonday),
        time: "10:00",
        description: "Start of week",
      });
    } else if (tomorrow.getDay() === 0) {
      const nextMonday = new Date(tomorrow);
      nextMonday.setDate(nextMonday.getDate() + 1);
      nextMonday.setHours(10, 0, 0, 0);
      presets.push({
        label: "Monday 10 AM",
        date: formatDate(nextMonday),
        time: "10:00",
        description: "Start of week",
      });
    } else {
      tomorrow.setHours(10, 0, 0, 0);
      presets.push({
        label: "Tomorrow 10 AM",
        date: formatDate(tomorrow),
        time: "10:00",
        description: "Morning priority",
      });
    }
  }

  const nextTuesday = getNextWeekday(2);
  nextTuesday.setHours(10, 0, 0, 0);
  if (!presets.some((p) => p.date === formatDate(nextTuesday))) {
    presets.push({
      label: "Next Tuesday 10 AM",
      date: formatDate(nextTuesday),
      time: "10:00",
      description: "Best response rate",
    });
  }

  const nextWednesday = getNextWeekday(3);
  nextWednesday.setHours(14, 0, 0, 0);
  if (!presets.some((p) => p.date === formatDate(nextWednesday))) {
    presets.push({
      label: "Next Wed 2 PM",
      date: formatDate(nextWednesday),
      time: "14:00",
      description: "Mid-week optimal",
    });
  }

  return presets.slice(0, 4);
}

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
    resumeFile: "resume.pdf",
  });
  const emailInputRef = useRef<HTMLInputElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const [isPending, setIsPending] = useState(false);
  const [previewModal, setPreviewModal] = useState({
    isOpen: false,
    emailHtml: "",
    emailSubject: "",
    editedHtml: "",
  });
  const [scheduleModal, setScheduleModal] = useState({
    isOpen: false,
    scheduledDate: "",
    scheduledTime: "",
  });
  const [isScheduling, setIsScheduling] = useState(false);
  const [quickActionModal, setQuickActionModal] = useState({
    isOpen: false,
    emailLogId: "",
    recipientName: "",
    companyName: "",
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

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { id, value } = e.target;
    const type = "type" in e.target ? e.target.type : "select";
    const checked = "checked" in e.target ? e.target.checked : false;

    setEmailForm((prev) => {
      const newForm = {
        ...prev,
        [id]: type === "checkbox" ? checked : value,
      };

      return newForm;
    });

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
        if (data.suggestedCompany) {
          setEmailForm((prev) => {
            if (!prev.company) {
              return { ...prev, company: data.suggestedCompany };
            }
            return prev;
          });
        }
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
          body: JSON.stringify({
            ...emailForm,
            customHtml: previewModal.editedHtml || undefined,
          }),
        });

        const data = await response.json();
        if (response.ok) {
          toast.success("Email Sent Successfully!");

          // Show Quick Action Modal
          if (data.emailLogId) {
            setQuickActionModal({
              isOpen: true,
              emailLogId: data.emailLogId,
              recipientName: emailForm.name,
              companyName: emailForm.company,
            });
          }
          // Smart Reset: Clear specific fields for next applicant at same company
          setEmailForm({
            email: emailForm.email,
            name: "",
            company: emailForm.company,
            jobPosition: emailForm.jobPosition,
            isAlum: emailForm.isAlum,
            isRecruiter: emailForm.isRecruiter,
            tenureYears: "",
            personalMention: "",
            resumeFile: emailForm.resumeFile,
          });

          // Reset edited HTML for next email
          setPreviewModal((prev) => ({
            ...prev,
            editedHtml: "",
          }));

          // Smart Focus: Select username for quick editing
          const atIndex = emailForm.email.indexOf("@");
          if (atIndex > 0 && emailInputRef.current) {
            emailInputRef.current.focus();
            try {
              emailInputRef.current.setSelectionRange(0, atIndex);
            } catch (e) {
              // setSelectionRange not supported on email input type
            }
          }

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
      editedHtml: "",
    });
  };

  const handleHtmlChange = (html: string) => {
    setPreviewModal((prev) => ({
      ...prev,
      editedHtml: html,
    }));
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

  const handleOpenScheduleModal = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const dateStr = tomorrow.toISOString().split("T")[0];
    const timeStr = "09:00";

    setScheduleModal({
      isOpen: true,
      scheduledDate: dateStr,
      scheduledTime: timeStr,
    });
  };

  const handleScheduleEmail = async () => {
    if (!scheduleModal.scheduledDate || !scheduleModal.scheduledTime) {
      toast.error("Please select a date and time");
      return;
    }

    setIsScheduling(true);
    try {
      const scheduledDateTime = new Date(
        `${scheduleModal.scheduledDate}T${scheduleModal.scheduledTime}`,
      );

      const response = await fetch("/api/schedule-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...emailForm,
          scheduledFor: scheduledDateTime.toISOString(),
          customHtml: previewModal.editedHtml || undefined,
        }),
      });

      if (response.ok) {
        toast.success("Email scheduled successfully!");
        setScheduleModal({
          isOpen: false,
          scheduledDate: "",
          scheduledTime: "",
        });
        // Smart Reset: Clear specific fields for next applicant at same company
        setEmailForm({
          email: emailForm.email,
          name: "",
          company: emailForm.company,
          jobPosition: emailForm.jobPosition,
          isAlum: emailForm.isAlum,
          isRecruiter: emailForm.isRecruiter,
          tenureYears: "",
          personalMention: "",
          resumeFile: emailForm.resumeFile,
        });

        // Reset edited HTML for next email
        setPreviewModal((prev) => ({
          ...prev,
          editedHtml: "",
        }));

        // Smart Focus: Select username for quick editing
        const atIndex = emailForm.email.indexOf("@");
        if (atIndex > 0 && emailInputRef.current) {
          // Small timeout to allow modal to close and focus to return
          setTimeout(() => {
            if (emailInputRef.current) {
              emailInputRef.current.focus();
              try {
                emailInputRef.current.setSelectionRange(0, atIndex);
              } catch (e) {
                // setSelectionRange not supported on email input type
              }
            }
          }, 100);
        }

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
        const errorData = await response.json();
        console.error("Schedule email error:", errorData);
        toast.error(
          `Failed to schedule email: ${errorData.details || errorData.error || "Unknown error"}`,
        );
      }
    } catch (error) {
      console.error("Error scheduling email:", error);
      toast.error("Failed to schedule email");
    } finally {
      setIsScheduling(false);
    }
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
        onHtmlChange={handleHtmlChange}
        currentEditedHtml={previewModal.editedHtml}
      />
      <QuickActionModal
        isOpen={quickActionModal.isOpen}
        onClose={() =>
          setQuickActionModal({ ...quickActionModal, isOpen: false })
        }
        emailLogId={quickActionModal.emailLogId}
        recipientName={quickActionModal.recipientName}
        companyName={quickActionModal.companyName}
        onUpdate={() => {}}
      />
      <div className="min-h-screen flex justify-center items-center bg-gray-100">
        <div className="bg-white p-8 shadow-md rounded-lg w-lg">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-semibold">Send Email</h1>
            <div className="flex items-center gap-3">
              <Link
                href="/analytics"
                className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-purple-600 hover:text-purple-800 hover:bg-purple-50 rounded-md transition"
              >
                <FaChartLine /> Analytics
              </Link>
              <Link
                href="/follow-ups"
                className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-orange-600 hover:text-orange-800 hover:bg-orange-50 rounded-md transition"
              >
                <FaReply /> Follow-Ups
              </Link>
              <Link
                href="/history"
                className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50 rounded-md transition"
              >
                <FaHistory /> Email History
              </Link>
            </div>
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
                ref={emailInputRef}
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

            {/* Resume Selection */}
            <div className="flex flex-col">
              <label
                htmlFor="resumeFile"
                className="text-sm font-medium text-gray-700 flex items-center gap-2"
              >
                📄 Resume File
              </label>
              <select
                id="resumeFile"
                name="resumeFile"
                value={emailForm.resumeFile}
                onChange={handleChange}
                className="border border-gray-300 mt-1 px-3 py-2 rounded-md focus:outline-none focus:ring focus:ring-indigo-500 bg-white"
              >
                <option value="resume.pdf">Default Resume (resume.pdf)</option>
                <option value="resume_blockchain.pdf">
                  Blockchain Resume (resume_blockchain.pdf)
                </option>
              </select>
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
                <button
                  type="button"
                  onClick={handleOpenScheduleModal}
                  disabled={!isFormValid()}
                  className={`flex-1 flex items-center justify-center gap-2 border rounded-md px-4 py-2.5 font-medium transition shadow-sm ${
                    isFormValid()
                      ? "border-blue-600 bg-blue-500 hover:bg-blue-600 text-white cursor-pointer"
                      : "border-gray-300 bg-gray-300 text-gray-500 cursor-not-allowed"
                  }`}
                >
                  <FaCalendarAlt /> Schedule
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

      {/* Schedule Modal */}
      {scheduleModal.isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <FaCalendarAlt className="text-blue-600" />
                Schedule Email
              </h2>
              <button
                onClick={() =>
                  setScheduleModal({
                    isOpen: false,
                    scheduledDate: "",
                    scheduledTime: "",
                  })
                }
                className="text-gray-400 hover:text-gray-600 transition"
              >
                <FaTimes size={20} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Quick Presets
                </label>
                <div className="grid grid-cols-2 gap-2 mb-4">
                  {getOptimalTimePresets().map((preset, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() =>
                        setScheduleModal({
                          ...scheduleModal,
                          scheduledDate: preset.date,
                          scheduledTime: preset.time,
                        })
                      }
                      className="flex flex-col items-start p-3 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition text-left group"
                    >
                      <span className="text-sm font-semibold text-gray-900 group-hover:text-blue-700">
                        {preset.label}
                      </span>
                      <span className="text-xs text-gray-500 mt-0.5">
                        {preset.description}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="px-2 bg-white text-gray-500">
                    Or pick custom time
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date
                </label>
                <input
                  type="date"
                  value={scheduleModal.scheduledDate}
                  onChange={(e) =>
                    setScheduleModal({
                      ...scheduleModal,
                      scheduledDate: e.target.value,
                    })
                  }
                  min={new Date().toISOString().split("T")[0]}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Time
                </label>
                <input
                  type="time"
                  value={scheduleModal.scheduledTime}
                  onChange={(e) =>
                    setScheduleModal({
                      ...scheduleModal,
                      scheduledTime: e.target.value,
                    })
                  }
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
                <p className="text-sm text-blue-800">
                  <strong>Recipient:</strong> {emailForm.name} (
                  {emailForm.email})
                </p>
                <p className="text-sm text-blue-800 mt-1">
                  <strong>Company:</strong> {emailForm.company}
                </p>
                <p className="text-sm text-blue-800 mt-1">
                  <strong>Position:</strong> {emailForm.jobPosition}
                </p>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={() =>
                    setScheduleModal({
                      isOpen: false,
                      scheduledDate: "",
                      scheduledTime: "",
                    })
                  }
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 font-medium transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleScheduleEmail}
                  disabled={
                    isScheduling ||
                    !scheduleModal.scheduledDate ||
                    !scheduleModal.scheduledTime
                  }
                  className={`flex-1 px-4 py-2 rounded-md font-medium transition flex items-center justify-center gap-2 ${
                    isScheduling ||
                    !scheduleModal.scheduledDate ||
                    !scheduleModal.scheduledTime
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                      : "bg-blue-600 text-white hover:bg-blue-700"
                  }`}
                >
                  {isScheduling ? (
                    <>
                      <FaClock className="animate-spin" />
                      Scheduling...
                    </>
                  ) : (
                    <>
                      <FaCalendarAlt />
                      Schedule Email
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
