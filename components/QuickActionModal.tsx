"use client";
import React, { useState } from "react";
import { FaTimes, FaCheckCircle, FaClock, FaStickyNote } from "react-icons/fa";
import { RESPONSE_TYPES, RESPONSE_CATEGORIES } from "@/lib/constants";

type QuickActionModalProps = {
  isOpen: boolean;
  onClose: () => void;
  emailLogId: string;
  recipientName: string;
  companyName: string;
  onUpdate: () => void;
};

export default function QuickActionModal({
  isOpen,
  onClose,
  emailLogId,
  recipientName,
  companyName,
  onUpdate,
}: QuickActionModalProps) {
  const [responseReceived, setResponseReceived] = useState(false);
  const [responseType, setResponseType] = useState("");
  const [notes, setNotes] = useState("");
  const [followUpDays, setFollowUpDays] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);

  if (!isOpen) return null;

  const handleSave = async () => {
    setSaving(true);
    try {
      const updateData: any = { emailLogId };

      if (responseReceived) {
        updateData.responseReceived = true;
        updateData.responseDate = new Date().toISOString();
        if (responseType) {
          updateData.responseType = responseType;
        }
      }

      if (notes.trim()) {
        updateData.notes = notes;
      }

      if (followUpDays) {
        const followUpDate = new Date();
        followUpDate.setDate(followUpDate.getDate() + followUpDays);
        updateData.followUpScheduled = followUpDate.toISOString();
      }

      await fetch("/api/update-email-log", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updateData),
      });

      onUpdate();
      onClose();
    } catch (error) {
      console.error("Error saving quick action:", error);
    } finally {
      setSaving(false);
    }
  };

  const handleSkip = () => {
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-lg w-full p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <FaCheckCircle className="text-green-600" />
            Email Sent Successfully!
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
            <strong>To:</strong> {recipientName} at {companyName}
          </p>
        </div>

        <div className="space-y-4">
          {/* Response Received Toggle */}
          <div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={responseReceived}
                onChange={(e) => setResponseReceived(e.target.checked)}
                className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
              />
              <span className="text-sm font-medium text-gray-700">
                Already received a response?
              </span>
            </label>
          </div>

          {/* Response Type Selector */}
          {responseReceived && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Response Type
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
          )}

          {/* Quick Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <FaStickyNote className="inline mr-1" /> Quick Notes (Optional)
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add any notes about this contact..."
              rows={3}
              maxLength={500}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <p className="text-xs text-gray-500 mt-1">
              {notes.length}/500 characters
            </p>
          </div>

          {/* Follow-up Reminder */}
          {!responseReceived && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <FaClock className="inline mr-1" /> Set Follow-up Reminder
              </label>
              <div className="grid grid-cols-4 gap-2">
                {[3, 7, 14, 30].map((days) => (
                  <button
                    key={days}
                    onClick={() =>
                      setFollowUpDays(followUpDays === days ? null : days)
                    }
                    className={`px-3 py-2 rounded-md text-sm font-medium transition ${
                      followUpDays === days
                        ? "bg-indigo-600 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {days}d
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="flex gap-3 mt-6">
          <button
            onClick={handleSkip}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 font-medium transition"
          >
            Skip for Now
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className={`flex-1 px-4 py-2 rounded-md font-medium transition ${
              saving
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-indigo-600 text-white hover:bg-indigo-700"
            }`}
          >
            {saving ? "Saving..." : "Save & Continue"}
          </button>
        </div>
      </div>
    </div>
  );
}
