import type { CollectionConfig } from 'payload';
import { lexicalEditor, lexicalHTML } from '@payloadcms/richtext-lexical';

export const Posts: CollectionConfig = {
  slug: 'posts',
  access: { read: () => true },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'content',
      type: 'richText',
      editor: lexicalEditor(),
      required: true,
    },
  ],
  hooks: {
    afterRead: [
      async ({ doc }: { doc: any }) => {
        try {
          if (doc.content && typeof doc.content === 'object' && doc.content.root) {
            doc.contentHtml = await lexicalHTML(doc.content);
          } else {
            doc.contentHtml = '';
          }
        } catch (e) {
          doc.contentHtml = '';
        }
        return doc;
      },
    ],
  },
};