import { useRef, useEffect, useState } from "react";
import {
  Bold,
  Italic,
  Underline,
  List,
  ListOrdered,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Undo,
  Redo,
  Type,
  Highlighter,
  Palette,
  Link,
  Strikethrough,
} from "lucide-react";

interface RichTextEditorProps {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
  minHeight?: string;
}

const COLORS = [
  "#000000", "#e60000", "#ff9900", "#ffff00", "#008a00", "#0066cc", "#9933ff",
  "#ffffff", "#facccc", "#ffebcc", "#ffffcc", "#cce8cc", "#cce0f5", "#ebd6ff",
  "#bbbbbb", "#f06666", "#ffc266", "#ffff66", "#66b966", "#66a3e0", "#c285ff",
  "#888888", "#a10000", "#b26b00", "#b2b200", "#006100", "#0047b2", "#6b24b2",
  "#444444", "#5c0000", "#663d00", "#666600", "#003700", "#002966", "#3d1466",
  "#e26e93", "#f9a8c9", "#fce4ec",
];

const FONT_SIZES = [
  { label: "Small", value: "1" },
  { label: "Normal", value: "3" },
  { label: "Large", value: "5" },
  { label: "Huge", value: "7" },
];

function ToolbarButton({
  onClick,
  icon: Icon,
  title,
  active = false,
}: {
  onClick: () => void;
  icon: React.ComponentType<{ size?: number }>;
  title: string;
  active?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      className={`p-1.5 rounded-lg transition-colors ${
        active
          ? "bg-primary-pink/10 text-primary-pink"
          : "hover:bg-slate-100 text-slate-500"
      }`}
    >
      <Icon size={14} />
    </button>
  );
}

