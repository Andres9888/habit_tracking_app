import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { MDXRemote } from 'next-mdx-remote/rsc';
import { getPostBySlug, getAllSlugs } from '@/lib/blog';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const slugs = getAllSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    return { title: 'Post Not Found' };
  }

  return {
    title: `${post.title} | Chain Day Blog`,
    description: post.meta_description || post.title,
  };
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

const PILLAR_COLORS: Record<string, string> = {
  'ai-infrastructure': 'bg-purple-100 text-purple-700',
  'dev-productivity': 'bg-blue-100 text-blue-700',
  'learning-mastery': 'bg-green-100 text-green-700',
  'building-in-public': 'bg-amber-100 text-amber-700',
  'digital-nomad': 'bg-rose-100 text-rose-700',
};

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-white pt-24 dark:bg-zinc-950">
        <article className="mx-auto max-w-3xl px-6 py-12 lg:px-8">
          <header className="mb-8">
            <Link
              href="/blog"
              className="mb-6 inline-flex items-center text-sm text-zinc-500 transition hover:text-amber-600 dark:text-zinc-400"
            >
              <svg
                className="mr-1 h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              Back to Blog
            </Link>

            <div className="flex flex-wrap items-center gap-3 text-sm text-zinc-500 dark:text-zinc-400">
              <time dateTime={post.date}>{formatDate(post.date)}</time>
              <span>·</span>
              <span>{post.readingTime}</span>
              {post.pillar && (
                <>
                  <span>·</span>
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs font-medium ${PILLAR_COLORS[post.pillar] || 'bg-zinc-100 text-zinc-700'}`}
                  >
                    {post.pillar.replace(/-/g, ' ')}
                  </span>
                </>
              )}
            </div>

            <h1 className="mt-4 text-4xl font-bold tracking-tight text-zinc-900 dark:text-white">
              {post.title}
            </h1>

            {post.tags && post.tags.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-zinc-100 px-3 py-1 text-xs text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </header>

          <div className="prose prose-zinc prose-lg max-w-none dark:prose-invert prose-headings:font-semibold prose-a:text-amber-600 hover:prose-a:text-amber-500 prose-img:rounded-lg">
            <MDXRemote source={post.content} />
          </div>

          <footer className="mt-12 border-t border-zinc-200 pt-8 dark:border-zinc-800">
            <div className="flex items-center justify-between">
              <Link
                href="/blog"
                className="text-sm font-medium text-amber-600 transition hover:text-amber-500 dark:text-amber-500"
              >
                ← Back to all posts
              </Link>

              <a
                href="https://twitter.com/intent/tweet?text=Check%20out%20this%20post"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-zinc-500 transition hover:text-zinc-700 dark:text-zinc-400"
              >
                Share on Twitter
              </a>
            </div>
          </footer>
        </article>
      </main>
      <Footer />
    </>
  );
}
