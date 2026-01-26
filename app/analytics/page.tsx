"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  FaArrowLeft,
  FaEnvelope,
  FaCheckCircle,
  FaTimesCircle,
  FaReply,
  FaChartLine,
  FaBuilding,
  FaClock,
  FaGraduationCap,
  FaTrophy,
  FaCalendarAlt,
} from "react-icons/fa";

type AnalyticsData = {
  overview: {
    totalEmails: number;
    sentEmails: number;
    failedEmails: number;
    responseCount: number;
    responseRate: string;
  };
  templateStats: Array<{
    name: string;
    total: number;
    sent: number;
    responses: number;
    failed: number;
    responseRate: string;
  }>;
  topCompanies: Array<{
    company: string;
    total: number;
    sent: number;
    responses: number;
    failed: number;
    responseRate: string;
  }>;
  timelineData: Array<{
    date: string;
    sent: number;
    responses: number;
    failed: number;
  }>;
  dayOfWeekData: Array<{
    day: string;
    sent: number;
    responses: number;
    responseRate: string;
  }>;
  hourData: Array<{
    hour: number;
    sent: number;
    responses: number;
    responseRate: string;
  }>;
  alumniStats: {
    alumni: {
      sent: number;
      responses: number;
      responseRate: string;
    };
    nonAlumni: {
      sent: number;
      responses: number;
      responseRate: string;
    };
  };
};

function StatCard({
  icon,
  label,
  value,
  subtext,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  subtext?: string;
  color: string;
}) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm text-gray-600 mb-1">{label}</p>
          <p className={`text-3xl font-bold ${color}`}>{value}</p>
          {subtext && <p className="text-xs text-gray-500 mt-1">{subtext}</p>}
        </div>
        <div className={`text-4xl ${color} opacity-20`}>{icon}</div>
      </div>
    </div>
  );
}

function BarChart({
  data,
  labelKey,
  valueKey,
  title,
}: {
  data: any[];
  labelKey: string;
  valueKey: string;
  title: string;
}) {
  const maxValue = Math.max(...data.map((d) => d[valueKey]));

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
        <FaChartLine className="text-indigo-600" />
        {title}
      </h3>
      <div className="space-y-3">
        {data.map((item, idx) => (
          <div key={idx} className="flex items-center gap-3">
            <div className="w-24 text-sm text-gray-700 font-medium truncate">
              {item[labelKey]}
            </div>
            <div className="flex-1 bg-gray-100 rounded-full h-8 relative overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-full transition-all duration-500 flex items-center justify-end pr-3"
                style={{
                  width: `${maxValue > 0 ? (item[valueKey] / maxValue) * 100 : 0}%`,
                }}
              >
                <span className="text-white text-xs font-bold">
                  {item[valueKey]}
                </span>
              </div>
            </div>
          </div>
        ))}
        {data.length === 0 && (
          <p className="text-gray-500 text-center py-4">No data available</p>
        )}
      </div>
    </div>
  );
}

