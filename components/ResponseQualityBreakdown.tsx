"use client";
import React from "react";
import {
  FaThumbsUp,
  FaThumbsDown,
  FaExclamation,
  FaInfoCircle,
} from "react-icons/fa";

type ResponseQualityBreakdownProps = {
  breakdown: {
    positive: number;
    neutral: number;
    negative: number;
    special: number;
    unspecified: number;
  };
  topTypes: Array<{
    type: string;
    count: number;
  }>;
};

export default function ResponseQualityBreakdown({
  breakdown,
  topTypes,
}: ResponseQualityBreakdownProps) {
  const total = Object.values(breakdown).reduce((a, b) => a + b, 0);

  const categories = [
    {
      key: "positive",
      label: "Positive",
      value: breakdown.positive,
      icon: <FaThumbsUp />,
      color: "bg-green-500",
      textColor: "text-green-700",
      bgLight: "bg-green-50",
    },
    {
      key: "neutral",
      label: "Neutral",
      value: breakdown.neutral,
      icon: <FaExclamation />,
      color: "bg-yellow-500",
      textColor: "text-yellow-700",
      bgLight: "bg-yellow-50",
    },
    {
      key: "negative",
      label: "Negative/No Response",
      value: breakdown.negative,
      icon: <FaThumbsDown />,
      color: "bg-red-500",
      textColor: "text-red-700",
      bgLight: "bg-red-50",
    },
    {
      key: "special",
      label: "Special",
      value: breakdown.special,
      icon: <FaInfoCircle />,
      color: "bg-gray-500",
      textColor: "text-gray-700",
      bgLight: "bg-gray-50",
    },
  ];

  const getPercentage = (value: number) => {
    if (total === 0) return "0";
    return ((value / total) * 100).toFixed(1);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
        <FaThumbsUp className="text-indigo-600" />
        Response Quality Breakdown
      </h3>

      {total === 0 ? (
        <p className="text-gray-500 text-center py-8">No response data yet</p>
      ) : (
        <>
          {/* Horizontal Stacked Bar */}
          <div className="mb-6">
            <div className="flex h-8 rounded-lg overflow-hidden">
              {categories.map(
                (cat) =>
                  cat.value > 0 && (
                    <div
                      key={cat.key}
                      className={`${cat.color} flex items-center justify-center`}
                      style={{ width: `${getPercentage(cat.value)}%` }}
                      title={`${cat.label}: ${cat.value} (${getPercentage(cat.value)}%)`}
                    >
                      {parseFloat(getPercentage(cat.value)) > 10 && (
                        <span className="text-white text-xs font-bold">
                          {getPercentage(cat.value)}%
                        </span>
                      )}
                    </div>
                  ),
              )}
            </div>
          </div>

          {/* Category Cards */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            {categories.map((cat) => (
              <div
                key={cat.key}
                className={`${cat.bgLight} border border-gray-200 rounded-lg p-3`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div
                      className={`${cat.color} text-white p-1.5 rounded text-sm`}
                    >
                      {cat.icon}
                    </div>
                    <span className="text-xs font-medium text-gray-700">
                      {cat.label}
                    </span>
                  </div>
                  <div className="text-right">
                    <div className={`text-lg font-bold ${cat.textColor}`}>
                      {cat.value}
                    </div>
                    <div className="text-xs text-gray-600">
                      {getPercentage(cat.value)}%
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Top Response Types */}
          {topTypes.length > 0 && (
            <div>
              <h4 className="text-sm font-semibold text-gray-700 mb-3">
                Top Response Types
              </h4>
              <div className="space-y-2">
                {topTypes.slice(0, 5).map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-2 bg-gray-50 rounded"
                  >
                    <span className="text-sm text-gray-700">{item.type}</span>
                    <span className="text-sm font-bold text-indigo-600">
                      {item.count}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
