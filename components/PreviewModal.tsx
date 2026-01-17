import React from "react";
import { FaTimes } from "react-icons/fa";

type PreviewModalProps = {
  isOpen: boolean;
  onClose: () => void;
  emailHtml: string;
  emailSubject: string;
  recipientEmail: string;
};

export default function PreviewModal({
  isOpen,
  onClose,
  emailHtml,
  emailSubject,
  recipientEmail,
}: PreviewModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex-1">
            <h2 className="text-xl font-semibold text-gray-800">
              Email Preview
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              <span className="font-medium">To:</span> {recipientEmail}
            </p>
            <p className="text-sm text-gray-600">
              <span className="font-medium">Subject:</span> {emailSubject}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition"
            aria-label="Close preview"
          >
            <FaTimes className="text-gray-600 text-xl" />
          </button>
        </div>

        {/* Email Content */}
        <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div
              dangerouslySetInnerHTML={{ __html: emailHtml }}
              className="email-preview-content"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-md text-gray-700 font-medium transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
