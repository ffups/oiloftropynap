import TextBlock from "./TextBlock";
import ImageBlock from "./ImageBlock";

// Define block types
type Block =
  | { id: string; type: "text"; data: { text: string } }
  | { id: string; type: "image"; data: { url: string; alt?: string } };

// Registry type
type BlockRenderer = (block: any) => JSX.Element;

// Registry
export const blockRegistry: Record<string, BlockRenderer> = {
  text: (block: { id: string; data: { text: string } }) => <TextBlock key={block.id} {...block.data} />,
  image: (block: { id: string; data: { url: string; alt?: string } }) => <ImageBlock key={block.id} {...block.data} />,
};