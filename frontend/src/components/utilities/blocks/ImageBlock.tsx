export default function ImageBlock({ url, alt }: { url: string; alt?: string }) {
  return <img src={url} alt={alt || ""} style={{ maxWidth: "100%" }} />;
}