export default function RichTextEditor({
  value,
  onChange,
  placeholder = "Enter text…",
  minHeight = "180px",
}: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const [showTextColor, setShowTextColor] = useState(false);
  const [showBgColor, setShowBgColor] = useState(false);
  const [showFontSize, setShowFontSize] = useState(false);

  useEffect(() => {
    if (editorRef.current && value !== editorRef.current.innerHTML) {
      editorRef.current.innerHTML = value || "";
    }
  }, []);

  const handleInput = () => {
    if (onChange && editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  const execCommand = (command: string, val?: string) => {
    document.execCommand(command, false, val);
    editorRef.current?.focus();
    handleInput();
  };

  const closeAll = () => {
    setShowTextColor(false);
    setShowBgColor(false);
    setShowFontSize(false);
  };

  const handleLink = () => {
    const url = prompt("Enter URL:");
    if (url) execCommand("createLink", url);
  };

  return (
    <div className="border border-slate-200 rounded-xl overflow-visible bg-white">
      {/* Toolbar */}
      <div className="flex items-center flex-wrap gap-0.5 p-2 border-b border-slate-200 bg-slate-50/80">

        {/* Formatting */}
        <ToolbarButton onClick={() => execCommand("bold")} icon={Bold} title="Bold" />
        <ToolbarButton onClick={() => execCommand("italic")} icon={Italic} title="Italic" />
        <ToolbarButton onClick={() => execCommand("underline")} icon={Underline} title="Underline" />
        <ToolbarButton onClick={() => execCommand("strikeThrough")} icon={Strikethrough} title="Strikethrough" />

        <div className="w-px h-5 bg-slate-200 mx-1" />

        {/* Font Size */}
        <div className="relative">
          <ToolbarButton
            onClick={() => { setShowFontSize(!showFontSize); setShowTextColor(false); setShowBgColor(false); }}
            icon={Type}
            title="Font Size"
          />
          {showFontSize && (
            <div className="absolute top-full left-0 mt-1 bg-white border border-slate-200 rounded-xl shadow-lg z-50 py-1 min-w-[110px]">
              {FONT_SIZES.map((s) => (
                <button
                  key={s.value}
                  type="button"
                  onClick={() => { execCommand("fontSize", s.value); setShowFontSize(false); }}
                  className="w-full text-left px-3 py-1.5 hover:bg-slate-50 text-slate-700 text-sm"
                >
                  {s.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Text Color */}
        <div className="relative">
          <ToolbarButton
            onClick={() => { setShowTextColor(!showTextColor); setShowBgColor(false); setShowFontSize(false); }}
            icon={Palette}
            title="Text Color"
          />
          {showTextColor && (
            <div className="absolute top-full left-0 mt-1 bg-white border border-slate-200 rounded-xl shadow-lg z-50 p-2 grid grid-cols-7 gap-1">
              {COLORS.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => { execCommand("foreColor", c); setShowTextColor(false); }}
                  className="w-5 h-5 rounded border border-slate-300 hover:scale-110 transition-transform"
                  style={{ backgroundColor: c }}
                  title={c}
                />
              ))}
            </div>
          )}
        </div>

        {/* Highlight Color */}
        <div className="relative">
          <ToolbarButton
            onClick={() => { setShowBgColor(!showBgColor); setShowTextColor(false); setShowFontSize(false); }}
            icon={Highlighter}
            title="Highlight Color"
          />
          {showBgColor && (
            <div className="absolute top-full left-0 mt-1 bg-white border border-slate-200 rounded-xl shadow-lg z-50 p-2 grid grid-cols-7 gap-1">
              {COLORS.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => { execCommand("hiliteColor", c); setShowBgColor(false); }}
                  className="w-5 h-5 rounded border border-slate-300 hover:scale-110 transition-transform"
                  style={{ backgroundColor: c }}
                  title={c}
                />
              ))}
            </div>
          )}
        </div>

        <div className="w-px h-5 bg-slate-200 mx-1" />

        {/* Lists */}
        <ToolbarButton onClick={() => execCommand("insertUnorderedList")} icon={List} title="Bullet List" />
        <ToolbarButton onClick={() => execCommand("insertOrderedList")} icon={ListOrdered} title="Numbered List" />

        <div className="w-px h-5 bg-slate-200 mx-1" />

        {/* Alignment */}
        <ToolbarButton onClick={() => execCommand("justifyLeft")} icon={AlignLeft} title="Align Left" />
        <ToolbarButton onClick={() => execCommand("justifyCenter")} icon={AlignCenter} title="Align Center" />
        <ToolbarButton onClick={() => execCommand("justifyRight")} icon={AlignRight} title="Align Right" />
        <ToolbarButton onClick={() => execCommand("justifyFull")} icon={AlignJustify} title="Justify" />

        <div className="w-px h-5 bg-slate-200 mx-1" />

        {/* Link */}
        <ToolbarButton onClick={handleLink} icon={Link} title="Insert Link" />

        <div className="w-px h-5 bg-slate-200 mx-1" />

        {/* Undo / Redo */}
        <ToolbarButton onClick={() => execCommand("undo")} icon={Undo} title="Undo" />
        <ToolbarButton onClick={() => execCommand("redo")} icon={Redo} title="Redo" />
      </div>

      {/* Editable area */}
      <div
        ref={editorRef}
        contentEditable
        onInput={handleInput}
        onBlur={handleInput}
        onClick={closeAll}
        style={{ minHeight }}
        className="p-4 outline-none text-sm text-slate-700 focus:ring-2 focus:ring-primary-pink/20 overflow-y-auto rich-editor"
        data-placeholder={placeholder}
        suppressContentEditableWarning
      />

      <style>{`
        [contenteditable][data-placeholder]:empty:before {
          content: attr(data-placeholder);
          color: #cbd5e1;
          pointer-events: none;
          display: block;
        }
        .rich-editor ul { list-style: disc; padding-left: 1.5rem; margin: 0.5rem 0; }
        .rich-editor ol { list-style: decimal; padding-left: 1.5rem; margin: 0.5rem 0; }
        .rich-editor a { color: #e26e93; text-decoration: underline; }
        .rich-editor b, .rich-editor strong { font-weight: 700; }
        .rich-editor i, .rich-editor em { font-style: italic; }
      `}</style>
    </div>
  );
}
