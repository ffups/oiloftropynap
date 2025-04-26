import { sanity } from './sanityClient';

type Post = {
  _id: string;
  title: string;
  slug: { current: string };
};

export default async function Page() {
  const posts: Post[] = await sanity.fetch(`*[_type == "post"]{_id, title, slug}`);

  return (
    <div>
      <h1>Posts</h1>
      <ul>
        {posts.map((post) => (
          <li key={post._id} data-sanity-edit-target={`post:${post._id}`}>
            <a href={`/posts/${post.slug.current}`} target="_blank" rel="noopener noreferrer">
              {post.title}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}