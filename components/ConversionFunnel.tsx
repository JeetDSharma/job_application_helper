"use client";
import React from "react";
import { FaEnvelope, FaReply, FaThumbsUp, FaCalendarAlt } from "react-icons/fa";

type FunnelStage = {
  label: string;
  value: number;
  icon: React.ReactNode;
  color: string;
};

type ConversionFunnelProps = {
  data: {
    emailsSent: number;
    responsesReceived: number;
    positiveResponses: number;
    interviews: number;
  };
};

export default function ConversionFunnel({ data }: ConversionFunnelProps) {
  const stages: FunnelStage[] = [
    {
      label: "Emails Sent",
      value: data.emailsSent,
      icon: <FaEnvelope />,
      color: "bg-blue-500",
    },
    {
      label: "Responses",
      value: data.responsesReceived,
      icon: <FaReply />,
      color: "bg-green-500",
    },
    {
      label: "Positive",
      value: data.positiveResponses,
      icon: <FaThumbsUp />,
      color: "bg-indigo-500",
    },
    {
      label: "Interviews",
      value: data.interviews,
      icon: <FaCalendarAlt />,
      color: "bg-purple-500",
    },
  ];

  const maxValue = data.emailsSent || 1;

  const getConversionRate = (current: number, previous: number) => {
    if (previous === 0) return "0";
    return ((current / previous) * 100).toFixed(1);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-800 mb-6 flex items-center gap-2">
        <FaCalendarAlt className="text-indigo-600" />
        Conversion Funnel
      </h3>
      <div className="space-y-6">
        {stages.map((stage, idx) => {
          const widthPercent = (stage.value / maxValue) * 100;
          const prevValue = idx > 0 ? stages[idx - 1].value : stage.value;
          const conversionRate = getConversionRate(stage.value, prevValue);

          return (
            <div key={idx} className="relative">
              {/* Stage Header */}
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className={`${stage.color} text-white p-2 rounded`}>
                    {stage.icon}
                  </div>
                  <span className="font-medium text-gray-800">
                    {stage.label}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-2xl font-bold text-gray-900">
                    {stage.value}
                  </span>
                  {idx > 0 && (
                    <span className="ml-2 text-sm text-gray-600">
                      ({conversionRate}%)
                    </span>
                  )}
                </div>
              </div>

              {/* Funnel Bar */}
              <div className="relative">
                <div className="w-full bg-gray-100 rounded-lg h-12 overflow-hidden">
                  <div
                    className={`${stage.color} h-full rounded-lg transition-all duration-500 flex items-center justify-center`}
                    style={{ width: `${widthPercent}%` }}
                  >
                    {widthPercent > 15 && (
                      <span className="text-white text-xs font-bold">
                        {stage.value} {stage.label.toLowerCase()}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Conversion Arrow */}
              {idx < stages.length - 1 && (
                <div className="flex justify-center my-1">
                  <svg
                    className="w-6 h-6 text-gray-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 3a1 1 0 011 1v10.586l2.293-2.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 14.586V4a1 1 0 011-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Summary Stats */}
      <div className="mt-6 p-4 bg-indigo-50 rounded-lg border border-indigo-200">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-600">Response Rate:</span>{" "}
            <span className="font-bold text-indigo-700">
              {getConversionRate(data.responsesReceived, data.emailsSent)}%
            </span>
          </div>
          <div>
            <span className="text-gray-600">Interview Rate:</span>{" "}
            <span className="font-bold text-purple-700">
              {getConversionRate(data.interviews, data.emailsSent)}%
            </span>
          </div>
          <div>
            <span className="text-gray-600">Positive Response Rate:</span>{" "}
            <span className="font-bold text-green-700">
              {getConversionRate(
                data.positiveResponses,
                data.responsesReceived,
              )}
              %
            </span>
          </div>
          <div>
            <span className="text-gray-600">Interview Conversion:</span>{" "}
            <span className="font-bold text-purple-700">
              {getConversionRate(data.interviews, data.positiveResponses)}%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
