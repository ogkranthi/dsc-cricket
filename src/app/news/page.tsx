import Link from "next/link";
import { getPosts } from "@/lib/content";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const metadata = { title: "News | DSC Cricket" };

export default function NewsPage() {
  const posts = getPosts();

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">News & Articles</h1>
      <div className="space-y-4">
        {posts.length === 0 && (
          <p className="text-muted-foreground">No articles yet. Check back soon!</p>
        )}
        {posts.map((post) => (
          <Link key={post.slug} href={`/news/${post.slug}`}>
            <Card className="hover:shadow-md transition-shadow mb-4">
              <CardHeader>
                <div className="flex items-center gap-2 mb-1">
                  <Badge variant="outline">{post.category}</Badge>
                  <span className="text-xs text-muted-foreground">
                    {new Date(post.date).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
                  </span>
                </div>
                <CardTitle className="text-xl">{post.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{post.excerpt}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
