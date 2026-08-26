import { Seo } from '@/components/shared/Seo';
import { PageHeader } from '@/components/shared/PageHeader';
import { BLOG_POSTS } from '@/constants/marketing';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search as SearchIcon, ArrowRight } from 'lucide-react';
import { Link } from 'react-router';

export default function BlogListing() {
  const featuredPost = BLOG_POSTS.find(p => p.isFeatured) || BLOG_POSTS[0];
  const recentPosts = BLOG_POSTS.filter(p => p.id !== featuredPost.id);

  return (
    <>
      <Seo
        title="InfyBuys Blog & Resources"
        description="Expert insights on buying, selling, and valuing online businesses."
      />

      <PageHeader
        title="Resources & Insights"
        description="Expert advice on buying, selling, and scaling digital assets."
        breadcrumbs={[{ label: 'Blog' }]}
        className="pb-8"
      />

      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col md:flex-row gap-8">

          <main className="flex-1 space-y-16 min-w-0">
            {/* Featured Post */}
            <section>
              <h2 className="text-2xl font-bold mb-6">Featured Article</h2>
              <Link to={`/blog/${featuredPost.id}`}>
                <Card className="overflow-hidden hover:shadow-lg transition-all border-border group">
                  <div className="md:flex h-full">
                    <div className="md:w-1/2 h-64 md:h-auto relative overflow-hidden">
                      <img
                        src={featuredPost.image}
                        alt={featuredPost.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                    <CardContent className="md:w-1/2 p-8 flex flex-col justify-center">
                      <Badge className="w-fit mb-4">{featuredPost.category}</Badge>
                      <h3 className="text-2xl font-bold mb-3 group-hover:text-primary transition-colors">
                        {featuredPost.title}
                      </h3>
                      <p className="text-muted-foreground mb-6 line-clamp-3">
                        {featuredPost.excerpt}
                      </p>
                      <div className="flex items-center text-sm text-muted-foreground mt-auto">
                        <span className="font-medium text-foreground">{featuredPost.author}</span>
                        <span className="mx-2">•</span>
                        <span>{featuredPost.date}</span>
                        <span className="mx-2">•</span>
                        <span>{featuredPost.readTime}</span>
                      </div>
                    </CardContent>
                  </div>
                </Card>
              </Link>
            </section>

            {/* Recent Posts Grid */}
            <section>
              <h2 className="text-2xl font-bold mb-6">Recent Posts</h2>
              <div className="grid sm:grid-cols-2 gap-6">
                {recentPosts.map(post => (
                  <Link to={`/blog/${post.id}`} key={post.id}>
                    <Card className="h-full overflow-hidden hover:shadow-md transition-all group">
                      <div className="h-48 overflow-hidden relative">
                        <img
                          src={post.image}
                          alt={post.title}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        <div className="absolute top-4 left-4">
                          <Badge variant="secondary" className="bg-background/80 backdrop-blur-sm">
                            {post.category}
                          </Badge>
                        </div>
                      </div>
                      <CardContent className="p-6">
                        <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors line-clamp-2">
                          {post.title}
                        </h3>
                        <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                          {post.excerpt}
                        </p>
                        <div className="flex items-center justify-between text-xs text-muted-foreground mt-auto">
                          <span>{post.date}</span>
                          <span className="flex items-center text-primary font-medium group-hover:underline">
                            Read <ArrowRight className="w-3 h-3 ml-1" />
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </section>
          </main>

          {/* Sidebar */}
          <aside className="md:w-80 shrink-0 space-y-10">
            {/* Search */}
            <div>
              <h3 className="font-semibold mb-4">Search</h3>
              <div className="relative">
                <SearchIcon className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search articles..." className="pl-9 bg-background" />
              </div>
            </div>

            {/* Categories */}
            <div>
              <h3 className="font-semibold mb-4">Categories</h3>
              <div className="flex flex-col gap-2">
                {['Valuation', 'Acquisition', 'Selling', 'Case Studies', 'Market Trends'].map(cat => (
                  <Link
                    key={cat}
                    to={`/blog?category=${cat}`}
                    className="flex justify-between items-center text-muted-foreground hover:text-primary py-2 border-b last:border-0"
                  >
                    <span>{cat}</span>
                    <ArrowRight className="w-4 h-4 opacity-0 -translate-x-2 transition-all" />
                  </Link>
                ))}
              </div>
            </div>

            {/* Newsletter CTA */}
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