function TimelineChart({ data }: { data: any[] }) {
  if (data.length === 0) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <FaCalendarAlt className="text-indigo-600" />
          Email Timeline (Last 30 Days)
        </h3>
        <p className="text-gray-500 text-center py-8">No data available</p>
      </div>
    );
  }

  const maxValue = Math.max(
    ...data.map((d) => d.sent + d.responses + d.failed),
  );

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
        <FaCalendarAlt className="text-indigo-600" />
        Email Timeline (Last 30 Days)
      </h3>
      <div className="flex items-end gap-1 h-48 mb-8">
        {data.map((item, idx) => {
          const total = item.sent + item.responses + item.failed;
          const height = maxValue > 0 ? (total / maxValue) * 100 : 0;
          const date = new Date(item.date);
          const displayDate = `${date.getMonth() + 1}/${date.getDate()}`;
          const showLabel =
            idx === 0 ||
            idx === data.length - 1 ||
            idx % Math.ceil(data.length / 8) === 0;

          return (
            <div
              key={idx}
              className="flex-1 flex flex-col items-center relative"
            >
              <div className="w-full flex flex-col-reverse gap-0.5 items-center">
                {item.sent > 0 && (
                  <div
                    className="w-full bg-green-500 rounded-t"
                    style={{
                      height: `${maxValue > 0 ? (item.sent / maxValue) * 100 * 1.92 : 0}px`,
                    }}
                    title={`${displayDate}: ${item.sent} sent`}
                  />
                )}
                {item.responses > 0 && (
                  <div
                    className="w-full bg-blue-500"
                    style={{
                      height: `${maxValue > 0 ? (item.responses / maxValue) * 100 * 1.92 : 0}px`,
                    }}
                    title={`${displayDate}: ${item.responses} responses`}
                  />
                )}
                {item.failed > 0 && (
                  <div
                    className="w-full bg-red-500"
                    style={{
                      height: `${maxValue > 0 ? (item.failed / maxValue) * 100 * 1.92 : 0}px`,
                    }}
                    title={`${displayDate}: ${item.failed} failed`}
                  />
                )}
              </div>
              {showLabel && (
                <span className="absolute top-full mt-1 text-xs text-gray-600 font-medium whitespace-nowrap">
                  {displayDate}
                </span>
              )}
            </div>
          );
        })}
      </div>
      <div className="flex items-center justify-center gap-6 mt-6 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-green-500 rounded"></div>
          <span className="text-gray-700">Sent</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-blue-500 rounded"></div>
          <span className="text-gray-700">Responses</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-red-500 rounded"></div>
          <span className="text-gray-700">Failed</span>
        </div>
      </div>
    </div>
  );
}

