import { Metadata } from 'next';
import Link from 'next/link';
import { getAllPosts } from '@/lib/blog';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

export const metadata: Metadata = {
  title: 'Blog | Chain Day',
  description:
    'Thoughts on building habits, productivity, and the journey of building in public.',
};

const PILLAR_COLORS: Record<string, string> = {
  'ai-infrastructure': 'bg-purple-100 text-purple-700',
  'dev-productivity': 'bg-blue-100 text-blue-700',
  'learning-mastery': 'bg-green-100 text-green-700',
  'building-in-public': 'bg-amber-100 text-amber-700',
  'digital-nomad': 'bg-rose-100 text-rose-700',
};

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export default function BlogPage() {
  const posts = getAllPosts();

  return (
    <>
      <Header />
      <main className="min-h-screen bg-white pt-24 dark:bg-zinc-950">
        <div className="mx-auto max-w-3xl px-6 py-12 lg:px-8">
          <header className="mb-12">
            <h1 className="text-4xl font-bold tracking-tight text-zinc-900 dark:text-white">
              Blog
            </h1>
            <p className="mt-4 text-lg text-zinc-600 dark:text-zinc-400">
              Thoughts on building habits, productivity, and the journey of
              building in public.
            </p>
          </header>

          {posts.length === 0 ? (
            <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-8 text-center dark:border-zinc-800 dark:bg-zinc-900">
              <p className="text-zinc-600 dark:text-zinc-400">
                No posts yet. Check back soon!
              </p>
            </div>
          ) : (
            <div className="space-y-8">
              {posts.map((post) => (
                <article
                  key={post.slug}
                  className="group relative rounded-lg border border-zinc-200 p-6 transition hover:border-amber-300 hover:bg-zinc-50 dark:border-zinc-800 dark:hover:border-amber-600 dark:hover:bg-zinc-900"
                >
                  <Link href={`/blog/${post.slug}`} className="absolute inset-0">
                    <span className="sr-only">Read {post.title}</span>
                  </Link>

                  <div className="flex items-center gap-3 text-sm text-zinc-500 dark:text-zinc-400">
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

                  <h2 className="mt-3 text-xl font-semibold text-zinc-900 group-hover:text-amber-600 dark:text-white dark:group-hover:text-amber-500">
                    {post.title}
                  </h2>

                  <p className="mt-2 text-zinc-600 dark:text-zinc-400">
                    {post.excerpt}
                  </p>

                  <div className="mt-4 flex items-center text-sm font-medium text-amber-600 dark:text-amber-500">
                    Read more
                    <svg
                      className="ml-1 h-4 w-4 transition group-hover:translate-x-1"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
