import * as React from "react";
import type { JSX } from "react";
import TextBlock from "./TextBlock";
import ImageBlock from "./ImageBlock";
import type { Block } from "@/types/blocks"; // Use your shared type

type BlockRenderer = (block: Block) => JSX.Element;

export const blockRegistry: Record<string, BlockRenderer> = {
  text: block => <TextBlock key={block.id} {...(block.data as { text: string })} />,
  image: block => <ImageBlock key={block.id} {...(block.data as { url: string; alt?: string })} />,
  // Add more block types here
};