export default function AnalyticsPage() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/analytics");
      const data = await response.json();
      setAnalytics(data);
    } catch (error) {
      console.error("Error fetching analytics:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <FaClock className="animate-spin text-4xl mx-auto mb-2 text-indigo-600" />
          <p className="text-gray-600">Loading analytics...</p>
        </div>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Failed to load analytics</p>
        </div>
      </div>
    );
  }

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
          <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
            <FaChartLine className="text-indigo-600" />
            Email Campaign Analytics
          </h1>
          <p className="text-gray-600 mt-1">
            Insights and performance metrics for your outreach campaigns
          </p>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
          <StatCard
            icon={<FaEnvelope />}
            label="Total Emails"
            value={analytics.overview.totalEmails}
            color="text-gray-800"
          />
          <StatCard
            icon={<FaCheckCircle />}
            label="Sent Successfully"
            value={analytics.overview.sentEmails}
            color="text-green-600"
          />
          <StatCard
            icon={<FaTimesCircle />}
            label="Failed"
            value={analytics.overview.failedEmails}
            color="text-red-600"
          />
          <StatCard
            icon={<FaReply />}
            label="Responses"
            value={analytics.overview.responseCount}
            color="text-blue-600"
          />
          <StatCard
            icon={<FaTrophy />}
            label="Response Rate"
            value={`${analytics.overview.responseRate}%`}
            color="text-indigo-600"
          />
        </div>

        {/* Timeline */}
        <div className="mb-6">
          <TimelineChart data={analytics.timelineData} />
        </div>

        {/* Template & Alumni Performance */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Template Performance */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <FaEnvelope className="text-indigo-600" />
              Template Performance
            </h3>
            <div className="space-y-3">
              {analytics.templateStats.map((template, idx) => (
                <div
                  key={idx}
                  className="border border-gray-200 rounded-lg p-4 hover:border-indigo-300 transition"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold text-gray-800">
                      {template.name}
                    </span>
                    <span className="text-sm font-bold text-indigo-600">
                      {template.responseRate}% response rate
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-sm">
                    <div>
                      <span className="text-gray-600">Sent:</span>{" "}
                      <span className="font-medium text-green-600">
                        {template.sent}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-600">Responses:</span>{" "}
                      <span className="font-medium text-blue-600">
                        {template.responses}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-600">Failed:</span>{" "}
                      <span className="font-medium text-red-600">
                        {template.failed}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
              {analytics.templateStats.length === 0 && (
                <p className="text-gray-500 text-center py-4">
                  No template data available
                </p>
              )}
            </div>
          </div>

          {/* Alumni vs Non-Alumni */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <FaGraduationCap className="text-indigo-600" />
              Alumni vs Non-Alumni Performance
            </h3>
            <div className="space-y-4">
              <div className="border border-indigo-200 bg-indigo-50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <FaGraduationCap className="text-indigo-600" />
                    <span className="font-semibold text-gray-800">
                      Alumni Contacts
                    </span>
                  </div>
                  <span className="text-2xl font-bold text-indigo-600">
                    {analytics.alumniStats.alumni.responseRate}%
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="bg-white rounded p-2">
                    <span className="text-gray-600">Sent:</span>{" "}
                    <span className="font-bold text-green-600">
                      {analytics.alumniStats.alumni.sent}
                    </span>
                  </div>
                  <div className="bg-white rounded p-2">
                    <span className="text-gray-600">Responses:</span>{" "}
                    <span className="font-bold text-blue-600">
                      {analytics.alumniStats.alumni.responses}
                    </span>
                  </div>
                </div>
              </div>

              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <FaBuilding className="text-gray-600" />
                    <span className="font-semibold text-gray-800">
                      Non-Alumni Contacts
                    </span>
                  </div>
                  <span className="text-2xl font-bold text-gray-700">
                    {analytics.alumniStats.nonAlumni.responseRate}%
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="bg-gray-50 rounded p-2">
                    <span className="text-gray-600">Sent:</span>{" "}
                    <span className="font-bold text-green-600">
                      {analytics.alumniStats.nonAlumni.sent}
                    </span>
                  </div>
                  <div className="bg-gray-50 rounded p-2">
                    <span className="text-gray-600">Responses:</span>{" "}
                    <span className="font-bold text-blue-600">
                      {analytics.alumniStats.nonAlumni.responses}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded">
                <p className="text-sm text-blue-800">
                  <strong>Insight:</strong>{" "}
                  {parseFloat(analytics.alumniStats.alumni.responseRate) >
                  parseFloat(analytics.alumniStats.nonAlumni.responseRate)
                    ? "Alumni contacts have a higher response rate! Consider prioritizing alumni outreach."
                    : parseFloat(analytics.alumniStats.alumni.responseRate) <
                        parseFloat(analytics.alumniStats.nonAlumni.responseRate)
                      ? "Non-alumni contacts are performing better. Your general outreach strategy is working well!"
                      : "Both groups have similar response rates. Continue your balanced approach!"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Day of Week & Hour Analysis */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <BarChart
            data={analytics.dayOfWeekData}
            labelKey="day"
            valueKey="sent"
            title="Emails Sent by Day of Week"
          />
          <BarChart
            data={analytics.hourData.slice(0, 10)}
            labelKey="hour"
            valueKey="sent"
            title="Emails Sent by Hour (Top 10)"
          />
        </div>

        {/* Top Companies */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <FaBuilding className="text-indigo-600" />
            Top Companies (by outreach volume)
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase">
                    Rank
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase">
                    Company
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase">
                    Total
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase">
                    Sent
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase">
                    Responses
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase">
                    Response Rate
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {analytics.topCompanies.map((company, idx) => (
                  <tr key={idx} className="hover:bg-gray-50 transition">
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 font-bold text-sm">
                        {idx + 1}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-medium text-gray-800">
                      {company.company}
                    </td>
                    <td className="px-4 py-3 text-gray-700">{company.total}</td>
                    <td className="px-4 py-3 text-green-600 font-medium">
                      {company.sent}
                    </td>
                    <td className="px-4 py-3 text-blue-600 font-medium">
                      {company.responses}
                    </td>
                    <td className="px-4 py-3">
                      <span className="inline-block px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm font-bold">
                        {company.responseRate}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {analytics.topCompanies.length === 0 && (
              <p className="text-gray-500 text-center py-8">
                No company data available
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
