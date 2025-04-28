import LivePreview from "@/components/LivePreview";
import RichTextEditor from "@/components/RichTextEditor";

export default function NewPageEditor({
  title,
  content,
  onTitleChange,
  onContentChange,
  onAdd,
}: {
  title: string;
  content: string;
  onTitleChange: (v: string) => void;
  onContentChange: (v: string) => void;
  onAdd: () => void;
}) {
  return (
    <div>
      <h2>Add New Page</h2>
      <input
        value={title}
        onChange={e => onTitleChange(e.target.value)}
        placeholder="Title"
      />
      <RichTextEditor value={content} onChange={onContentChange} />
      <button onClick={onAdd}>Add Page</button>
      <LivePreview html={content} />
    </div>
  );
}