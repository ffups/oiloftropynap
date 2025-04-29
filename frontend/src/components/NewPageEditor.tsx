import LivePreview from "@/components/LivePreview";
import RichTextEditor from "@/components/RichTextEditor";

export default function NewPageEditor({
  title,
  slug,
  content,
  onTitleChange,
  onSlugChange,
  onContentChange,
  onAdd,
}: {
  title: string;
  slug: string;
  content: string;
  onTitleChange: (v: string) => void;
  onSlugChange: (v: string) => void;
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
      <input
        value={slug}
        onChange={e => onSlugChange(e.target.value)}
        placeholder="Slug (e.g. about, contact)"
        style={{ marginLeft: 8 }}
      />
      <RichTextEditor value={content} onChange={onContentChange} />
      <button onClick={onAdd}>Add Page</button>
      <LivePreview html={content} />
    </div>
  );
}