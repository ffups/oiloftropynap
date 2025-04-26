import { sanity } from '@/app/sanityClient';

export default async function PostPage(props: any) {
  const { params } = props;
  const awaitedParams = await params;
  const { slug } = awaitedParams;

  const post = await sanity.fetch(
    `*[_type == "post" && slug.current == $slug][0]{title, _id, slug}`,
    { slug }
  );

  if (!post) {
    return <div>Post not found</div>;
  }

  return (
    <div>
      <h1 data-sanity-edit-target={`post:${post._id}`}>{post.title}</h1>
      <p>Slug: {post.slug.current}</p>
    </div>
  );
}

export async function generateStaticParams() {
  const posts = await sanity.fetch(`*[_type == "post"]{slug}`);
  return posts.map((post: any) => ({
    slug: post.slug.current,
  }));
}
