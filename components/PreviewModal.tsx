import React, { useState, useEffect } from "react";
import { FaTimes, FaEdit, FaEye, FaUndo } from "react-icons/fa";

type PreviewModalProps = {
  isOpen: boolean;
  onClose: () => void;
  emailHtml: string;
  emailSubject: string;
  recipientEmail: string;
  onHtmlChange?: (html: string) => void;
  currentEditedHtml?: string;
};

export default function PreviewModal({
  isOpen,
  onClose,
  emailHtml,
  emailSubject,
  recipientEmail,
  onHtmlChange,
  currentEditedHtml,
}: PreviewModalProps) {
  const [isEditMode, setIsEditMode] = useState(false);
  const [editedHtml, setEditedHtml] = useState(currentEditedHtml || emailHtml);

  useEffect(() => {
    // Use currentEditedHtml if it exists and has content, otherwise use emailHtml
    setEditedHtml(
      currentEditedHtml && currentEditedHtml.trim() !== ""
        ? currentEditedHtml
        : emailHtml,
    );
    setIsEditMode(false);
  }, [emailHtml, currentEditedHtml]);

  const handleHtmlChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newHtml = e.target.value;
    setEditedHtml(newHtml);
    if (onHtmlChange) {
      onHtmlChange(newHtml);
    }
  };

  const handleReset = () => {
    setEditedHtml(emailHtml);
    if (onHtmlChange) {
      onHtmlChange(emailHtml);
    }
  };

  const toggleEditMode = () => {
    setIsEditMode(!isEditMode);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-7xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex-1">
            <h2 className="text-xl font-semibold text-gray-800">
              Email Preview {isEditMode && "(Edit Mode)"}
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              <span className="font-medium">To:</span> {recipientEmail}
            </p>
            <p className="text-sm text-gray-600">
              <span className="font-medium">Subject:</span> {emailSubject}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={toggleEditMode}
              className={`flex items-center gap-2 px-3 py-2 rounded-md font-medium transition ${
                isEditMode
                  ? "bg-blue-500 text-white hover:bg-blue-600"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              {isEditMode ? (
                <>
                  <FaEye /> Preview
                </>
              ) : (
                <>
                  <FaEdit /> Edit HTML
                </>
              )}
            </button>
            {isEditMode && editedHtml !== emailHtml && (
              <button
                onClick={handleReset}
                className="flex items-center gap-2 px-3 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 font-medium transition"
                title="Reset to original"
              >
                <FaUndo /> Reset
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition"
              aria-label="Close preview"
            >
              <FaTimes className="text-gray-600 text-xl" />
            </button>
          </div>
        </div>

        {/* Split View Content */}
        <div className="flex-1 overflow-hidden flex">
          {isEditMode ? (
            <>
              {/* HTML Editor */}
              <div className="w-1/2 flex flex-col border-r border-gray-200">
                <div className="p-3 bg-gray-100 border-b border-gray-200">
                  <h3 className="text-sm font-semibold text-gray-700">
                    HTML Source
                  </h3>
                </div>
                <textarea
                  value={editedHtml}
                  onChange={handleHtmlChange}
                  className="flex-1 p-4 font-mono text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 overflow-auto"
                  spellCheck={false}
                />
              </div>

              {/* Live Preview */}
              <div className="w-1/2 flex flex-col">
                <div className="p-3 bg-gray-100 border-b border-gray-200">
                  <h3 className="text-sm font-semibold text-gray-700">
                    Live Preview
                  </h3>
                </div>
                <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
                  <div className="bg-white rounded-lg shadow-sm p-6">
                    <div
                      dangerouslySetInnerHTML={{ __html: editedHtml }}
                      className="email-preview-content"
                    />
                  </div>
                </div>
              </div>
            </>
          ) : (
            /* Full Preview */
            <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
              <div className="bg-white rounded-lg shadow-sm p-6 max-w-4xl mx-auto">
                <div
                  dangerouslySetInnerHTML={{ __html: editedHtml }}
                  className="email-preview-content"
                />
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 flex justify-between items-center">
          <div className="text-sm text-gray-600">
            {isEditMode && editedHtml !== emailHtml && (
              <span className="text-orange-600 font-medium">
                ⚠ Changes are temporary and will be used for this send only
              </span>
            )}
          </div>
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
