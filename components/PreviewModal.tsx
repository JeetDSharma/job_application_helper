import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  FaTimes,
  FaEdit,
  FaEye,
  FaUndo,
  FaCheck,
  FaSearch,
  FaExchangeAlt,
} from "react-icons/fa";

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
  const [hasUnappliedChanges, setHasUnappliedChanges] = useState(false);
  const [appliedHtml, setAppliedHtml] = useState(
    currentEditedHtml || emailHtml,
  );
  const [showFindReplace, setShowFindReplace] = useState(false);
  const [findText, setFindText] = useState("");
  const [replaceText, setReplaceText] = useState("");
  const [matchCount, setMatchCount] = useState(0);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const lineNumbersRef = useRef<HTMLDivElement>(null);

  // Only reset when a genuinely new email is loaded (emailHtml changes).
  // Reading currentEditedHtml here for initial restore, but NOT depending on it —
  // otherwise Apply → onHtmlChange → currentEditedHtml change would re-trigger
  // this effect and reset appliedHtml/isEditMode back to defaults.
  useEffect(() => {
    const html =
      currentEditedHtml && currentEditedHtml.trim() !== ""
        ? currentEditedHtml
        : emailHtml;
    setEditedHtml(html);
    setAppliedHtml(html);
    setHasUnappliedChanges(false);
    setIsEditMode(false);
    setShowFindReplace(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [emailHtml]);

  useEffect(() => {
    if (findText) {
      try {
        const regex = new RegExp(
          findText.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
          "gi",
        );
        const matches = editedHtml.match(regex);
        setMatchCount(matches ? matches.length : 0);
      } catch {
        setMatchCount(0);
      }
    } else {
      setMatchCount(0);
    }
  }, [findText, editedHtml]);

  const handleHtmlChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newHtml = e.target.value;
    setEditedHtml(newHtml);
    setHasUnappliedChanges(newHtml !== appliedHtml);
  };

  const handleApply = useCallback(() => {
    setAppliedHtml(editedHtml);
    setHasUnappliedChanges(false);
    if (onHtmlChange) {
      onHtmlChange(editedHtml);
    }
  }, [editedHtml, onHtmlChange]);

  const handleReset = () => {
    setEditedHtml(emailHtml);
    setAppliedHtml(emailHtml);
    setHasUnappliedChanges(false);
    if (onHtmlChange) {
      onHtmlChange(emailHtml);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Tab support
    if (e.key === "Tab") {
      e.preventDefault();
      const textarea = textareaRef.current;
      if (!textarea) return;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;

      if (e.shiftKey) {
        // Outdent: remove leading tab/spaces from selected lines
        const before = editedHtml.substring(0, start);
        const selected = editedHtml.substring(start, end);
        const after = editedHtml.substring(end);
        const lineStart = before.lastIndexOf("\n") + 1;
        const prefix = editedHtml.substring(lineStart, start);
        const fullSelected = prefix + selected;
        const outdented = fullSelected.replace(/^  /gm, "");
        const diff = fullSelected.length - outdented.length;
        const newHtml = editedHtml.substring(0, lineStart) + outdented + after;
        setEditedHtml(newHtml);
        setHasUnappliedChanges(newHtml !== appliedHtml);
        requestAnimationFrame(() => {
          textarea.selectionStart = Math.max(
            lineStart,
            start - (diff > 0 ? 2 : 0),
          );
          textarea.selectionEnd = end - diff;
        });
      } else if (start !== end) {
        // Indent selected lines
        const before = editedHtml.substring(0, start);
        const selected = editedHtml.substring(start, end);
        const after = editedHtml.substring(end);
        const lineStart = before.lastIndexOf("\n") + 1;
        const prefix = editedHtml.substring(lineStart, start);
        const fullSelected = prefix + selected;
        const indented = fullSelected.replace(/^/gm, "  ");
        const diff = indented.length - fullSelected.length;
        const newHtml = editedHtml.substring(0, lineStart) + indented + after;
        setEditedHtml(newHtml);
        setHasUnappliedChanges(newHtml !== appliedHtml);
        requestAnimationFrame(() => {
          textarea.selectionStart = start + 2;
          textarea.selectionEnd = end + diff;
        });
      } else {
        // Insert 2 spaces at cursor
        const newHtml =
          editedHtml.substring(0, start) + "  " + editedHtml.substring(end);
        setEditedHtml(newHtml);
        setHasUnappliedChanges(newHtml !== appliedHtml);
        requestAnimationFrame(() => {
          textarea.selectionStart = textarea.selectionEnd = start + 2;
        });
      }
    }

    // Ctrl/Cmd+S to apply
    if ((e.metaKey || e.ctrlKey) && e.key === "s") {
      e.preventDefault();
      handleApply();
    }

    // Ctrl/Cmd+F to find
    if ((e.metaKey || e.ctrlKey) && e.key === "f") {
      e.preventDefault();
      setShowFindReplace(true);
    }

    // Escape to close find
    if (e.key === "Escape" && showFindReplace) {
      setShowFindReplace(false);
    }
  };

  const handleFindReplace = () => {
    if (!findText) return;
    const escaped = findText.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const regex = new RegExp(escaped, "g");
    const newHtml = editedHtml.replace(regex, replaceText);
    setEditedHtml(newHtml);
    setHasUnappliedChanges(newHtml !== appliedHtml);
    setFindText("");
    setReplaceText("");
  };

  const handleFindReplaceOne = () => {
    if (!findText) return;
    const escaped = findText.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const regex = new RegExp(escaped);
    const newHtml = editedHtml.replace(regex, replaceText);
    if (newHtml !== editedHtml) {
      setEditedHtml(newHtml);
      setHasUnappliedChanges(newHtml !== appliedHtml);
    }
  };

  const syncScroll = () => {
    if (textareaRef.current && lineNumbersRef.current) {
      lineNumbersRef.current.scrollTop = textareaRef.current.scrollTop;
    }
  };

  const toggleEditMode = () => {
    if (isEditMode && hasUnappliedChanges) {
      handleApply();
    }
    setIsEditMode(!isEditMode);
    setShowFindReplace(false);
  };

  const lineCount = editedHtml.split("\n").length;

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
            {isEditMode && (
              <>
                {hasUnappliedChanges && (
                  <button
                    onClick={handleApply}
                    className="flex items-center gap-2 px-3 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 font-medium transition"
                    title="Apply changes (Cmd+S)"
                  >
                    <FaCheck /> Apply
                  </button>
                )}
                <button
                  onClick={() => setShowFindReplace(!showFindReplace)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-md font-medium transition ${
                    showFindReplace
                      ? "bg-indigo-500 text-white hover:bg-indigo-600"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                  title="Find & Replace (Cmd+F)"
                >
                  <FaSearch />
                </button>
              </>
            )}
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

        {/* Find & Replace Bar */}
        {isEditMode && showFindReplace && (
          <div className="px-4 py-2 bg-slate-50 border-b border-gray-200 flex items-center gap-2 flex-wrap">
            <div className="flex items-center gap-1.5">
              <FaSearch className="text-slate-400 text-xs" />
              <input
                type="text"
                value={findText}
                onChange={(e) => setFindText(e.target.value)}
                placeholder="Find..."
                className="px-2 py-1 text-sm border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 w-48"
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleFindReplaceOne();
                  if (e.key === "Escape") setShowFindReplace(false);
                }}
                autoFocus
              />
              {findText && (
                <span className="text-xs text-slate-500 font-medium">
                  {matchCount} match{matchCount !== 1 ? "es" : ""}
                </span>
              )}
            </div>
            <div className="flex items-center gap-1.5">
              <FaExchangeAlt className="text-slate-400 text-xs" />
              <input
                type="text"
                value={replaceText}
                onChange={(e) => setReplaceText(e.target.value)}
                placeholder="Replace..."
                className="px-2 py-1 text-sm border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 w-48"
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleFindReplaceOne();
                  if (e.key === "Escape") setShowFindReplace(false);
                }}
              />
            </div>
            <button
              onClick={handleFindReplaceOne}
              disabled={!findText || matchCount === 0}
              className="px-2.5 py-1 text-xs font-medium bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-slate-200 disabled:text-slate-400 transition"
            >
              Replace
            </button>
            <button
              onClick={handleFindReplace}
              disabled={!findText || matchCount === 0}
              className="px-2.5 py-1 text-xs font-medium bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-slate-200 disabled:text-slate-400 transition"
            >
              Replace All
            </button>
          </div>
        )}

        {/* Split View Content */}
        <div className="flex-1 overflow-hidden flex">
          {isEditMode ? (
            <>
              {/* HTML Editor with Line Numbers */}
              <div className="w-1/2 flex flex-col border-r border-gray-200">
                <div className="p-2.5 bg-slate-800 border-b border-slate-700 flex items-center justify-between">
                  <h3 className="text-xs font-semibold text-slate-300 uppercase tracking-wide">
                    HTML Source
                  </h3>
                  <div className="flex items-center gap-3 text-xs text-slate-400">
                    <span>{lineCount} lines</span>
                    <span>{editedHtml.length} chars</span>
                    {hasUnappliedChanges && (
                      <span className="text-amber-400 font-medium">
                        unsaved
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex-1 flex overflow-hidden bg-slate-900">
                  {/* Line numbers */}
                  <div
                    ref={lineNumbersRef}
                    className="overflow-hidden select-none py-3 pl-2 pr-3 text-right bg-slate-800 border-r border-slate-700"
                    style={{ minWidth: "3.5rem" }}
                  >
                    {Array.from({ length: lineCount }, (_, i) => (
                      <div
                        key={i}
                        className="text-slate-500 text-xs leading-5 font-mono"
                      >
                        {i + 1}
                      </div>
                    ))}
                  </div>
                  {/* Textarea */}
                  <textarea
                    ref={textareaRef}
                    value={editedHtml}
                    onChange={handleHtmlChange}
                    onKeyDown={handleKeyDown}
                    onScroll={syncScroll}
                    className="flex-1 py-3 px-3 font-mono text-sm text-slate-100 bg-slate-900 resize-none focus:outline-none overflow-auto caret-blue-400"
                    style={{ lineHeight: "1.25rem", tabSize: 2 }}
                    spellCheck={false}
                    autoCapitalize="off"
                    autoCorrect="off"
                  />
                </div>
              </div>

              {/* Live Preview */}
              <div className="w-1/2 flex flex-col">
                <div className="p-2.5 bg-gray-100 border-b border-gray-200">
                  <h3 className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                    Live Preview
                  </h3>
                </div>
                <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
                  <div className="bg-white rounded-lg shadow-sm p-6">
                    <div
                      dangerouslySetInnerHTML={{
                        __html: hasUnappliedChanges ? editedHtml : appliedHtml,
                      }}
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
                  dangerouslySetInnerHTML={{ __html: appliedHtml }}
                  className="email-preview-content"
                />
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 flex justify-between items-center">
          <div className="text-sm text-gray-600">
            {isEditMode && hasUnappliedChanges && (
              <span className="text-amber-600 font-medium">
                Unsaved changes — click Apply or press Cmd+S
              </span>
            )}
            {isEditMode &&
              !hasUnappliedChanges &&
              appliedHtml !== emailHtml && (
                <span className="text-emerald-600 font-medium">
                  Changes applied — will be used for this send only
                </span>
              )}
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-400">
            {isEditMode && (
              <span>Tab to indent · Cmd+S apply · Cmd+F find</span>
            )}
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-md text-gray-700 font-medium transition ml-2"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
