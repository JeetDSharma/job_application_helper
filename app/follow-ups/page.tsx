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
  FaInbox,
  FaTimes,
  FaEdit,
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

type ScheduledEmail = {
  id: string;
  createdAt: string;
  scheduledFor: string;
  subject: string;
  htmlBody: string;
  jobPosition: string;
  templateUsed: string;
  isFollowUp: boolean;
  isAlum: boolean;
  isRecruiter: boolean;
  status: string;
  recipient: {
    name: string;
    email: string;
    company: {
      companyName: string;
    };
  };
};

type CategorizedScheduledEmails = {
  overdue: ScheduledEmail[];
  today: ScheduledEmail[];
  thisWeek: ScheduledEmail[];
  later: ScheduledEmail[];
};

type CategorizedFollowUps = {
  overdue: FollowUp[];
  today: FollowUp[];
  thisWeek: FollowUp[];
  later: FollowUp[];
};

function EditScheduledEmailModal({
  isOpen,
  onClose,
  email,
  onSave,
}: {
  isOpen: boolean;
  onClose: () => void;
  email: ScheduledEmail | null;
  onSave: (data: {
    id: string;
    recipientName: string;
    recipientEmail: string;
    companyName: string;
    jobPosition: string;
    scheduledFor: string;
  }) => Promise<void>;
}) {
  const [recipientName, setRecipientName] = useState("");
  const [recipientEmail, setRecipientEmail] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [jobPosition, setJobPosition] = useState("");
  const [scheduledFor, setScheduledFor] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (email) {
      setRecipientName(email.recipient.name);
      setRecipientEmail(email.recipient.email);
      setCompanyName(email.recipient.company.companyName);
      setJobPosition(email.jobPosition);
      const date = new Date(email.scheduledFor);
      const localIso = new Date(
        date.getTime() - date.getTimezoneOffset() * 60000,
      )
        .toISOString()
        .slice(0, 16);
      setScheduledFor(localIso);
    }
  }, [email]);

  if (!isOpen || !email) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await onSave({
        id: email.id,
        recipientName,
        recipientEmail,
        companyName,
        jobPosition,
        scheduledFor: new Date(scheduledFor).toISOString(),
      });
      onClose();
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md mx-4 overflow-hidden">
        <div className="bg-slate-900 px-5 py-4 flex items-center justify-between">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <FaEdit /> Edit Scheduled Email
          </h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors"
          >
            <FaTimes />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Recipient Name
            </label>
            <input
              type="text"
              value={recipientName}
              onChange={(e) => setRecipientName(e.target.value)}
              required
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Recipient Email
            </label>
            <input
              type="email"
              value={recipientEmail}
              onChange={(e) => setRecipientEmail(e.target.value)}
              required
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Company
            </label>
            <input
              type="text"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              required
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Job Position
            </label>
            <input
              type="text"
              value={jobPosition}
              onChange={(e) => setJobPosition(e.target.value)}
              required
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Scheduled For
            </label>
            <input
              type="datetime-local"
              value={scheduledFor}
              onChange={(e) => setScheduledFor(e.target.value)}
              required
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 border border-slate-300 bg-white hover:bg-slate-50 rounded-lg text-sm font-semibold text-slate-700 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className={`flex-1 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                saving
                  ? "bg-slate-200 text-slate-500 cursor-not-allowed"
                  : "bg-blue-600 text-white hover:bg-blue-700 hover:shadow-md"
              }`}
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function PendingFollowUpCard({
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
  const daysUntil = followUp.followUpScheduledFor
    ? getDaysUntil(followUp.followUpScheduledFor)
    : 0;
  const urgencyConfig = {
    overdue: {
      bg: "bg-white",
      border: "border-l-4 border-red-600",
      badge: "bg-red-600 text-white",
      badgeText: `${Math.abs(daysUntil)} days overdue`,
    },
    today: {
      bg: "bg-white",
      border: "border-l-4 border-amber-500",
      badge: "bg-amber-500 text-white",
      badgeText: "Due Today",
    },
    normal: {
      bg: "bg-white",
      border: "border-l-4 border-slate-300",
      badge: "bg-slate-700 text-white",
      badgeText: daysUntil === 1 ? "Tomorrow" : `In ${daysUntil} days`,
    },
  };

  const config = urgencyConfig[urgency];

  return (
    <div
      className={`${config.bg} ${config.border} border border-slate-200 rounded-lg p-4 hover:shadow-md hover:border-slate-300 transition-all duration-200`}
    >
      <div className="flex flex-col gap-3">
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2.5 mb-1.5">
              <div className="w-9 h-9 bg-slate-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <FaEnvelope className="text-slate-700" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-base text-slate-900 truncate">
                  {followUp.recipient.name}
                </h3>
                <p className="text-xs text-slate-500 truncate">
                  {followUp.recipient.email}
                </p>
              </div>
            </div>
          </div>
          <span
            className={`${config.badge} px-2.5 py-1 rounded-md text-xs font-bold whitespace-nowrap`}
          >
            {config.badgeText}
          </span>
        </div>

        {/* Details */}
        <div className="grid grid-cols-2 gap-2.5 text-xs">
          <div className="flex items-center gap-2 text-slate-700">
            <FaBuilding className="text-slate-400 flex-shrink-0" />
            <span className="truncate font-medium">
              {followUp.recipient.company.companyName}
            </span>
          </div>
          <div className="flex items-center gap-2 text-slate-700">
            <FaBriefcase className="text-slate-400 flex-shrink-0" />
            <span className="truncate font-medium">{followUp.jobPosition}</span>
          </div>
          <div className="flex items-center gap-2 text-slate-600">
            <FaCalendarAlt className="text-slate-400 flex-shrink-0" />
            <span>Sent: {new Date(followUp.sentAt).toLocaleDateString()}</span>
          </div>
          {followUp.followUpScheduledFor && (
            <div className="flex items-center gap-2 text-slate-600">
              <FaClock className="text-slate-400 flex-shrink-0" />
              <span>Due: {formatDate(followUp.followUpScheduledFor)}</span>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-2.5 border-t border-slate-200">
          <button
            onClick={() => onPreview(followUp)}
            className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 border border-slate-300 bg-white hover:bg-slate-50 hover:border-slate-400 rounded-md text-slate-700 font-medium transition-all"
          >
            <FaEye className="text-xs" />
            <span className="text-xs">Preview</span>
          </button>
          <button
            onClick={() => onCopy(followUp)}
            className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 border border-slate-300 bg-white hover:bg-slate-50 hover:border-slate-400 rounded-md text-slate-700 font-medium transition-all"
          >
            <FaCopy className="text-xs" />
            <span className="text-xs">Copy</span>
          </button>
          <button
            onClick={() => onMarkSent(followUp)}
            disabled={markingId === followUp.id}
            className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-md font-semibold transition-all ${
              markingId === followUp.id
                ? "bg-slate-200 text-slate-500 cursor-not-allowed"
                : "bg-emerald-600 text-white hover:bg-emerald-700 hover:shadow-md"
            }`}
          >
            <FaCheck className="text-xs" />
            <span className="text-xs">
              {markingId === followUp.id ? "Marking..." : "Mark Sent"}
            </span>
          </button>
          <button
            onClick={() => onSend(followUp)}
            disabled={sendingId === followUp.id}
            className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-md font-semibold transition-all ${
              sendingId === followUp.id
                ? "bg-slate-200 text-slate-500 cursor-not-allowed"
                : urgency === "overdue"
                  ? "bg-red-600 text-white hover:bg-red-700 hover:shadow-md"
                  : urgency === "today"
                    ? "bg-amber-500 text-white hover:bg-amber-600 hover:shadow-md"
                    : "bg-slate-900 text-white hover:bg-slate-800 hover:shadow-md"
            }`}
          >
            <FaPaperPlane className="text-xs" />
            <span className="text-xs">
              {sendingId === followUp.id ? "Sending..." : "Send"}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}

function SentFollowUpCard({ followUp }: { followUp: FollowUp }) {
  return (
    <div className="bg-white border border-slate-200 rounded-lg p-4 hover:shadow-md hover:border-slate-300 transition-all duration-200">
      <div className="flex items-start gap-3">
        <div className="w-9 h-9 bg-emerald-100 rounded-lg flex items-center justify-center flex-shrink-0">
          <FaCheckCircle className="text-emerald-600" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-3 mb-2">
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-base text-slate-900 truncate">
                {followUp.recipient.name}
              </h3>
              <p className="text-xs text-slate-500 truncate">
                {followUp.recipient.email}
              </p>
            </div>
            <span className="bg-emerald-600 text-white px-2.5 py-1 rounded-md text-xs font-bold whitespace-nowrap">
              Sent {followUp.followUpCount}x
            </span>
          </div>
          <div className="grid grid-cols-2 gap-2.5 text-xs">
            <div className="flex items-center gap-2 text-slate-700">
              <FaBuilding className="text-slate-400 flex-shrink-0" />
              <span className="truncate font-medium">
                {followUp.recipient.company.companyName}
              </span>
            </div>
            <div className="flex items-center gap-2 text-slate-700">
              <FaBriefcase className="text-slate-400 flex-shrink-0" />
              <span className="truncate font-medium">
                {followUp.jobPosition}
              </span>
            </div>
            <div className="flex items-center gap-2 text-slate-600">
              <FaCalendarAlt className="text-slate-400 flex-shrink-0" />
              <span>
                Initial: {new Date(followUp.sentAt).toLocaleDateString()}
              </span>
            </div>
            {followUp.lastFollowUpDate && (
              <div className="flex items-center gap-2 text-slate-600">
                <FaHistory className="text-slate-400 flex-shrink-0" />
                <span>
                  Last:{" "}
                  {new Date(followUp.lastFollowUpDate).toLocaleDateString()}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function ScheduledEmailCard({
  email,
  onSend,
  onPreview,
  onEdit,
  onCancel,
  sendingId,
  cancellingId,
  formatDate,
  formatTime,
  getDaysUntil,
  urgency,
}: {
  email: ScheduledEmail;
  onSend: (email: ScheduledEmail) => void;
  onPreview: (email: ScheduledEmail) => void;
  onEdit: (email: ScheduledEmail) => void;
  onCancel: (email: ScheduledEmail) => void;
  sendingId: string | null;
  cancellingId: string | null;
  formatDate: (date: string) => string;
  formatTime: (date: string) => string;
  getDaysUntil: (date: string) => number;
  urgency: "overdue" | "today" | "normal";
}) {
  const daysUntil = getDaysUntil(email.scheduledFor);
  const urgencyConfig = {
    overdue: {
      bg: "bg-white",
      border: "border-l-4 border-red-600",
      badge: "bg-red-600 text-white",
      badgeText: `${Math.abs(daysUntil)} days overdue`,
    },
    today: {
      bg: "bg-white",
      border: "border-l-4 border-amber-500",
      badge: "bg-amber-500 text-white",
      badgeText: "Due Today",
    },
    normal: {
      bg: "bg-white",
      border: "border-l-4 border-blue-500",
      badge: "bg-blue-500 text-white",
      badgeText: daysUntil === 1 ? "Tomorrow" : `In ${daysUntil} days`,
    },
  };

  const config = urgencyConfig[urgency];

  return (
    <div
      className={`${config.bg} ${config.border} border border-slate-200 rounded-lg p-4 hover:shadow-md hover:border-slate-300 transition-all duration-200`}
    >
      <div className="flex flex-col gap-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2.5 mb-1.5">
              <div className="w-9 h-9 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <FaClock className="text-blue-700" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-base text-slate-900 truncate">
                  {email.recipient.name}
                </h3>
                <p className="text-xs text-slate-500 truncate">
                  {email.recipient.email}
                </p>
              </div>
            </div>
          </div>
          <span
            className={`${config.badge} px-2.5 py-1 rounded-md text-xs font-bold whitespace-nowrap`}
          >
            {config.badgeText}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2.5 text-xs">
          <div className="flex items-center gap-2 text-slate-700">
            <FaBuilding className="text-slate-400 flex-shrink-0" />
            <span className="truncate font-medium">
              {email.recipient.company.companyName}
            </span>
          </div>
          <div className="flex items-center gap-2 text-slate-700">
            <FaBriefcase className="text-slate-400 flex-shrink-0" />
            <span className="truncate font-medium">{email.jobPosition}</span>
          </div>
          <div className="flex items-center gap-2 text-slate-600">
            <FaCalendarAlt className="text-slate-400 flex-shrink-0" />
            <span>Scheduled: {formatDate(email.scheduledFor)}</span>
          </div>
          <div className="flex items-center gap-2 text-slate-600">
            <FaClock className="text-slate-400 flex-shrink-0" />
            <span>Time: {formatTime(email.scheduledFor)}</span>
          </div>
        </div>

        <div className="flex gap-2 pt-2.5 border-t border-slate-200">
          <button
            onClick={() => onPreview(email)}
            className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 border border-slate-300 bg-white hover:bg-slate-50 hover:border-slate-400 rounded-md text-slate-700 font-medium transition-all"
          >
            <FaEye className="text-xs" />
            <span className="text-xs">Preview</span>
          </button>
          <button
            onClick={() => onEdit(email)}
            className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 border border-blue-300 bg-white hover:bg-blue-50 hover:border-blue-400 rounded-md text-blue-700 font-medium transition-all"
          >
            <FaEdit className="text-xs" />
            <span className="text-xs">Edit</span>
          </button>
          <button
            onClick={() => onCancel(email)}
            disabled={cancellingId === email.id}
            className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-md font-medium transition-all ${
              cancellingId === email.id
                ? "bg-slate-200 text-slate-500 cursor-not-allowed"
                : "border border-red-300 bg-white hover:bg-red-50 hover:border-red-400 text-red-700"
            }`}
          >
            <FaTimes className="text-xs" />
            <span className="text-xs">
              {cancellingId === email.id ? "Cancelling..." : "Cancel"}
            </span>
          </button>
          <button
            onClick={() => onSend(email)}
            disabled={sendingId === email.id}
            className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-md font-semibold transition-all ${
              sendingId === email.id
                ? "bg-slate-200 text-slate-500 cursor-not-allowed"
                : urgency === "overdue"
                  ? "bg-red-600 text-white hover:bg-red-700 hover:shadow-md"
                  : urgency === "today"
                    ? "bg-amber-500 text-white hover:bg-amber-600 hover:shadow-md"
                    : "bg-blue-600 text-white hover:bg-blue-700 hover:shadow-md"
            }`}
          >
            <FaPaperPlane className="text-xs" />
            <span className="text-xs">
              {sendingId === email.id ? "Sending..." : "Send Now"}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}

function PendingFollowUpSections({
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
    <div className="space-y-5">
      {categorized.overdue.length > 0 && (
        <div>
          <div className="flex items-center gap-2.5 mb-3">
            <div className="w-7 h-7 bg-red-100 rounded-lg flex items-center justify-center">
              <FaExclamationCircle className="text-red-600" />
            </div>
            <h2 className="text-lg font-bold text-slate-900">
              Overdue{" "}
              <span className="text-red-600">
                ({categorized.overdue.length})
              </span>
            </h2>
          </div>
          <div className="space-y-3">
            {categorized.overdue.map((followUp) => (
              <PendingFollowUpCard
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
          <div className="flex items-center gap-2.5 mb-2">
            <div className="w-7 h-7 bg-amber-100 rounded-lg flex items-center justify-center">
              <FaClock className="text-amber-600" />
            </div>
            <h2 className="text-lg font-bold text-slate-900">
              Due Today{" "}
              <span className="text-amber-600">
                ({categorized.today.length})
              </span>
            </h2>
          </div>
          <div className="space-y-3">
            {categorized.today.map((followUp) => (
              <PendingFollowUpCard
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
          <div className="flex items-center gap-2.5 mb-2">
            <div className="w-7 h-7 bg-blue-100 rounded-lg flex items-center justify-center">
              <FaCalendarAlt className="text-blue-600" />
            </div>
            <h2 className="text-lg font-bold text-slate-900">
              This Week{" "}
              <span className="text-blue-600">
                ({categorized.thisWeek.length})
              </span>
            </h2>
          </div>
          <div className="space-y-3">
            {categorized.thisWeek.map((followUp) => (
              <PendingFollowUpCard
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
          <div className="flex items-center gap-2.5 mb-2">
            <div className="w-7 h-7 bg-slate-100 rounded-lg flex items-center justify-center">
              <FaCalendarAlt className="text-slate-500" />
            </div>
            <h2 className="text-lg font-bold text-slate-900">
              Later{" "}
              <span className="text-slate-500">
                ({categorized.later.length})
              </span>
            </h2>
          </div>
          <div className="space-y-3">
            {categorized.later.map((followUp) => (
              <PendingFollowUpCard
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

function ScheduledEmailSections({
  categorized,
  onSend,
  onPreview,
  onEdit,
  onCancel,
  sendingId,
  cancellingId,
  formatDate,
  formatTime,
  getDaysUntil,
}: {
  categorized: CategorizedScheduledEmails;
  onSend: (email: ScheduledEmail) => void;
  onPreview: (email: ScheduledEmail) => void;
  onEdit: (email: ScheduledEmail) => void;
  onCancel: (email: ScheduledEmail) => void;
  sendingId: string | null;
  cancellingId: string | null;
  formatDate: (date: string) => string;
  formatTime: (date: string) => string;
  getDaysUntil: (date: string) => number;
}) {
  return (
    <div className="space-y-5">
      {categorized.overdue.length > 0 && (
        <div>
          <div className="flex items-center gap-2.5 mb-3">
            <div className="w-7 h-7 bg-red-100 rounded-lg flex items-center justify-center">
              <FaExclamationCircle className="text-red-600" />
            </div>
            <h2 className="text-lg font-bold text-slate-900">
              Overdue{" "}
              <span className="text-red-600">
                ({categorized.overdue.length})
              </span>
            </h2>
          </div>
          <div className="space-y-3">
            {categorized.overdue.map((email) => (
              <ScheduledEmailCard
                key={email.id}
                email={email}
                onSend={onSend}
                onPreview={onPreview}
                onEdit={onEdit}
                onCancel={onCancel}
                sendingId={sendingId}
                cancellingId={cancellingId}
                formatDate={formatDate}
                formatTime={formatTime}
                getDaysUntil={getDaysUntil}
                urgency="overdue"
              />
            ))}
          </div>
        </div>
      )}

      {categorized.today.length > 0 && (
        <div>
          <div className="flex items-center gap-2.5 mb-2">
            <div className="w-7 h-7 bg-amber-100 rounded-lg flex items-center justify-center">
              <FaClock className="text-amber-600" />
            </div>
            <h2 className="text-lg font-bold text-slate-900">
              Due Today{" "}
              <span className="text-amber-600">
                ({categorized.today.length})
              </span>
            </h2>
          </div>
          <div className="space-y-3">
            {categorized.today.map((email) => (
              <ScheduledEmailCard
                key={email.id}
                email={email}
                onSend={onSend}
                onPreview={onPreview}
                onEdit={onEdit}
                onCancel={onCancel}
                sendingId={sendingId}
                cancellingId={cancellingId}
                formatDate={formatDate}
                formatTime={formatTime}
                getDaysUntil={getDaysUntil}
                urgency="today"
              />
            ))}
          </div>
        </div>
      )}

      {categorized.thisWeek.length > 0 && (
        <div>
          <div className="flex items-center gap-2.5 mb-2">
            <div className="w-7 h-7 bg-blue-100 rounded-lg flex items-center justify-center">
              <FaCalendarAlt className="text-blue-600" />
            </div>
            <h2 className="text-lg font-bold text-slate-900">
              This Week{" "}
              <span className="text-blue-600">
                ({categorized.thisWeek.length})
              </span>
            </h2>
          </div>
          <div className="space-y-3">
            {categorized.thisWeek.map((email) => (
              <ScheduledEmailCard
                key={email.id}
                email={email}
                onSend={onSend}
                onPreview={onPreview}
                onEdit={onEdit}
                onCancel={onCancel}
                sendingId={sendingId}
                cancellingId={cancellingId}
                formatDate={formatDate}
                formatTime={formatTime}
                getDaysUntil={getDaysUntil}
                urgency="normal"
              />
            ))}
          </div>
        </div>
      )}

      {categorized.later.length > 0 && (
        <div>
          <div className="flex items-center gap-2.5 mb-2">
            <div className="w-7 h-7 bg-slate-100 rounded-lg flex items-center justify-center">
              <FaCalendarAlt className="text-slate-600" />
            </div>
            <h2 className="text-lg font-bold text-slate-900">
              Later{" "}
              <span className="text-slate-600">
                ({categorized.later.length})
              </span>
            </h2>
          </div>
          <div className="space-y-3">
            {categorized.later.map((email) => (
              <ScheduledEmailCard
                key={email.id}
                email={email}
                onSend={onSend}
                onPreview={onPreview}
                onEdit={onEdit}
                onCancel={onCancel}
                sendingId={sendingId}
                cancellingId={cancellingId}
                formatDate={formatDate}
                formatTime={formatTime}
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
  const [pendingFollowUps, setPendingFollowUps] = useState<FollowUp[]>([]);
  const [sentFollowUps, setSentFollowUps] = useState<FollowUp[]>([]);
  const [loading, setLoading] = useState(true);
  const [sendingId, setSendingId] = useState<string | null>(null);
  const [markingId, setMarkingId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"pending" | "sent" | "scheduled">(
    "pending",
  );
  const [scheduledEmails, setScheduledEmails] =
    useState<CategorizedScheduledEmails>({
      overdue: [],
      today: [],
      thisWeek: [],
      later: [],
    });
  const [sendingScheduledId, setSendingScheduledId] = useState<string | null>(
    null,
  );
  const [cancellingId, setCancellingId] = useState<string | null>(null);
  const [isSendingAll, setIsSendingAll] = useState(false);
  const [sendAllProgress, setSendAllProgress] = useState({
    sent: 0,
    total: 0,
    failed: 0,
  });
  const [previewModal, setPreviewModal] = useState({
    isOpen: false,
    emailHtml: "",
    emailSubject: "",
    recipientEmail: "",
  });
  const [editModal, setEditModal] = useState<{
    isOpen: boolean;
    email: ScheduledEmail | null;
  }>({ isOpen: false, email: null });

  useEffect(() => {
    fetchFollowUps();
    fetchScheduledEmails();
  }, []);

  const fetchFollowUps = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/follow-ups");
      const data = await response.json();
      setPendingFollowUps(data.pendingFollowUps || []);
      setSentFollowUps(data.sentFollowUps || []);
    } catch (error) {
      console.error("Error fetching follow-ups:", error);
      toast.error("Failed to load follow-ups");
    } finally {
      setLoading(false);
    }
  };

  const fetchScheduledEmails = async () => {
    try {
      const response = await fetch("/api/scheduled-emails");
      const data = await response.json();
      setScheduledEmails(data);
    } catch (error) {
      console.error("Error fetching scheduled emails:", error);
      toast.error("Failed to load scheduled emails");
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

    pendingFollowUps.forEach((followUp) => {
      if (!followUp.followUpScheduledFor) return;

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
        setPendingFollowUps(
          pendingFollowUps.filter((f) => f.id !== followUp.id),
        );
        fetchFollowUps();
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

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
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
        setPendingFollowUps(
          pendingFollowUps.filter((f) => f.id !== followUp.id),
        );
        fetchFollowUps();
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

  const handleSendScheduledEmail = async (email: ScheduledEmail) => {
    setSendingScheduledId(email.id);
    try {
      const response = await fetch("/api/send-scheduled-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          scheduledEmailId: email.id,
        }),
      });

      if (response.ok) {
        toast.success("Email sent successfully!");
        fetchScheduledEmails();
      } else {
        toast.error("Failed to send email");
      }
    } catch (error) {
      console.error("Error sending scheduled email:", error);
      toast.error("Failed to send email");
    } finally {
      setSendingScheduledId(null);
    }
  };

  const handleSendAllScheduled = async () => {
    const allEmails = [
      ...scheduledEmails.overdue,
      ...scheduledEmails.today,
      ...scheduledEmails.thisWeek,
      ...scheduledEmails.later,
    ];

    if (allEmails.length === 0) return;

    const confirmed = window.confirm(
      `Send all ${allEmails.length} scheduled emails? They will be sent with a 3-second delay between each to avoid rate limiting.`,
    );
    if (!confirmed) return;

    setIsSendingAll(true);
    setSendAllProgress({ sent: 0, total: allEmails.length, failed: 0 });

    let sent = 0;
    let failed = 0;

    for (let i = 0; i < allEmails.length; i++) {
      const email = allEmails[i];
      setSendingScheduledId(email.id);

      try {
        const response = await fetch("/api/send-scheduled-email", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ scheduledEmailId: email.id }),
        });

        if (response.ok) {
          sent++;
          toast.success(
            `Sent ${sent}/${allEmails.length}: ${email.recipient.name}`,
          );
        } else {
          failed++;
          toast.error(`Failed: ${email.recipient.name}`);
        }
      } catch (error) {
        console.error(`Error sending to ${email.recipient.email}:`, error);
        failed++;
        toast.error(`Failed: ${email.recipient.name}`);
      }

      setSendAllProgress({ sent, total: allEmails.length, failed });

      // Rate limit: wait 3 seconds between emails (skip delay after last one)
      if (i < allEmails.length - 1) {
        await new Promise((resolve) => setTimeout(resolve, 3000));
      }
    }

    setSendingScheduledId(null);
    setIsSendingAll(false);

    if (failed === 0) {
      toast.success(`All ${sent} emails sent successfully!`);
    } else {
      toast.error(`Done: ${sent} sent, ${failed} failed`);
    }

    fetchScheduledEmails();
  };

  const handlePreviewScheduledEmail = (email: ScheduledEmail) => {
    setPreviewModal({
      isOpen: true,
      emailHtml: email.htmlBody,
      emailSubject: email.subject,
      recipientEmail: email.recipient.email,
    });
  };

  const handleCancelScheduledEmail = async (email: ScheduledEmail) => {
    setCancellingId(email.id);
    try {
      const response = await fetch("/api/update-scheduled-email", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: email.id,
          cancel: true,
        }),
      });

      if (response.ok) {
        toast.success("Scheduled email cancelled");
        fetchScheduledEmails();
      } else {
        toast.error("Failed to cancel scheduled email");
      }
    } catch (error) {
      console.error("Error cancelling scheduled email:", error);
      toast.error("Failed to cancel scheduled email");
    } finally {
      setCancellingId(null);
    }
  };

  const handleEditScheduledEmail = (email: ScheduledEmail) => {
    setEditModal({ isOpen: true, email });
  };

  const handleSaveScheduledEmail = async (data: {
    id: string;
    recipientName: string;
    recipientEmail: string;
    companyName: string;
    jobPosition: string;
    scheduledFor: string;
  }) => {
    try {
      const response = await fetch("/api/update-scheduled-email", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: data.id,
          recipientName: data.recipientName,
          recipientEmail: data.recipientEmail,
          companyName: data.companyName,
          jobPosition: data.jobPosition,
          scheduledFor: data.scheduledFor,
        }),
      });

      if (response.ok) {
        toast.success("Scheduled email updated!");
        fetchScheduledEmails();
      } else {
        toast.error("Failed to update scheduled email");
      }
    } catch (error) {
      console.error("Error updating scheduled email:", error);
      toast.error("Failed to update scheduled email");
    }
  };

  const totalPending = pendingFollowUps.length;
  const totalSent = sentFollowUps.length;
  const totalScheduled =
    scheduledEmails.overdue.length +
    scheduledEmails.today.length +
    scheduledEmails.thisWeek.length +
    scheduledEmails.later.length;

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
      <div className="min-h-screen bg-slate-50 p-4">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            {/* Header */}
            <div className="bg-slate-900 px-6 py-4 border-b border-slate-800">
              <div className="flex items-center justify-between mb-3">
                <Link
                  href="/"
                  className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-all"
                >
                  <FaArrowLeft /> Back
                </Link>
              </div>
              <h1 className="text-2xl font-bold text-white mb-1">
                Follow-Up Manager
              </h1>
              <p className="text-sm text-slate-400">
                Track and manage your email follow-ups
              </p>
            </div>

            {/* Tabs */}
            <div className="border-b border-slate-200 bg-slate-50">
              <div className="flex">
                <button
                  onClick={() => setActiveTab("pending")}
                  className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 font-semibold transition-all relative ${
                    activeTab === "pending"
                      ? "text-slate-900 bg-white"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                  }`}
                >
                  <FaInbox />
                  <span>Pending</span>
                  {totalPending > 0 && (
                    <span className="bg-slate-900 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                      {totalPending}
                    </span>
                  )}
                  {activeTab === "pending" && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-slate-900" />
                  )}
                </button>
                <button
                  onClick={() => setActiveTab("scheduled")}
                  className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 font-semibold transition-all relative ${
                    activeTab === "scheduled"
                      ? "text-slate-900 bg-white"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                  }`}
                >
                  <FaClock />
                  <span>Scheduled</span>
                  {totalScheduled > 0 && (
                    <span className="bg-blue-600 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                      {totalScheduled}
                    </span>
                  )}
                  {activeTab === "scheduled" && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-slate-900" />
                  )}
                </button>
                <button
                  onClick={() => setActiveTab("sent")}
                  className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 font-semibold transition-all relative ${
                    activeTab === "sent"
                      ? "text-slate-900 bg-white"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                  }`}
                >
                  <FaCheckCircle />
                  <span>Sent</span>
                  {totalSent > 0 && (
                    <span className="bg-emerald-600 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                      {totalSent}
                    </span>
                  )}
                  {activeTab === "sent" && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-slate-900" />
                  )}
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-4">
              {loading ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <FaClock className="animate-spin text-4xl text-slate-400 mb-3" />
                  <p className="text-slate-600 font-medium">
                    Loading follow-ups...
                  </p>
                </div>
              ) : activeTab === "pending" ? (
                pendingFollowUps.length === 0 ? (
                  <div className="text-center py-12">
                    <FaCheckCircle className="mx-auto text-5xl text-emerald-500 mb-3" />
                    <p className="text-slate-900 text-lg font-bold mb-1">
                      All caught up!
                    </p>
                    <p className="text-sm text-slate-500">
                      No pending follow-ups at the moment
                    </p>
                  </div>
                ) : (
                  <PendingFollowUpSections
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
                )
              ) : activeTab === "scheduled" ? (
                totalScheduled === 0 ? (
                  <div className="text-center py-12">
                    <FaClock className="mx-auto text-5xl text-slate-300 mb-3" />
                    <p className="text-slate-900 text-lg font-bold mb-1">
                      No scheduled emails
                    </p>
                    <p className="text-sm text-slate-500">
                      Emails you schedule will appear here
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {/* Send All Button & Progress */}
                    <div className="flex items-center justify-between">
                      <button
                        onClick={handleSendAllScheduled}
                        disabled={isSendingAll}
                        className={`flex items-center gap-2 px-5 py-2.5 rounded-lg font-semibold text-sm transition-all ${
                          isSendingAll
                            ? "bg-slate-200 text-slate-500 cursor-not-allowed"
                            : "bg-slate-900 text-white hover:bg-slate-800 hover:shadow-md"
                        }`}
                      >
                        <FaPaperPlane />
                        {isSendingAll
                          ? `Sending ${sendAllProgress.sent + sendAllProgress.failed}/${sendAllProgress.total}...`
                          : `Send All (${totalScheduled})`}
                      </button>
                      {isSendingAll && (
                        <span className="text-xs text-slate-500">
                          ~
                          {(sendAllProgress.total -
                            sendAllProgress.sent -
                            sendAllProgress.failed) *
                            3}{" "}
                          sec remaining
                        </span>
                      )}
                    </div>
                    {isSendingAll && (
                      <div className="space-y-1.5">
                        <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all duration-500 bg-emerald-500"
                            style={{
                              width: `${((sendAllProgress.sent + sendAllProgress.failed) / sendAllProgress.total) * 100}%`,
                            }}
                          />
                        </div>
                        <div className="flex justify-between text-xs text-slate-500">
                          <span>
                            {sendAllProgress.sent} sent
                            {sendAllProgress.failed > 0
                              ? `, ${sendAllProgress.failed} failed`
                              : ""}
                          </span>
                          <span>
                            {sendAllProgress.total -
                              sendAllProgress.sent -
                              sendAllProgress.failed}{" "}
                            remaining
                          </span>
                        </div>
                      </div>
                    )}
                    <ScheduledEmailSections
                      categorized={scheduledEmails}
                      onSend={handleSendScheduledEmail}
                      onPreview={handlePreviewScheduledEmail}
                      onEdit={handleEditScheduledEmail}
                      onCancel={handleCancelScheduledEmail}
                      sendingId={sendingScheduledId}
                      cancellingId={cancellingId}
                      formatDate={formatDate}
                      formatTime={formatTime}
                      getDaysUntil={getDaysUntil}
                    />
                  </div>
                )
              ) : sentFollowUps.length === 0 ? (
                <div className="text-center py-12">
                  <FaHistory className="mx-auto text-5xl text-slate-300 mb-3" />
                  <p className="text-slate-900 text-lg font-bold mb-1">
                    No sent follow-ups yet
                  </p>
                  <p className="text-sm text-slate-500">
                    Follow-ups you send will appear here
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {sentFollowUps.map((followUp) => (
                    <SentFollowUpCard key={followUp.id} followUp={followUp} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <EditScheduledEmailModal
        isOpen={editModal.isOpen}
        onClose={() => setEditModal({ isOpen: false, email: null })}
        email={editModal.email}
        onSave={handleSaveScheduledEmail}
      />
    </>
  );
}
