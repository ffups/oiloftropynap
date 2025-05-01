import React, { useState } from "react";

// Block types
type Block =
  | { id: string; type: "text"; data: { text: string } }
  | { id: string; type: "image"; data: { url: string } };

function generateId() {
  return Math.random().toString(36).slice(2, 10);
}

export default function BlockEditor() {
  const [blocks, setBlocks] = useState<Block[]>([]);

  // Add a new block
  const addBlock = (type: Block["type"]) => {
    const newBlock: Block =
      type === "text"
        ? { id: generateId(), type: "text", data: { text: "" } }
        : { id: generateId(), type: "image", data: { url: "" } };
    setBlocks([...blocks, newBlock]);
  };

  // Update a block's data
  const updateBlock = (id: string, data: any) => {
    setBlocks(blocks =>
      blocks.map(block =>
        block.id === id ? { ...block, data: { ...block.data, ...data } } : block
      )
    );
  };

  // Delete a block
  const deleteBlock = (id: string) => {
    setBlocks(blocks => blocks.filter(block => block.id !== id));
  };

  // Move block up or down
  const moveBlock = (id: string, direction: "up" | "down") => {
    const idx = blocks.findIndex(b => b.id === id);
    if (idx < 0) return;
    const newBlocks = [...blocks];
    const swapIdx = direction === "up" ? idx - 1 : idx + 1;
    if (swapIdx < 0 || swapIdx >= blocks.length) return;
    [newBlocks[idx], newBlocks[swapIdx]] = [newBlocks[swapIdx], newBlocks[idx]];
    setBlocks(newBlocks);
  };

  return (
    <div>
      <h3>Block Editor</h3>
      <div style={{ marginBottom: 16 }}>
        <button onClick={() => addBlock("text")}>Add Text Block</button>
        <button onClick={() => addBlock("image")} style={{ marginLeft: 8 }}>
          Add Image Block
        </button>
      </div>
      {blocks.map((block, i) => (
        <div
          key={block.id}
          style={{
            border: "1px solid #ccc",
            padding: 12,
            marginBottom: 12,
            background: "#fafbfc",
          }}
        >
          <div style={{ marginBottom: 8 }}>
            <button onClick={() => moveBlock(block.id, "up")} disabled={i === 0}>
              ↑
            </button>
            <button
              onClick={() => moveBlock(block.id, "down")}
              disabled={i === blocks.length - 1}
              style={{ marginLeft: 4 }}
            >
              ↓
            </button>
            <button
              onClick={() => deleteBlock(block.id)}
              style={{ marginLeft: 8, color: "red" }}
            >
              Delete
            </button>
          </div>
          {block.type === "text" ? (
            <textarea
              value={block.data.text}
              onChange={e => updateBlock(block.id, { text: e.target.value })}
              placeholder="Enter text..."
              style={{ width: "100%", minHeight: 60 }}
            />
          ) : (
            <div>
              <input
                type="text"
                value={block.data.url}
                onChange={e => updateBlock(block.id, { url: e.target.value })}
                placeholder="Image URL"
                style={{ width: "100%" }}
              />
              {block.data.url && (
                <img
                  src={block.data.url}
                  alt=""
                  style={{ maxWidth: "100%", marginTop: 8 }}
                />
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}