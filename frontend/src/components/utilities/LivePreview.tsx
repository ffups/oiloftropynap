export default function LivePreview({ html }: { html: string }) {
  return (
    <div style={{ marginTop: 12, border: "1px solid #eee", padding: 8 }}>
      <strong>Live Preview:</strong>
      <div dangerouslySetInnerHTML={{ __html: html }} />
    </div>
  );
}