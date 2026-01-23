"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";
import {
  FaArrowLeft,
  FaEnvelope,
  FaPaperPlane,
  FaCheckCircle,
  FaClock,
  FaExclamationCircle,
  FaCalendarAlt,
  FaEye,
  FaCopy,
  FaCheck,
  FaBuilding,
  FaBriefcase,
  FaHistory,
} from "react-icons/fa";
import PreviewModal from "@/components/PreviewModal";
import { buildFollowUpTemplate } from "@/templates/followUpTemplate";

type FollowUp = {
  id: string;
  sentAt: string;
  jobPosition: string;
  followUpScheduledFor: string | null;
  followUpCount: number;
  lastFollowUpDate: string | null;
  recipient: {
    name: string;
    email: string;
    company: {
      companyName: string;
    };
  };
};

type CategorizedFollowUps = {
  overdue: FollowUp[];
  today: FollowUp[];
  thisWeek: FollowUp[];
  later: FollowUp[];
};

function FollowUpCard({
  followUp,
  onSend,
  onPreview,
  onCopy,
  onMarkSent,
  sendingId,
  markingId,
  formatDate,
  getDaysUntil,
  urgency,
}: {
  followUp: FollowUp;
  onSend: (followUp: FollowUp) => void;
  onPreview: (followUp: FollowUp) => void;
  onCopy: (followUp: FollowUp) => void;
  onMarkSent: (followUp: FollowUp) => void;
  sendingId: string | null;
  markingId: string | null;
  formatDate: (date: string) => string;
  getDaysUntil: (date: string) => number;
  urgency: "overdue" | "today" | "normal";
}) {
  const daysUntil = getDaysUntil(followUp.followUpScheduledFor);
  const urgencyColors = {
    overdue: "border-red-300 bg-red-50",
    today: "border-orange-300 bg-orange-50",
    normal: "border-gray-200 bg-white",
  };

  return (
    <div
      className={`border rounded-lg p-4 hover:shadow-md transition ${urgencyColors[urgency]}`}
    >
      <div className="flex flex-col gap-3">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <FaEnvelope className="text-indigo-600 flex-shrink-0" />
              <h3 className="font-semibold text-lg truncate">
                {followUp.recipient.name}
              </h3>
            </div>
            <div className="text-sm text-gray-700 space-y-1">
              <p className="truncate">
                <strong>Company:</strong>{" "}
                {followUp.recipient.company.companyName}
              </p>
              <p className="truncate">
                <strong>Position:</strong> {followUp.jobPosition}
              </p>
              <p className="truncate">
                <strong>Email:</strong> {followUp.recipient.email}
              </p>
              <p>
                <strong>Sent:</strong>{" "}
                {new Date(followUp.sentAt).toLocaleDateString()}
              </p>
              <p>
                <strong>Due:</strong>{" "}
                <span className="font-medium">
                  {formatDate(followUp.followUpScheduledFor)}
                  {daysUntil < 0 && (
                    <span className="text-red-600 ml-2">
                      ({Math.abs(daysUntil)} days overdue)
                    </span>
                  )}
                  {daysUntil === 0 && (
                    <span className="text-orange-600 ml-2">(Today)</span>
                  )}
                </span>
              </p>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <div className="flex gap-2">
            <button
              onClick={() => onPreview(followUp)}
              className="flex-1 flex items-center justify-center gap-2 px-3 py-2 border border-gray-300 bg-white hover:bg-gray-50 rounded-md text-gray-700 font-medium transition"
            >
              <FaEye /> Preview
            </button>
            <button
              onClick={() => onCopy(followUp)}
              className="flex-1 flex items-center justify-center gap-2 px-3 py-2 border border-gray-300 bg-white hover:bg-gray-50 rounded-md text-gray-700 font-medium transition"
            >
              <FaCopy /> Copy
            </button>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => onMarkSent(followUp)}
              disabled={markingId === followUp.id}
              className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-md font-medium transition ${
                markingId === followUp.id
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-green-600 text-white hover:bg-green-700"
              }`}
            >
              <FaCheck />
              {markingId === followUp.id ? "Marking..." : "Mark as Sent"}
            </button>
            <button
              onClick={() => onSend(followUp)}
              disabled={sendingId === followUp.id}
              className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-md font-medium transition ${
                sendingId === followUp.id
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : urgency === "overdue"
                    ? "bg-red-600 text-white hover:bg-red-700"
                    : urgency === "today"
                      ? "bg-orange-600 text-white hover:bg-orange-700"
                      : "bg-indigo-500 text-white hover:bg-indigo-600"
              }`}
            >
              <FaPaperPlane />
              {sendingId === followUp.id ? "Sending..." : "Send"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function FollowUpSections({
  categorized,
  onSend,
  onPreview,
  onCopy,
  onMarkSent,
  sendingId,
  markingId,
  formatDate,
  getDaysUntil,
}: {
  categorized: CategorizedFollowUps;
  onSend: (followUp: FollowUp) => void;
  onPreview: (followUp: FollowUp) => void;
  onCopy: (followUp: FollowUp) => void;
  onMarkSent: (followUp: FollowUp) => void;
  sendingId: string | null;
  markingId: string | null;
  formatDate: (date: string) => string;
  getDaysUntil: (date: string) => number;
}) {
  return (
    <div className="space-y-6">
      {categorized.overdue.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-3">
            <FaExclamationCircle className="text-red-600 text-xl" />
            <h2 className="text-lg font-semibold text-red-600">
              Overdue ({categorized.overdue.length})
            </h2>
          </div>
          <div className="space-y-3">
            {categorized.overdue.map((followUp) => (
              <FollowUpCard
                key={followUp.id}
                followUp={followUp}
                onSend={onSend}
                onPreview={onPreview}
                onCopy={onCopy}
                onMarkSent={onMarkSent}
                sendingId={sendingId}
                markingId={markingId}
                formatDate={formatDate}
                getDaysUntil={getDaysUntil}
                urgency="overdue"
              />
            ))}
          </div>
        </div>
      )}

      {categorized.today.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-3">
            <FaClock className="text-orange-600 text-xl" />
            <h2 className="text-lg font-semibold text-orange-600">
              Due Today ({categorized.today.length})
            </h2>
          </div>
          <div className="space-y-3">
            {categorized.today.map((followUp) => (
              <FollowUpCard
                key={followUp.id}
                followUp={followUp}
                onSend={onSend}
                onPreview={onPreview}
                onCopy={onCopy}
                onMarkSent={onMarkSent}
                sendingId={sendingId}
                markingId={markingId}
                formatDate={formatDate}
                getDaysUntil={getDaysUntil}
                urgency="today"
              />
            ))}
          </div>
        </div>
      )}

      {categorized.thisWeek.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-3">
            <FaCalendarAlt className="text-blue-600 text-xl" />
            <h2 className="text-lg font-semibold text-blue-600">
              This Week ({categorized.thisWeek.length})
            </h2>
          </div>
          <div className="space-y-3">
            {categorized.thisWeek.map((followUp) => (
              <FollowUpCard
                key={followUp.id}
                followUp={followUp}
                onSend={onSend}
                onPreview={onPreview}
                onCopy={onCopy}
                onMarkSent={onMarkSent}
                sendingId={sendingId}
                markingId={markingId}
                formatDate={formatDate}
                getDaysUntil={getDaysUntil}
                urgency="normal"
              />
            ))}
          </div>
        </div>
      )}

      {categorized.later.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-3">
            <FaCalendarAlt className="text-gray-500 text-xl" />
            <h2 className="text-lg font-semibold text-gray-600">
              Later ({categorized.later.length})
            </h2>
          </div>
          <div className="space-y-3">
            {categorized.later.map((followUp) => (
              <FollowUpCard
                key={followUp.id}
                followUp={followUp}
                onSend={onSend}
                onPreview={onPreview}
                onCopy={onCopy}
                onMarkSent={onMarkSent}
                sendingId={sendingId}
                markingId={markingId}
                formatDate={formatDate}
                getDaysUntil={getDaysUntil}
                urgency="normal"
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function FollowUps() {
  const [followUps, setFollowUps] = useState<FollowUp[]>([]);
  const [loading, setLoading] = useState(true);
  const [sendingId, setSendingId] = useState<string | null>(null);
  const [markingId, setMarkingId] = useState<string | null>(null);
  const [previewModal, setPreviewModal] = useState({
    isOpen: false,
    emailHtml: "",
    emailSubject: "",
    recipientEmail: "",
  });

  useEffect(() => {
    fetchFollowUps();
  }, []);

  const fetchFollowUps = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/follow-ups");
      const data = await response.json();
      setFollowUps(data.followUps || []);
    } catch (error) {
      console.error("Error fetching follow-ups:", error);
      toast.error("Failed to load follow-ups");
    } finally {
      setLoading(false);
    }
  };

  const categorizeFollowUps = (): CategorizedFollowUps => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const weekFromNow = new Date(today);
    weekFromNow.setDate(weekFromNow.getDate() + 7);

    const categorized: CategorizedFollowUps = {
      overdue: [],
      today: [],
      thisWeek: [],
      later: [],
    };

    followUps.forEach((followUp) => {
      const dueDate = new Date(followUp.followUpScheduledFor);
      const dueDateOnly = new Date(
        dueDate.getFullYear(),
        dueDate.getMonth(),
        dueDate.getDate(),
      );

      if (dueDateOnly < today) {
        categorized.overdue.push(followUp);
      } else if (dueDateOnly.getTime() === today.getTime()) {
        categorized.today.push(followUp);
      } else if (dueDateOnly < weekFromNow) {
        categorized.thisWeek.push(followUp);
      } else {
        categorized.later.push(followUp);
      }
    });

    return categorized;
  };

  const handleSendFollowUp = async (followUp: FollowUp) => {
    setSendingId(followUp.id);
    try {
      const response = await fetch("/api/send-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: followUp.recipient.email,
          name: followUp.recipient.name,
          company: followUp.recipient.company.companyName,
          jobPosition: followUp.jobPosition,
          isFollowUp: true,
          isAlum: false,
          isRecruiter: false,
        }),
      });

      if (response.ok) {
        toast.success("Follow-up email sent successfully!");
        setFollowUps(followUps.filter((f) => f.id !== followUp.id));
      } else {
        toast.error("Failed to send follow-up email");
      }
    } catch (error) {
      console.error("Error sending follow-up:", error);
      toast.error("Failed to send follow-up email");
    } finally {
      setSendingId(null);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  };

  const getDaysUntil = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const dueDate = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
    );
    const diffDays = Math.floor(
      (dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24),
    );
    return diffDays;
  };

  const handlePreview = (followUp: FollowUp) => {
    const emailHtml = buildFollowUpTemplate({
      name: followUp.recipient.name,
      company: followUp.recipient.company.companyName,
      jobPosition: followUp.jobPosition,
      isRecruiter: false,
    });

    const emailSubject = `Following up - ${followUp.jobPosition} at ${followUp.recipient.company.companyName}`;

    setPreviewModal({
      isOpen: true,
      emailHtml,
      emailSubject,
      recipientEmail: followUp.recipient.email,
    });
  };

  const handleCopy = (followUp: FollowUp) => {
    const emailHtml = buildFollowUpTemplate({
      name: followUp.recipient.name,
      company: followUp.recipient.company.companyName,
      jobPosition: followUp.jobPosition,
      isRecruiter: false,
    });

    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = emailHtml;
    const emailText = tempDiv.textContent || tempDiv.innerText || "";

    navigator.clipboard
      .writeText(emailText)
      .then(() => {
        toast.success("Follow-up email copied to clipboard!");
      })
      .catch(() => {
        toast.error("Failed to copy email content");
      });
  };

  const handleMarkSent = async (followUp: FollowUp) => {
    setMarkingId(followUp.id);
    try {
      const response = await fetch("/api/mark-followup-sent", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          emailLogId: followUp.id,
        }),
      });

      if (response.ok) {
        toast.success("Follow-up marked as sent!");
        setFollowUps(followUps.filter((f) => f.id !== followUp.id));
      } else {
        toast.error("Failed to mark follow-up as sent");
      }
    } catch (error) {
      console.error("Error marking follow-up as sent:", error);
      toast.error("Failed to mark follow-up as sent");
    } finally {
      setMarkingId(null);
    }
  };

  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />
      <PreviewModal
        isOpen={previewModal.isOpen}
        onClose={() => setPreviewModal({ ...previewModal, isOpen: false })}
        emailHtml={previewModal.emailHtml}
        emailSubject={previewModal.emailSubject}
        recipientEmail={previewModal.recipientEmail}
      />
      <div className="min-h-screen bg-gray-100 p-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <Link
                  href="/"
                  className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-md transition"
                >
                  <FaArrowLeft /> Back
                </Link>
                <h1 className="text-2xl font-semibold">Follow-Up Emails</h1>
              </div>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-12">
                <FaClock className="animate-spin text-3xl text-indigo-500" />
              </div>
            ) : followUps.length === 0 ? (
              <div className="text-center py-12">
                <FaCheckCircle className="mx-auto text-5xl text-green-500 mb-4" />
                <p className="text-gray-600 text-lg">No scheduled follow-ups</p>
                <p className="text-gray-500 text-sm mt-2">
                  Send some emails to start scheduling follow-ups
                </p>
              </div>
            ) : (
              <FollowUpSections
                categorized={categorizeFollowUps()}
                onSend={handleSendFollowUp}
                onPreview={handlePreview}
                onCopy={handleCopy}
                onMarkSent={handleMarkSent}
                sendingId={sendingId}
                markingId={markingId}
                formatDate={formatDate}
                getDaysUntil={getDaysUntil}
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
}
