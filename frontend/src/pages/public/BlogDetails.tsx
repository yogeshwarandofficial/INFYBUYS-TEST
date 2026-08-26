import { Seo } from '@/components/shared/Seo';
import { Breadcrumb } from '@/components/shared/Breadcrumb';
import { BLOG_POSTS } from '@/constants/marketing';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Mail, MessageSquare, Link as LinkIcon } from 'lucide-react';
import { Link, useParams } from 'react-router';

export default function BlogDetails() {
  const { id } = useParams();
  const post = BLOG_POSTS.find(p => p.id === id) || BLOG_POSTS[0];
  const relatedPosts = BLOG_POSTS.filter(p => p.id !== post.id).slice(0, 2);

  return (
    <>
      <Seo
        title={`${post.title} - InfyBuys Blog`}
        description={post.excerpt}
      />

      <div className="bg-muted/10 border-b">
        <div className="container mx-auto px-4 py-8">
          <Breadcrumb
            items={[
              { label: 'Blog', href: '/blog' },
              { label: post.category, href: `/blog?category=${post.category}` },
              { label: post.title }
            ]}
          />
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col lg:flex-row gap-12">

          <main className="flex-1 max-w-4xl min-w-0">
            <header className="mb-10">
              <Badge className="mb-4">{post.category}</Badge>
              <h1 className="text-4xl md:text-5xl font-black mb-6 leading-tight">
                {post.title}
              </h1>
              <div className="flex items-center gap-4 text-sm text-muted-foreground border-b pb-6">
                <img
                  src={`https://i.pravatar.cc/150?u=${post.author}`}
                  alt={post.author}
                  className="w-10 h-10 rounded-full"
                />
                <div>
                  <div className="font-medium text-foreground">{post.author}</div>
                  <div>{post.date} • {post.readTime}</div>
                </div>
              </div>
            </header>

            <img
              src={post.image}
              alt={post.title}
              className="w-full h-[400px] object-cover rounded-xl mb-10"
            />

            <div className="prose prose-lg dark:prose-invert max-w-none mb-12">
              <p className="lead text-xl text-muted-foreground mb-8">
                {post.excerpt}
              </p>

              <h3>The Shifting Landscape</h3>
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
              </p>

              <blockquote className="border-l-4 border-primary pl-4 my-8 italic text-xl text-muted-foreground">
                "The multiples we saw in 2021 are gone. Today's acquirers are looking for sustainable growth, not just top-line revenue."
              </blockquote>

              <h3>Key Metrics to Track</h3>
              <ul>
                <li><strong>Net Revenue Retention (NRR):</strong> Must be above 100% for a premium multiple.</li>
                <li><strong>Customer Acquisition Cost (CAC) Payback:</strong> Ideally under 12 months.</li>
                <li><strong>Gross Margin:</strong> SaaS should target 80%+.</li>
              </ul>

              <p>
                Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
              </p>
            </div>

            <div className="flex items-center gap-4 py-6 border-t border-b">
              <span className="font-semibold">Share this article:</span>
              <Button variant="outline" size="icon" className="rounded-full" aria-label="Share via SMS"><MessageSquare className="w-4 h-4" /></Button>
              <Button variant="outline" size="icon" className="rounded-full" aria-label="Share via Email"><Mail className="w-4 h-4" /></Button>
              <Button variant="outline" size="icon" className="rounded-full" aria-label="Copy link"><LinkIcon className="w-4 h-4" /></Button>
            </div>

            {/* Related Posts */}
            <div className="mt-16">
              <h3 className="text-2xl font-bold mb-6">Related Articles</h3>
              <div className="grid sm:grid-cols-2 gap-6">
                {relatedPosts.map(related => (
                  <Link to={`/blog/${related.id}`} key={related.id}>
                    <Card className="h-full overflow-hidden hover:shadow-md transition-all group">
                      <div className="h-40 overflow-hidden">
                        <img
                          src={related.image}
                          alt={related.title}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      </div>
                      <CardContent className="p-4">
                        <Badge variant="secondary" className="mb-2">{related.category}</Badge>
                        <h4 className="font-bold mb-2 group-hover:text-primary transition-colors line-clamp-2">
                          {related.title}
                        </h4>
                        <div className="text-xs text-muted-foreground">
                          {related.date}
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>
          </main>

          {/* Sidebar */}
          <aside className="lg:w-80 shrink-0 space-y-8">
            <Card className="bg-muted/30">
              <CardContent className="p-6">
                <div className="flex items-center gap-4 mb-4">
                  <img
                    src={`https://i.pravatar.cc/150?u=${post.author}`}
                    alt={post.author}
                    className="w-16 h-16 rounded-full"
                  />
                  <div>
                    <h4 className="font-bold">{post.author}</h4>
                    <p className="text-sm text-muted-foreground">M&A Advisor</p>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  Expert in SaaS valuations and digital asset acquisitions with over $50M in completed transactions.
                </p>
                <Button variant="outline" className="w-full">View all by {post.author}</Button>
              </CardContent>
            </Card>

            <Card className="bg-primary text-primary-foreground border-none">
              <CardContent className="p-6 text-center">
                <h3 className="text-xl font-bold mb-2">Join our Newsletter</h3>
                <p className="text-primary-foreground/80 text-sm mb-4">
                  Get the best insights on buying and selling digital assets delivered weekly.
                </p>
                <div className="space-y-2">
                  <Input placeholder="Your email address" className="bg-background/10 border-primary-foreground/20 text-white placeholder:text-white/50" />
                  <Button variant="secondary" className="w-full">Subscribe</Button>
                </div>
              </CardContent>
            </Card>
          </aside>

        </div>
      </div>
    </>
  );
}
