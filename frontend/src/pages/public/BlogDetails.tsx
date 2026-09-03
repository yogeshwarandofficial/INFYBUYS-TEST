import { Seo } from '@/components/shared/Seo';
import { BLOG_POSTS } from '@/constants/marketing';
import { BLOG_CONTENT } from '@/constants/blogContent';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Mail, MessageSquare, Link as LinkIcon } from 'lucide-react';
import { Link, useParams } from 'react-router';

export default function BlogDetails() {
  const { id } = useParams();
  const post = BLOG_POSTS.find(p => p.id === id) || BLOG_POSTS[0];
  const relatedPosts = BLOG_POSTS.filter(p => p.id !== post.id).slice(0, 2);
  
  // Fallback to the first post's content if id is somehow invalid (though unlikely to happen)
  const content = BLOG_CONTENT[post.id] || BLOG_CONTENT['b1'];

  return (
    <>
      <Seo
        title={`${post.title} - InfyBuys Blog`}
        description={content.heroDescription}
      />

      {/* Hero Section */}
      <section className="relative w-full min-h-[450px] lg:min-h-[550px] flex items-center justify-center pt-32 pb-16 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src={content.heroImage} 
            alt={content.heroHeading} 
            className="w-full h-full object-cover"
          />
        </div>
        <div className="absolute inset-0 z-10 bg-gradient-to-br from-white/95 via-white/85 to-[#0B4C8C]/10"></div>
        <div className="container relative z-20 mx-auto px-4 text-center max-w-4xl">
          <div className="flex flex-col items-center">
            <span className="text-[#0B4C8C] font-extrabold tracking-widest text-xs md:text-sm uppercase mb-4 px-4 py-1.5 bg-[#0B4C8C]/10 rounded-full">
              {post.category}
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-[#0B152A] tracking-tight leading-[1.15] mb-6">
              {content.heroHeading}
            </h1>
            <p className="text-lg md:text-xl text-slate-700 leading-relaxed max-w-2xl">
              {content.heroDescription}
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="bg-[#f8fafc] py-16">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-12 max-w-7xl mx-auto">

            <main className="flex-1 max-w-4xl min-w-0 bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-slate-100">
              
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-8 mb-10">
                <div className="flex items-center gap-4 text-sm text-slate-500">
                  <img
                    src={`https://i.pravatar.cc/150?u=${post.author}`}
                    alt={post.author}
                    className="w-12 h-12 rounded-full border border-slate-200"
                  />
                  <div>
                    <div className="font-bold text-[#0B152A] text-base">{post.author}</div>
                    <div className="flex items-center gap-2 mt-0.5 text-xs">
                      <span>{post.date}</span>
                      <span className="text-slate-300">•</span>
                      <span>{post.readTime}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-slate-400 mr-2 hidden sm:inline-block">Share:</span>
                  <button type="button" aria-label="Share via SMS" className="inline-flex items-center justify-center rounded-full w-9 h-9 border border-slate-200 bg-white text-slate-500 hover:bg-[#0B4C8C] hover:text-white hover:border-[#0B4C8C] transition-colors duration-300 outline-none"><MessageSquare className="w-4 h-4" /></button>
                  <button type="button" aria-label="Share via Email" className="inline-flex items-center justify-center rounded-full w-9 h-9 border border-slate-200 bg-white text-slate-500 hover:bg-[#0B4C8C] hover:text-white hover:border-[#0B4C8C] transition-colors duration-300 outline-none"><Mail className="w-4 h-4" /></button>
                  <button type="button" aria-label="Copy link" className="inline-flex items-center justify-center rounded-full w-9 h-9 border border-slate-200 bg-white text-slate-500 hover:bg-[#0B4C8C] hover:text-white hover:border-[#0B4C8C] transition-colors duration-300 outline-none"><LinkIcon className="w-4 h-4" /></button>
                </div>
              </div>

              <div className="prose prose-lg max-w-none text-slate-700 mb-16">
                {content.content}
              </div>

              {/* Related Posts */}
              <div className="mt-16 pt-12 border-t border-slate-100">
                <h3 className="text-2xl font-bold text-[#0B152A] mb-8">Related Articles</h3>
                <div className="grid sm:grid-cols-2 gap-8">
                  {relatedPosts.map(related => (
                    <Link to={`/blog/${related.id}`} key={related.id} className="group flex h-full">
                      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col w-full h-full">
                        <div className="h-48 overflow-hidden relative shrink-0 border-b border-slate-100">
                          <img
                            src={related.image}
                            alt={related.title}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                          />
                          <div className="absolute top-4 left-4">
                            <span className="bg-white/95 backdrop-blur-sm text-[#0B152A] text-[10px] font-bold uppercase tracking-wider py-1 px-2.5 rounded-full shadow-sm">
                              {related.category}
                            </span>
                          </div>
                        </div>
                        <div className="p-6 flex flex-col flex-1">
                          <h4 className="font-bold text-lg text-[#0B152A] mb-2 group-hover:text-[#0B4C8C] transition-colors line-clamp-2">
                            {related.title}
                          </h4>
                          <div className="mt-auto text-xs font-semibold text-slate-400">
                            {related.date}
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </main>

            {/* Sidebar */}
            <aside className="lg:w-80 shrink-0 space-y-8">
              <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
                <div className="flex items-center gap-4 mb-4">
                  <img
                    src={`https://i.pravatar.cc/150?u=${post.author}`}
                    alt={post.author}
                    className="w-16 h-16 rounded-full border border-slate-200"
                  />
                  <div>
                    <h4 className="font-bold text-[#0B152A] text-lg leading-tight">{post.author}</h4>
                    <p className="text-sm font-medium text-[#0B4C8C]">M&A Advisor</p>
                  </div>
                </div>
                <p className="text-sm text-slate-500 mb-6 leading-relaxed">
                  Expert in SaaS valuations and digital asset acquisitions with over $50M in completed transactions.
                </p>
                <Button variant="outline" className="w-full border-slate-200 hover:bg-slate-50 text-[#0B152A]">
                  View all by {post.author}
                </Button>
              </div>

              <div className="bg-gradient-to-br from-[#0B4C8C] to-[#0A3D70] rounded-2xl p-8 shadow-md text-center text-white relative overflow-hidden">
                <div className="relative z-10">
                  <h3 className="text-xl font-extrabold mb-3">Join our Newsletter</h3>
                  <p className="text-white/80 text-sm mb-6 leading-relaxed">
                    Get the best insights on buying and selling digital assets delivered weekly.
                  </p>
                  <div className="space-y-3">
                    <Input placeholder="Your email address" className="bg-black/10 border-white/20 text-white placeholder:text-white/50 h-10 focus-visible:ring-white/30" />
                    <Button className="w-full bg-white text-[#0B4C8C] hover:bg-slate-100 h-10 font-bold tracking-wide">
                      Subscribe
                    </Button>
                  </div>
                </div>
                <div className="absolute top-0 right-0 -mr-16 -mt-16 w-48 h-48 rounded-full bg-white/5 blur-3xl"></div>
                <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-48 h-48 rounded-full bg-black/10 blur-3xl"></div>
              </div>
            </aside>

          </div>
        </div>
      </div>
    </>
  );
}
