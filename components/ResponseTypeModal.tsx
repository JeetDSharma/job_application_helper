"use client";
import React, { useState } from "react";
import { FaTimes, FaCheckCircle } from "react-icons/fa";
import { RESPONSE_TYPES, RESPONSE_CATEGORIES } from "@/lib/constants";

type ResponseTypeModalProps = {
  isOpen: boolean;
  onClose: () => void;
  emailLog: {
    id: string;
    recipientName: string;
    companyName: string;
    responseType: string | null;
  };
  onUpdate: () => void;
};

export default function ResponseTypeModal({
  isOpen,
  onClose,
  emailLog,
  onUpdate,
}: ResponseTypeModalProps) {
  const [responseType, setResponseType] = useState(emailLog.responseType || "");
  const [responseDate, setResponseDate] = useState(
    new Date().toISOString().split("T")[0],
  );
  const [saving, setSaving] = useState(false);

  if (!isOpen) return null;

  const handleSave = async () => {
    setSaving(true);
    try {
      await fetch("/api/update-email-log", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          emailLogId: emailLog.id,
          responseReceived: true,
          responseDate: new Date(responseDate).toISOString(),
          responseType,
        }),
      });
      onUpdate();
      onClose();
    } catch (error) {
      console.error("Error updating response type:", error);
    } finally {
      setSaving(false);
    }
  };

  const getCategoryColor = (type: string) => {
    for (const [, category] of Object.entries(RESPONSE_CATEGORIES)) {
      if (category.types.some((t: string) => t === type)) {
        return category.color;
      }
    }
    return "gray";
  };

  const colorClasses = {
    green: "bg-green-50 border-green-300 text-green-800",
    yellow: "bg-yellow-50 border-yellow-300 text-yellow-800",
    red: "bg-red-50 border-red-300 text-red-800",
    gray: "bg-gray-50 border-gray-300 text-gray-800",
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-lg w-full p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <FaCheckCircle className="text-green-600" />
            Update Response Status
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition"
          >
            <FaTimes size={20} />
          </button>
        </div>

        <div className="mb-4 p-3 bg-blue-50 rounded-md">
          <p className="text-sm text-blue-800">
            <strong>Contact:</strong> {emailLog.recipientName} at{" "}
            {emailLog.companyName}
          </p>
        </div>

        <div className="space-y-4">
          {/* Response Type Selector */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Response Type *
            </label>
            <select
              value={responseType}
              onChange={(e) => setResponseType(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">Select response type...</option>
              {Object.entries(RESPONSE_CATEGORIES).map(([key, category]) => (
                <optgroup
                  key={key}
                  label={`${category.icon} ${category.label}`}
                >
                  {category.types.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>
          </div>

          {/* Response Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Response Date
            </label>
            <input
              type="date"
              value={responseDate}
              onChange={(e) => setResponseDate(e.target.value)}
              max={new Date().toISOString().split("T")[0]}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Preview */}
          {responseType && (
            <div
              className={`p-3 rounded-md border ${
                colorClasses[
                  getCategoryColor(responseType) as keyof typeof colorClasses
                ]
              }`}
            >
              <p className="text-sm font-medium">Selected: {responseType}</p>
            </div>
          )}
        </div>

        <div className="flex gap-3 mt-6">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 font-medium transition"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving || !responseType}
            className={`flex-1 px-4 py-2 rounded-md font-medium transition ${
              saving || !responseType
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-green-600 text-white hover:bg-green-700"
            }`}
          >
            {saving ? "Saving..." : "Save Response"}
          </button>
        </div>
      </div>
    </div>
  );
}
