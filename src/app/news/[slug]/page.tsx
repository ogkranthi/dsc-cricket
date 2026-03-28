import { notFound } from "next/navigation";
import { getPost, getPosts } from "@/lib/content";
import { Badge } from "@/components/ui/badge";

export function generateStaticParams() {
  return getPosts().map((p) => ({ slug: p.slug }));
}

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  return (
    <article className="mx-auto max-w-3xl px-4 py-8">
      <header className="mb-8">
        <div className="flex items-center gap-2 mb-3">
          <Badge variant="outline">{post.category}</Badge>
          <span className="text-sm text-muted-foreground">
            {new Date(post.date).toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })}
          </span>
        </div>
        <h1 className="text-4xl font-bold tracking-tight">{post.title}</h1>
      </header>
      <div className="prose prose-lg max-w-none">
        {post.content.split("\n").map((line, i) => {
          if (line.startsWith("## ")) {
            return <h2 key={i} className="text-2xl font-bold mt-8 mb-4">{line.replace("## ", "")}</h2>;
          }
          if (line.startsWith("- ")) {
            return <li key={i} className="ml-4 mb-1">{line.replace("- ", "")}</li>;
          }
          if (line.trim() === "") return <br key={i} />;
          return <p key={i} className="mb-4 leading-relaxed">{line}</p>;
        })}
      </div>
    </article>
  );
}
