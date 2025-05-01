export type Block =
  | { id: string; type: "text"; data: { text: string } }
  | { id: string; type: "image"; data: { url: string; alt?: string } };
// Add more block types as needed

export type Section = { id: string; name: string; blocks: Block[] };