"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  FaCheckCircle,
  FaTimesCircle,
  FaClock,
  FaFilter,
  FaArrowLeft,
  FaGraduationCap,
  FaBuilding,
  FaEnvelope,
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
  });

  useEffect(() => {
    fetchEmailLogs();
  }, [statusFilter, companyFilter]);

  const fetchEmailLogs = async () => {
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

      setStats({ total, sent, failed, pending });
    } catch (error) {
      console.error("Error fetching email logs:", error);
    } finally {
      setLoading(false);
    }
  };

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
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Emails</p>
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
                      Sent At
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
                      <td className="px-4 py-4 text-gray-600 text-sm">
                        {new Date(log.sentAt).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
