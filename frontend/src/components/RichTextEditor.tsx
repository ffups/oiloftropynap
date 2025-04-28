import { useRef } from "react";

export default function RichTextEditor({ value, onChange }: { value: string; onChange: (html: string) => void }) {
  const editorRef = useRef<HTMLDivElement>(null);

  const exec = (command: string, value?: string) => {
    document.execCommand(command, false, value);
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  return (
    <div>
      <div style={{ marginBottom: 8 }}>
        <button type="button" onClick={() => exec("bold")}>Bold</button>
        <button type="button" onClick={() => exec("italic")}>Italic</button>
        <button type="button" onClick={() => exec("underline")}>Underline</button>
        <button type="button" onClick={() => exec("formatBlock", "H1")}>H1</button>
        <button type="button" onClick={() => exec("formatBlock", "H2")}>H2</button>
        {/* Add more buttons for features you want */}
      </div>
      <div
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        style={{ border: "1px solid #ccc", minHeight: 40, padding: 8 }}
        dangerouslySetInnerHTML={{ __html: value }}
        onInput={e => onChange((e.target as HTMLDivElement).innerHTML)}
      />
    </div>
  );
}