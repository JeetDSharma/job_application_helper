"use client";
import React, { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import toast, { Toaster } from "react-hot-toast";
import {
  FaCheckCircle,
  FaTimesCircle,
  FaClock,
  FaFilter,
  FaArrowLeft,
  FaGraduationCap,
  FaBuilding,
  FaEnvelope,
  FaExclamationTriangle,
  FaStickyNote,
  FaReply,
  FaBell,
  FaEdit,
  FaPaperPlane,
} from "react-icons/fa";

type EmailLog = {
  id: string;
  sentAt: string;
  status: string;
  jobPosition: string;
  recipientName: string;
  recipientEmail: string;
  companyName: string;
  isAlumni: boolean;
  errorMessage: string | null;
  templateUsed: string | null;
  isMarkedWrong: boolean;
  markedAt: string | null;
  notes: string | null;
  responseReceived: boolean;
  responseDate: string | null;
  responseType: string | null;
  followUpScheduled: string | null;
  followUpCount: number;
  lastFollowUpDate: string | null;
};

export default function EmailHistoryPage() {
  const [emailLogs, setEmailLogs] = useState<EmailLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [companyFilter, setCompanyFilter] = useState("");
  const [stats, setStats] = useState({
    total: 0,
    sent: 0,
    failed: 0,
    pending: 0,
    markedWrong: 0,
    responses: 0,
    needsFollowUp: 0,
  });
  const [selectedEmail, setSelectedEmail] = useState<EmailLog | null>(null);
  const [showNotesModal, setShowNotesModal] = useState(false);
  const [editingNotes, setEditingNotes] = useState("");
  const [showFollowUpModal, setShowFollowUpModal] = useState(false);
  const [followUpDate, setFollowUpDate] = useState("");
  const [sendingFollowUp, setSendingFollowUp] = useState<string | null>(null);

  const fetchEmailLogs = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (statusFilter !== "ALL") params.append("status", statusFilter);
      if (companyFilter) params.append("company", companyFilter);

      const response = await fetch(
        `/api/fetch-email-logs?${params.toString()}`,
      );
      const data = await response.json();
      setEmailLogs(data);

      // Calculate stats
      const total = data.length;
      const sent = data.filter((log: EmailLog) => log.status === "SENT").length;
      const failed = data.filter(
        (log: EmailLog) => log.status === "FAILED",
      ).length;
      const pending = data.filter(
        (log: EmailLog) => log.status === "PENDING",
      ).length;
      const markedWrong = data.filter(
        (log: EmailLog) => log.isMarkedWrong,
      ).length;
      const responses = data.filter(
        (log: EmailLog) => log.responseReceived,
      ).length;
      const needsFollowUp = data.filter(
        (log: EmailLog) =>
          log.followUpScheduled &&
          new Date(log.followUpScheduled) <= new Date(),
      ).length;

      setStats({
        total,
        sent,
        failed,
        pending,
        markedWrong,
        responses,
        needsFollowUp,
      });
    } catch (error) {
      console.error("Error fetching email logs:", error);
    } finally {
      setLoading(false);
    }
  }, [statusFilter, companyFilter]);

  useEffect(() => {
    fetchEmailLogs();
  }, [fetchEmailLogs]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "SENT":
        return <FaCheckCircle className="text-green-600" />;
      case "FAILED":
        return <FaTimesCircle className="text-red-600" />;
      case "PENDING":
        return <FaClock className="text-yellow-600" />;
      default:
        return <FaClock className="text-gray-600" />;
    }
  };

  const handleMarkWrong = async (
    emailLogId: string,
    currentStatus: boolean,
  ) => {
    try {
      await fetch("/api/update-email-log", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          emailLogId,
          isMarkedWrong: !currentStatus,
        }),
      });
      fetchEmailLogs();
    } catch (error) {
      console.error("Error marking email:", error);
    }
  };

  const handleSaveNotes = async () => {
    if (!selectedEmail) return;
    try {
      await fetch("/api/update-email-log", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          emailLogId: selectedEmail.id,
          notes: editingNotes,
        }),
      });
      setShowNotesModal(false);
      setSelectedEmail(null);
      setEditingNotes("");
      fetchEmailLogs();
    } catch (error) {
      console.error("Error saving notes:", error);
    }
  };

  const handleToggleResponse = async (
    emailLogId: string,
    currentStatus: boolean,
  ) => {
    try {
      await fetch("/api/update-email-log", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          emailLogId,
          responseReceived: !currentStatus,
          responseDate: !currentStatus ? new Date().toISOString() : null,
        }),
      });
      fetchEmailLogs();
    } catch (error) {
      console.error("Error updating response:", error);
    }
  };

  const handleScheduleFollowUp = async () => {
    if (!selectedEmail || !followUpDate) return;
    try {
      await fetch("/api/update-email-log", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          emailLogId: selectedEmail.id,
          followUpScheduled: followUpDate,
        }),
      });
      setShowFollowUpModal(false);
      setSelectedEmail(null);
      setFollowUpDate("");
      fetchEmailLogs();
    } catch (error) {
      console.error("Error scheduling follow-up:", error);
    }
  };

  const handleCompleteFollowUp = async (emailLogId: string) => {
    try {
      await fetch("/api/update-email-log", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          emailLogId,
          followUpScheduled: null,
        }),
      });
      fetchEmailLogs();
    } catch (error) {
      console.error("Error completing follow-up:", error);
    }
  };

  const isFollowUpOverdue = (scheduledDate: string | null) => {
    if (!scheduledDate) return false;
    return new Date(scheduledDate) <= new Date();
  };

  const handleSendFollowUp = async (log: EmailLog) => {
    setSendingFollowUp(log.id);
    try {
      const response = await fetch("/api/send-email", {
        headers: { Accept: "application/json" },
        method: "POST",
        body: JSON.stringify({
          email: log.recipientEmail,
          name: log.recipientName,
          company: log.companyName,
          jobPosition: log.jobPosition,
          isAlum: log.isAlumni,
          isRecruiter: log.templateUsed === "RECRUITER",
          isFollowUp: true,
        }),
      });

      if (response.ok) {
        toast.success("Follow-up email sent!");
        // Mark follow-up as completed
        await fetch("/api/update-email-log", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            emailLogId: log.id,
            followUpScheduled: null,
          }),
        });
        fetchEmailLogs();
      } else {
        toast.error("Failed to send follow-up email");
      }
    } catch (error) {
      console.error("Error sending follow-up:", error);
      toast.error("Failed to send follow-up email");
    } finally {
      setSendingFollowUp(null);
    }
  };

  const getStatusBadge = (status: string) => {
    const baseClasses = "px-2 py-1 rounded-full text-xs font-medium";
    switch (status) {
      case "SENT":
        return `${baseClasses} bg-green-100 text-green-800`;
      case "FAILED":
        return `${baseClasses} bg-red-100 text-red-800`;
      case "PENDING":
        return `${baseClasses} bg-yellow-100 text-yellow-800`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800`;
    }
  };

  return (
    <>
      <Toaster position="top-right" />
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-6">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-800 mb-4"
            >
              <FaArrowLeft /> Back to Send Email
            </Link>
            <h1 className="text-3xl font-bold text-gray-800">Email History</h1>
            <p className="text-gray-600 mt-1">
              Track all your sent emails and their status
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 mb-6">
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total</p>
                  <p className="text-2xl font-bold text-gray-800">
                    {stats.total}
                  </p>
                </div>
                <FaEnvelope className="text-3xl text-gray-400" />
              </div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Sent</p>
                  <p className="text-2xl font-bold text-green-600">
                    {stats.sent}
                  </p>
                </div>
                <FaCheckCircle className="text-3xl text-green-400" />
              </div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Failed</p>
                  <p className="text-2xl font-bold text-red-600">
                    {stats.failed}
                  </p>
                </div>
                <FaTimesCircle className="text-3xl text-red-400" />
              </div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Pending</p>
                  <p className="text-2xl font-bold text-yellow-600">
                    {stats.pending}
                  </p>
                </div>
                <FaClock className="text-3xl text-yellow-400" />
              </div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm border border-orange-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Marked</p>
                  <p className="text-2xl font-bold text-orange-600">
                    {stats.markedWrong}
                  </p>
                </div>
                <FaExclamationTriangle className="text-3xl text-orange-400" />
              </div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm border border-blue-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Responses</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {stats.responses}
                  </p>
                </div>
                <FaReply className="text-3xl text-blue-400" />
              </div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm border border-purple-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Follow-up</p>
                  <p className="text-2xl font-bold text-purple-600">
                    {stats.needsFollowUp}
                  </p>
                </div>
                <FaBell className="text-3xl text-purple-400" />
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-6">
            <div className="flex items-center gap-2 mb-3">
              <FaFilter className="text-gray-600" />
              <h2 className="text-lg font-semibold text-gray-800">Filters</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring focus:ring-indigo-500"
                >
                  <option value="ALL">All Status</option>
                  <option value="SENT">Sent</option>
                  <option value="FAILED">Failed</option>
                  <option value="PENDING">Pending</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Company
                </label>
                <input
                  type="text"
                  value={companyFilter}
                  onChange={(e) => setCompanyFilter(e.target.value)}
                  placeholder="Filter by company name..."
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring focus:ring-indigo-500"
                />
              </div>
            </div>
          </div>

          {/* Email Logs Table */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            {loading ? (
              <div className="p-12 text-center text-gray-500">
                <FaClock className="animate-spin text-4xl mx-auto mb-2" />
                <p>Loading email history...</p>
              </div>
            ) : emailLogs.length === 0 ? (
              <div className="p-12 text-center text-gray-500">
                <FaEnvelope className="text-4xl mx-auto mb-2 text-gray-300" />
                <p className="text-lg font-medium">No emails found</p>
                <p className="text-sm">
                  Try adjusting your filters or send your first email
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                        Recipient
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                        Company
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                        Position
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                        Template
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                        Sent At
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {emailLogs.map((log) => (
                      <tr key={log.id} className="hover:bg-gray-50 transition">
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            {getStatusIcon(log.status)}
                            <span className={getStatusBadge(log.status)}>
                              {log.status}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex flex-col">
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-gray-800">
                                {log.recipientName}
                              </span>
                              {log.isAlumni && (
                                <FaGraduationCap
                                  className="text-indigo-600"
                                  title="Alumni"
                                />
                              )}
                            </div>
                            <span className="text-sm text-gray-600">
                              {log.recipientEmail}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-2">
                            <FaBuilding className="text-gray-400" />
                            <span className="text-gray-800">
                              {log.companyName}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-4 text-gray-800">
                          {log.jobPosition}
                        </td>
                        <td className="px-4 py-4">
                          <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                            {log.templateUsed || "N/A"}
                          </span>
                        </td>
                        <td className="px-4 py-4 text-gray-600 text-sm">
                          <div className="flex flex-col gap-1">
                            <span>{new Date(log.sentAt).toLocaleString()}</span>
                            {log.isMarkedWrong && (
                              <span className="flex items-center gap-1 text-xs text-orange-600">
                                <FaExclamationTriangle /> Marked Wrong
                              </span>
                            )}
                            {log.responseReceived && (
                              <span className="flex items-center gap-1 text-xs text-blue-600">
                                <FaReply /> Response Received
                              </span>
                            )}
                            {log.notes && (
                              <span className="flex items-center gap-1 text-xs text-gray-600">
                                <FaStickyNote /> Has Notes
                              </span>
                            )}
                            {log.followUpScheduled && (
                              <span
                                className={`flex items-center gap-1 text-xs ${
                                  isFollowUpOverdue(log.followUpScheduled)
                                    ? "text-red-600 font-semibold"
                                    : "text-purple-600"
                                }`}
                              >
                                <FaBell /> Follow-up{" "}
                                {isFollowUpOverdue(log.followUpScheduled)
                                  ? "DUE"
                                  : "scheduled"}
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex gap-2">
                            <button
                              onClick={() =>
                                handleMarkWrong(log.id, log.isMarkedWrong)
                              }
                              className={`p-2 rounded transition ${
                                log.isMarkedWrong
                                  ? "bg-orange-100 text-orange-600 hover:bg-orange-200"
                                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                              }`}
                              title={
                                log.isMarkedWrong
                                  ? "Unmark as wrong"
                                  : "Mark as wrong"
                              }
                            >
                              <FaExclamationTriangle />
                            </button>
                            <button
                              onClick={() => {
                                setSelectedEmail(log);
                                setEditingNotes(log.notes || "");
                                setShowNotesModal(true);
                              }}
                              className="p-2 rounded bg-gray-100 text-gray-600 hover:bg-gray-200 transition"
                              title="Add/Edit notes"
                            >
                              <FaEdit />
                            </button>
                            <button
                              onClick={() =>
                                handleToggleResponse(
                                  log.id,
                                  log.responseReceived,
                                )
                              }
                              className={`p-2 rounded transition ${
                                log.responseReceived
                                  ? "bg-blue-100 text-blue-600 hover:bg-blue-200"
                                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                              }`}
                              title={
                                log.responseReceived
                                  ? "Mark no response"
                                  : "Mark response received"
                              }
                            >
                              <FaReply />
                            </button>
                            {log.followUpScheduled ? (
                              isFollowUpOverdue(log.followUpScheduled) ? (
                                <button
                                  onClick={() => handleSendFollowUp(log)}
                                  disabled={sendingFollowUp === log.id}
                                  className="p-2 rounded transition bg-green-500 text-white hover:bg-green-600 disabled:opacity-50"
                                  title="Send follow-up email now"
                                >
                                  {sendingFollowUp === log.id ? (
                                    <FaClock className="animate-spin" />
                                  ) : (
                                    <FaPaperPlane />
                                  )}
                                </button>
                              ) : (
                                <button
                                  onClick={() => handleCompleteFollowUp(log.id)}
                                  className="p-2 rounded transition bg-purple-100 text-purple-600 hover:bg-purple-200"
                                  title="Cancel scheduled follow-up"
                                >
                                  <FaBell />
                                </button>
                              )
                            ) : (
                              <button
                                onClick={() => {
                                  setSelectedEmail(log);
                                  setShowFollowUpModal(true);
                                }}
                                className="p-2 rounded bg-gray-100 text-gray-600 hover:bg-gray-200 transition"
                                title="Schedule follow-up"
                              >
                                <FaBell />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Follow-up Scheduling Modal */}
          {showFollowUpModal && selectedEmail && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
              <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-800">
                    Schedule Follow-up
                  </h3>
                  <button
                    onClick={() => {
                      setShowFollowUpModal(false);
                      setSelectedEmail(null);
                      setFollowUpDate("");
                    }}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <FaTimesCircle className="text-xl" />
                  </button>
                </div>
                <div className="mb-4">
                  <p className="text-sm text-gray-600 mb-4">
                    <strong>{selectedEmail.recipientName}</strong> at{" "}
                    <strong>{selectedEmail.companyName}</strong>
                  </p>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Follow-up Date & Time
                  </label>
                  <input
                    type="datetime-local"
                    value={followUpDate}
                    onChange={(e) => setFollowUpDate(e.target.value)}
                    className="w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    min={new Date().toISOString().slice(0, 16)}
                  />
                  <p className="text-xs text-gray-500 mt-2">
                    You&apos;ll see this email in the &quot;Follow-up&quot;
                    count when the date arrives
                  </p>
                </div>
                <div className="flex gap-3 justify-end">
                  <button
                    onClick={() => {
                      setShowFollowUpModal(false);
                      setSelectedEmail(null);
                      setFollowUpDate("");
                    }}
                    className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-md text-gray-700 font-medium transition"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleScheduleFollowUp}
                    disabled={!followUpDate}
                    className={`px-4 py-2 rounded-md font-medium transition ${
                      followUpDate
                        ? "bg-purple-500 hover:bg-purple-600 text-white"
                        : "bg-gray-300 text-gray-500 cursor-not-allowed"
                    }`}
                  >
                    Schedule
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Notes Modal */}
          {showNotesModal && selectedEmail && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
              <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-800">
                    Edit Notes
                  </h3>
                  <button
                    onClick={() => {
                      setShowNotesModal(false);
                      setSelectedEmail(null);
                      setEditingNotes("");
                    }}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <FaTimesCircle className="text-xl" />
                  </button>
                </div>
                <div className="mb-4">
                  <p className="text-sm text-gray-600 mb-2">
                    <strong>{selectedEmail.recipientName}</strong> at{" "}
                    <strong>{selectedEmail.companyName}</strong>
                  </p>
                  <textarea
                    value={editingNotes}
                    onChange={(e) => setEditingNotes(e.target.value)}
                    className="w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    rows={5}
                    placeholder="Add notes about this email (e.g., wrong person, typo in subject, test email, etc.)"
                  />
                </div>
                <div className="flex gap-3 justify-end">
                  <button
                    onClick={() => {
                      setShowNotesModal(false);
                      setSelectedEmail(null);
                      setEditingNotes("");
                    }}
                    className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-md text-gray-700 font-medium transition"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveNotes}
                    className="px-4 py-2 bg-indigo-500 hover:bg-indigo-600 rounded-md text-white font-medium transition"
                  >
                    Save Notes
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
