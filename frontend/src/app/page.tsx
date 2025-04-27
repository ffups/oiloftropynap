import { sanity } from './sanityClient';

type Post = {
  _id: string;
  title: string;
  slug: { current: string };
  body: string;  
};

export default async function Page() {
  const posts: Post[] = await sanity.fetch(`*[_type == "post"]{_id, title, slug, body}`);

  return (
    <div>
      <h1>Posts</h1>
      <ul>
        {posts.map((post) => (
          <li key={post._id} data-sanity-edit-target={`post:${post._id}`}>
            <h2>{post.title}</h2>
            <p>{post.body}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}