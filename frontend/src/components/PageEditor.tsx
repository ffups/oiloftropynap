import RichTextEditor from "@/components/RichTextEditor";

export default function PageEditor({
  value,
  onChange,
  onSave,
  onCancel,
}: {
  value: string;
  onChange: (v: string) => void;
  onSave: () => void;
  onCancel: () => void;
}) {
  return (
    <div>
      <RichTextEditor value={value} onChange={onChange} />
      <button onClick={onSave}>Save</button>
      <button onClick={onCancel}>Cancel</button>
      <div style={{ marginTop: 12, border: "1px solid #eee", padding: 8 }}>
        <strong>Live Preview:</strong>
        <div dangerouslySetInnerHTML={{ __html: value }} />
      </div>
    </div>
  );
}