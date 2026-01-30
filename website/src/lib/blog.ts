import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import readingTime from 'reading-time';

const BLOG_DIR = path.join(process.cwd(), 'content/blog');

export interface BlogPost {
  slug: string;
  title: string;
  date: string;
  pillar?: string;
  status?: string;
  tags?: string[];
  excerpt?: string;
  readingTime: string;
  content: string;
  meta_description?: string;
}

export interface BlogPostMeta extends Omit<BlogPost, 'content'> {}

export function getAllPosts(): BlogPostMeta[] {
  if (!fs.existsSync(BLOG_DIR)) {
    return [];
  }

  const files = fs.readdirSync(BLOG_DIR).filter((f) => f.endsWith('.md'));

  const posts = files
    .map((filename) => {
      const filePath = path.join(BLOG_DIR, filename);
      const fileContent = fs.readFileSync(filePath, 'utf-8');
      const { data, content } = matter(fileContent);

      // Skip drafts - only show published posts
      if (data.status && data.status !== 'published') {
        return null;
      }

      const slug = filename.replace(/\.md$/, '');
      const stats = readingTime(content);

      // Generate excerpt from first paragraph
      const excerpt =
        data.meta_description ||
        content
          .replace(/^#.*$/gm, '')
          .replace(/\n+/g, ' ')
          .trim()
          .slice(0, 160) + '...';

      return {
        slug,
        title: data.title || slug,
        date: data.date ? String(data.date) : new Date().toISOString(),
        pillar: data.pillar,
        status: data.status,
        tags: data.tags || [],
        excerpt,
        readingTime: stats.text,
        meta_description: data.meta_description,
      };
    })
    .filter((post): post is BlogPostMeta => post !== null)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return posts;
}

export function getPostBySlug(slug: string): BlogPost | null {
  const filePath = path.join(BLOG_DIR, `${slug}.md`);

  if (!fs.existsSync(filePath)) {
    return null;
  }

  const fileContent = fs.readFileSync(filePath, 'utf-8');
  const { data, content } = matter(fileContent);
  const stats = readingTime(content);

  return {
    slug,
    title: data.title || slug,
    date: data.date ? String(data.date) : new Date().toISOString(),
    pillar: data.pillar,
    status: data.status,
    tags: data.tags || [],
    readingTime: stats.text,
    content,
    meta_description: data.meta_description,
  };
}

export function getAllSlugs(): string[] {
  if (!fs.existsSync(BLOG_DIR)) {
    return [];
  }

  return fs
    .readdirSync(BLOG_DIR)
    .filter((f) => f.endsWith('.md'))
    .map((f) => f.replace(/\.md$/, ''));
}
