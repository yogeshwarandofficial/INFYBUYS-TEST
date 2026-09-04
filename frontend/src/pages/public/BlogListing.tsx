import { Seo } from '@/components/shared/Seo';
import { ArrowRight } from 'lucide-react';
import { BLOG_POSTS } from '@/constants/marketing';
import { Link } from 'react-router';

export default function BlogListing() {
  return (
    <>
      <Seo
        title="InfyBuys Blog & Resources"
        description="Expert insights on buying, selling, and valuing online businesses."
      />

      <section className="relative w-full min-h-[400px] lg:min-h-[600px] flex items-center justify-center pt-32 pb-16 overflow-hidden">
        <div 
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat opacity-100"
        style={{ backgroundImage: 'url("https://res.cloudinary.com/dhjupdyus/image/upload/v1788433706/eb98343f-5828-4a4a-8630-f579bb722a5a_yb6rcq.png")' }}
      >
        <div className="absolute inset-0 bg-[#0B152A]/40 backdrop-blur-[2px]"></div>
        {/* Dark navy gradient overlay for premium look */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#0B152A]/90 via-[#0B152A]/70 to-[#0B4C8C]/60"></div>
      </div>

        <div className="container relative z-20 mx-auto px-4 text-center max-w-4xl">
          <div className="flex flex-col items-center">
            <span className="text-[#0757A0] font-extrabold tracking-widest text-xs md:text-sm uppercase mb-4 px-4 py-1.5 bg-[#F1F7FC]/90 shadow-sm rounded-full">
              INFYBUYS BLOG
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.15] mb-6">
              Insights for Smarter<span className="text-[#00B8E6]"> <br/>Business Decisions</span> 
            </h1>
            <p className="text-lg md:text-xl text-[#F1F5F9] max-w-2xl font-medium drop-shadow-md mb-12">
              Explore expert insights, marketplace trends, acquisition strategies, and practical guidance for buying and selling online businesses.
            </p>
          </div>
        </div>
      </section>

      <div className="bg-[#f8fafc] py-20">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-extrabold text-[#0B152A] mb-4 tracking-tight">Latest from our Blog</h2>
            <p className="text-slate-500 text-lg max-w-2xl mx-auto leading-relaxed">
              Stay up to date with the latest insights, strategies, and news from the digital business marketplace.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 xl:gap-10">
            {BLOG_POSTS.map(post => (
              <Link to={`/blog/${post.id}`} key={post.id} className="group flex h-full">
                <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col w-full h-full">
                  
                  {/* Image container with zoom */}
                  <div className="h-60 relative overflow-hidden shrink-0 border-b border-slate-100">
                    <img
                      src={post.image}
                      alt={post.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute top-5 left-5">
                      <span className="bg-white/95 backdrop-blur-sm text-[#0B152A] text-[11px] font-bold uppercase tracking-wider py-1.5 px-3 rounded-full shadow-sm">
                        {post.category}
                      </span>
                    </div>
                  </div>
                  
                  {/* Content */}
                  <div className="p-8 flex flex-col flex-1">
                    <div className="flex flex-wrap items-center text-[13px] text-slate-500 font-semibold mb-4 gap-x-2 gap-y-1">
                      <span className="text-[#0B4C8C]">{post.author}</span>
                      <span className="text-slate-300">•</span>
                      <span>{post.date}</span>
                      <span className="text-slate-300">•</span>
                      <span>{post.readTime}</span>
                    </div>
                    
                    <h3 className="text-xl font-extrabold text-[#0B152A] mb-3 group-hover:text-[#0B4C8C] transition-colors leading-snug line-clamp-2">
                      {post.title}
                    </h3>
                    
                    <p className="text-slate-500 leading-relaxed line-clamp-3 mb-8 flex-1">
                      {post.excerpt}
                    </p>
                    
                    <div className="mt-auto flex items-center text-[#0B152A] font-bold text-sm tracking-wide group-hover:text-[#0B4C8C] transition-colors">
                      READ MORE
                      <ArrowRight className="w-4 h-4 ml-2 transition-transform duration-300 group-hover:translate-x-1" />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
