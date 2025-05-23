import BackToList from "@/components/shared/BackToList";
import { siteConfig } from "@/lib/config";
import { getAllPostSlugs, getPostBySlug } from "@/lib/utils/post";
import { IPost } from "@/types/post";
import { Metadata } from "next";

interface Props {
  params: Promise<{ slug: string }>;
}
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post: IPost = await getPostBySlug(slug);

  if (!post) {
    return {
      title: "Page Not Found",
    };
  }
  return {
    title: `${post.title} | Blog`,
    description: post.description,
    openGraph: {
      type: "article",
      url: siteConfig.endpoints.blog.detail(slug),
      title: post.title,
      description: post.description,
      siteName: siteConfig.name,
      images: [{ url: post.thumbnail || siteConfig.ogImage }],
      publishedTime: post.publishDate,
    },
  };
}

export async function generateStaticParams() {
  const slugs = await getAllPostSlugs();
  return slugs.map((slug) => {
    return { slug: slug };
  });
}

export const dynamicParams = false;

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const { default: Post } = await import(`@/content/blog/${slug}.mdx`);
  return (
    <div className="container mx-auto px-4 sm:px-10 lg:px-28 xl:px-44 2xl:px-56 space-y-6 mb-8">
      <BackToList />
      <Post />
    </div>
  );
}
