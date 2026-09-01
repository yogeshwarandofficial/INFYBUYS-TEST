import React from 'react';

export interface BlogContentProps {
  heroHeading: string;
  heroDescription: string;
  heroImage: string;
  content: React.ReactNode;
}

export const BLOG_CONTENT: Record<string, BlogContentProps> = {
  b1: {
    heroHeading: 'How to Value an Online Business',
    heroDescription: 'Understand the core metrics and methodologies for valuing digital assets, SaaS, and e-commerce platforms in today\'s market.',
    heroImage: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070',
    content: (
      <>
        <h2 className="text-2xl font-bold text-[#0B152A] mt-8 mb-4">What Is Business Valuation?</h2>
        <p className="text-slate-600 mb-6 leading-relaxed text-lg">Business valuation is the process of determining the economic value of a business or company. For online businesses, this involves analyzing revenue streams, traffic, operational efficiency, and market trends to establish a fair market price.</p>
        
        <h2 className="text-2xl font-bold text-[#0B152A] mt-8 mb-4">Revenue and Profit Multiples</h2>
        <p className="text-slate-600 mb-6 leading-relaxed text-lg">The most common valuation method for digital assets is the seller's discretionary earnings (SDE) or EBITDA multiple. Online businesses typically sell for 2x to 5x their annual profit, depending on their model, growth rate, and defensibility.</p>
        
        <h2 className="text-2xl font-bold text-[#0B152A] mt-8 mb-4">SaaS Valuation</h2>
        <p className="text-slate-600 mb-6 leading-relaxed text-lg">SaaS companies are often valued on an Annual Recurring Revenue (ARR) multiple rather than strict profit, especially if they are growing rapidly. Metrics like churn rate, Customer Acquisition Cost (CAC), and Lifetime Value (LTV) play a critical role in SaaS valuations on InfyBuys.</p>
        
        <h2 className="text-2xl font-bold text-[#0B152A] mt-8 mb-4">E-Commerce Valuation</h2>
        <p className="text-slate-600 mb-6 leading-relaxed text-lg">E-commerce valuations heavily depend on supply chain defensibility, inventory, brand moat, and net margins. Dropshipping businesses generally command lower multiples than brands with proprietary products and loyal customer bases.</p>
        
        <h2 className="text-2xl font-bold text-[#0B152A] mt-8 mb-4">Traffic and Customer Metrics</h2>
        <p className="text-slate-600 mb-6 leading-relaxed text-lg">For content sites and marketplaces, diversified traffic sources are paramount. A business relying on a single traffic source carries higher risk. Organic search traffic, a strong email list, and recurring customers significantly boost valuation.</p>
        
        <h2 className="text-2xl font-bold text-[#0B152A] mt-8 mb-4">Growth Potential</h2>
        <p className="text-slate-600 mb-6 leading-relaxed text-lg">Buyers on InfyBuys are looking for upside. Clear, untapped growth channels—such as expanding into new markets, optimizing pricing, or adding a new marketing channel—can justify a premium multiple.</p>
        
        <h2 className="text-2xl font-bold text-[#0B152A] mt-8 mb-4">Factors That Increase Business Value</h2>
        <ul className="list-disc pl-6 text-slate-600 mb-6 space-y-2 text-lg">
          <li><strong>Recurring Revenue:</strong> Subscription models provide predictable cash flow.</li>
          <li><strong>Low Owner Involvement:</strong> Businesses with strong SOPs and a management team are highly desirable.</li>
          <li><strong>Aged Domain and Authority:</strong> Older businesses with established histories have lower risk profiles.</li>
        </ul>
        
        <h2 className="text-2xl font-bold text-[#0B152A] mt-8 mb-4">Common Valuation Mistakes</h2>
        <p className="text-slate-600 mb-6 leading-relaxed text-lg">Sellers often overestimate the value of potential or future features. Remember, buyers pay for the historical financial performance and the proven current state of the business, not just the "idea" of what it could become.</p>

        {/* Additional Content */}
        <h2 className="text-2xl font-bold text-[#0B152A] mt-10 mb-4">Key Takeaways</h2>
        <ul className="list-disc pl-6 text-slate-600 mb-6 space-y-2 text-lg">
          <li>Valuation is primarily driven by verified, historical cash flow rather than future projections.</li>
          <li>Different business models (SaaS, E-commerce, Content) require different valuation multiples and metrics.</li>
          <li>Minimizing owner involvement and operational complexity significantly boosts your final multiple.</li>
        </ul>

        <h2 className="text-2xl font-bold text-[#0B152A] mt-8 mb-4">What Buyers Should Know</h2>
        <p className="text-slate-600 mb-6 leading-relaxed text-lg">When evaluating a valuation, always verify the add-backs. Some sellers may aggressively add back expenses that are actually critical to running the business. Always normalize the P&L to reflect the true costs a new owner will incur.</p>

        <div className="bg-[#f8fafc] border border-slate-200 rounded-2xl p-6 mt-8">
          <h3 className="text-xl font-bold text-[#0B4C8C] mb-3">How InfyBuys Can Help</h3>
          <p className="text-slate-600 leading-relaxed">InfyBuys provides standardized, verified financial data for all our listings, ensuring that you evaluate businesses based on accurate valuations. Our built-in valuation tools and expert advisory network can help both buyers and sellers arrive at a fair, market-driven price.</p>
        </div>
      </>
    )
  },
  b2: {
    heroHeading: 'Understanding the Online Business Acquisition Process',
    heroDescription: 'A step-by-step guide to successfully finding, evaluating, and closing your next digital business acquisition.',
    heroImage: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=2070',
    content: (
      <>
        <h2 className="text-2xl font-bold text-[#0B152A] mt-8 mb-4">What Is an Online Business Acquisition?</h2>
        <p className="text-slate-600 mb-6 leading-relaxed text-lg">An online business acquisition is the process of purchasing a digital asset—such as a SaaS company, e-commerce store, or content site—to take over its operations, revenue streams, and customer base.</p>
        
        <h2 className="text-2xl font-bold text-[#0B152A] mt-8 mb-4">Finding the Right Opportunity</h2>
        <p className="text-slate-600 mb-6 leading-relaxed text-lg">The first step is deal sourcing. Platforms like InfyBuys provide a curated marketplace of vetted businesses. Buyers should focus on industries they understand or business models where they have a distinct operational advantage.</p>
        
        <h2 className="text-2xl font-bold text-[#0B152A] mt-8 mb-4">Evaluating a Listing</h2>
        <p className="text-slate-600 mb-6 leading-relaxed text-lg">When reviewing a listing, look beyond the top-line numbers. Evaluate the business's age, the consistency of its revenue, the reason for sale, and the time commitment required by the current owner to maintain operations.</p>
        
        <h2 className="text-2xl font-bold text-[#0B152A] mt-8 mb-4">Understanding Financial Performance</h2>
        <p className="text-slate-600 mb-6 leading-relaxed text-lg">Analyze Profit and Loss (P&L) statements carefully. Look for add-backs (personal expenses the owner ran through the business) and verify that the claimed Seller's Discretionary Earnings (SDE) accurately reflect the cash flow a new owner can expect.</p>
        
        <h2 className="text-2xl font-bold text-[#0B152A] mt-8 mb-4">Negotiating the Deal</h2>
        <p className="text-slate-600 mb-6 leading-relaxed text-lg">Negotiation isn't just about the purchase price. Structure is equally important. Earn-outs, seller financing, and training periods are crucial negotiation levers that can bridge valuation gaps and align the seller's interests with your future success.</p>
        
        <h2 className="text-2xl font-bold text-[#0B152A] mt-8 mb-4">Due Diligence</h2>
        <p className="text-slate-600 mb-6 leading-relaxed text-lg">Once a Letter of Intent (LOI) is signed, the due diligence phase begins. This is where the buyer verifies all financial, technical, and operational claims made by the seller. It is the most critical phase of the acquisition.</p>
        
        <h2 className="text-2xl font-bold text-[#0B152A] mt-8 mb-4">Closing the Acquisition</h2>
        <p className="text-slate-600 mb-6 leading-relaxed text-lg">Closing involves legal agreements, the transfer of funds (often through an escrow service), and the migration of assets, including domains, codebases, social accounts, and vendor relationships.</p>
        
        <h2 className="text-2xl font-bold text-[#0B152A] mt-8 mb-4">Growing the Acquired Business</h2>
        <p className="text-slate-600 mb-6 leading-relaxed text-lg">The real work begins after closing. Successful acquirers implement a 90-day transition plan focused on stabilizing operations before rolling out new growth initiatives and optimizations.</p>

        {/* Additional Content */}
        <h2 className="text-2xl font-bold text-[#0B152A] mt-10 mb-4">Important Things to Consider</h2>
        <p className="text-slate-600 mb-6 leading-relaxed text-lg">Acquisitions can fail during the transition period if not handled properly. Ensure you negotiate a thorough training period with the seller (typically 30-90 days) and have a clear roadmap for migrating server infrastructure, domain registrars, and software licenses.</p>

        <h2 className="text-2xl font-bold text-[#0B152A] mt-8 mb-4">Practical Tips</h2>
        <ul className="list-disc pl-6 text-slate-600 mb-6 space-y-2 text-lg">
          <li><strong>Don't skip escrow:</strong> Always use a trusted third-party escrow service to hold funds until all assets are successfully transferred and verified.</li>
          <li><strong>Check dependencies:</strong> Ensure the business doesn't rely entirely on a single unreplaceable vendor or contractor.</li>
          <li><strong>Build a 100-day plan:</strong> Know exactly what changes you will make (and what you will avoid changing) in your first 100 days of ownership.</li>
        </ul>

        <div className="bg-[#f8fafc] border border-slate-200 rounded-2xl p-6 mt-8">
          <h3 className="text-xl font-bold text-[#0B4C8C] mb-3">How InfyBuys Can Help</h3>
          <p className="text-slate-600 leading-relaxed">InfyBuys streamlines the entire acquisition lifecycle. From advanced filtering to find the perfect listing, to secure communication channels, and integrated escrow partnerships, our marketplace ensures a safe and efficient transfer of digital assets.</p>
        </div>
      </>
    )
  },
  b3: {
    heroHeading: 'A Complete Guide to Business Acquisition',
    heroDescription: 'Discover the strategies and insights you need to successfully navigate the complexities of acquiring an online business.',
    heroImage: 'https://images.unsplash.com/photo-1664575602276-acd073f104c1?q=80&w=2070',
    content: (
      <>
        <h2 className="text-2xl font-bold text-[#0B152A] mt-8 mb-4">What Is Business Acquisition?</h2>
        <p className="text-slate-600 mb-6 leading-relaxed text-lg">Business acquisition is the strategic purchase of an existing company. In the digital space, this means acquiring cash-flowing assets like SaaS platforms, e-commerce brands, or content portfolios to instantly gain market share, technology, and customers.</p>
        
        <h2 className="text-2xl font-bold text-[#0B152A] mt-8 mb-4">Why Acquire an Existing Business?</h2>
        <p className="text-slate-600 mb-6 leading-relaxed text-lg">Acquiring an existing business allows you to bypass the highest-risk phase of entrepreneurship: finding product-market fit. By buying a proven concept on InfyBuys, you acquire historical data, existing cash flow, and a customer base that you can immediately begin optimizing.</p>
        
        <h2 className="text-2xl font-bold text-[#0B152A] mt-8 mb-4">What Buyers Should Evaluate</h2>
        <p className="text-slate-600 mb-6 leading-relaxed text-lg">Smart buyers look for alignment between the business's needs and their own skill sets. If you are a marketer, acquiring a business with a great product but poor marketing is an ideal match. Always evaluate the "moat"—what protects this business from competitors?</p>
        
        <h2 className="text-2xl font-bold text-[#0B152A] mt-8 mb-4">Revenue and Profitability</h2>
        <p className="text-slate-600 mb-6 leading-relaxed text-lg">Consistency is key. A business with flat but highly predictable revenue is often less risky than one with erratic spikes. Analyze the gross margins to ensure there is enough room for marketing and operational expenses as you scale.</p>
        
        <h2 className="text-2xl font-bold text-[#0B152A] mt-8 mb-4">Growth Potential</h2>
        <p className="text-slate-600 mb-6 leading-relaxed text-lg">Look for low-hanging fruit. Are there obvious SEO improvements? Can the pricing model be optimized? Are there untapped marketing channels (like paid social or email marketing) that the current owner hasn't explored?</p>
        
        <h2 className="text-2xl font-bold text-[#0B152A] mt-8 mb-4">Acquisition Process</h2>
        <p className="text-slate-600 mb-6 leading-relaxed text-lg">The standard process involves deal discovery on a marketplace like InfyBuys, signing an NDA, reviewing the prospectus, submitting a Letter of Intent (LOI), conducting due diligence, drafting the Asset Purchase Agreement (APA), and finally, the transfer of assets through escrow.</p>
        
        <h2 className="text-2xl font-bold text-[#0B152A] mt-8 mb-4">Common Risks</h2>
        <p className="text-slate-600 mb-6 leading-relaxed text-lg">Platform risk (heavy reliance on a single traffic source like Google or a single sales channel like Amazon), key-person risk (the business relies too heavily on the founder), and technological debt are some of the most common pitfalls buyers must navigate.</p>

        {/* Additional Content */}
        <h2 className="text-2xl font-bold text-[#0B152A] mt-10 mb-4">Common Mistakes to Avoid</h2>
        <ul className="list-disc pl-6 text-slate-600 mb-6 space-y-2 text-lg">
          <li><strong>Falling in love with the deal:</strong> Always remain objective. If the due diligence uncovers critical flaws, be prepared to walk away.</li>
          <li><strong>Ignoring the culture:</strong> For larger digital agencies or SaaS teams, failing to mesh with the existing employees or contractors can lead to high turnover post-acquisition.</li>
          <li><strong>Over-leveraging:</strong> Taking on too much debt to finance the acquisition leaves no room for operational errors or sudden market shifts.</li>
        </ul>

        <h2 className="text-2xl font-bold text-[#0B152A] mt-8 mb-4">Practical Tips for Buyers</h2>
        <p className="text-slate-600 mb-6 leading-relaxed text-lg">Create a specialized acquisition thesis before you start browsing. Knowing exactly what niche, business model, and price range you are looking for will prevent you from getting distracted by shiny, unrelated opportunities.</p>

        <div className="bg-[#f8fafc] border border-slate-200 rounded-2xl p-6 mt-8">
          <h3 className="text-xl font-bold text-[#0B4C8C] mb-3">How InfyBuys Can Help</h3>
          <p className="text-slate-600 leading-relaxed">Our curated marketplace is designed to match serious buyers with high-quality, cash-flowing businesses. InfyBuys provides deep analytics, standardized metrics, and direct access to sellers to ensure your acquisition journey is transparent and successful.</p>
        </div>
      </>
    )
  },
  b4: {
    heroHeading: 'Understanding Digital Assets and Acquisition Opportunities',
    heroDescription: 'Learn how digital real estate—from SaaS products to media sites—is transforming the modern investment landscape.',
    heroImage: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072',
    content: (
      <>
        <h2 className="text-2xl font-bold text-[#0B152A] mt-8 mb-4">What Are Digital Assets?</h2>
        <p className="text-slate-600 mb-6 leading-relaxed text-lg">Digital assets are intangible properties that hold value and generate revenue entirely online. Unlike physical real estate, digital assets have lower overhead, global reach, and the ability to scale rapidly, making them highly attractive to modern investors.</p>
        
        <h2 className="text-2xl font-bold text-[#0B152A] mt-8 mb-4">Types of Digital Assets</h2>
        <p className="text-slate-600 mb-6 leading-relaxed text-lg">The digital asset ecosystem is diverse. It ranges from simple content blogs monetized via display ads to complex, enterprise-level software platforms. Each type requires a different operational approach and carries a unique risk profile.</p>
        
        <h2 className="text-2xl font-bold text-[#0B152A] mt-8 mb-4">SaaS Businesses</h2>
        <p className="text-slate-600 mb-6 leading-relaxed text-lg">Software-as-a-Service is the crown jewel of digital assets due to its recurring revenue model. SaaS businesses offer high margins and predictability, making them some of the most sought-after listings on the InfyBuys marketplace.</p>
        
        <h2 className="text-2xl font-bold text-[#0B152A] mt-8 mb-4">Websites and Online Platforms</h2>
        <p className="text-slate-600 mb-6 leading-relaxed text-lg">Content sites, review platforms, and niche communities generate revenue through advertising, sponsorships, and affiliate marketing. Their value is directly tied to their organic search authority and audience engagement.</p>
        
        <h2 className="text-2xl font-bold text-[#0B152A] mt-8 mb-4">E-Commerce Businesses</h2>
        <p className="text-slate-600 mb-6 leading-relaxed text-lg">E-commerce includes dropshipping, Amazon FBA, and direct-to-consumer (DTC) brands. While they involve physical products, the brand, customer list, and digital storefront are the core digital assets being acquired.</p>
        
        <h2 className="text-2xl font-bold text-[#0B152A] mt-8 mb-4">Digital Asset Valuation</h2>
        <p className="text-slate-600 mb-6 leading-relaxed text-lg">Valuations are driven by the quality and consistency of the revenue. Digital assets are typically valued using a multiple of their monthly or annual net profit. A highly automated digital asset will command a much higher multiple than one requiring intensive manual labor.</p>
        
        <h2 className="text-2xl font-bold text-[#0B152A] mt-8 mb-4">Acquisition Opportunities</h2>
        <p className="text-slate-600 mb-6 leading-relaxed text-lg">The market for buying and selling digital assets is maturing rapidly. Platforms like InfyBuys provide liquidity, allowing founders to exit and investors to deploy capital into high-yield digital properties rather than traditional markets.</p>
        
        <h2 className="text-2xl font-bold text-[#0B152A] mt-8 mb-4">Risks and Considerations</h2>
        <p className="text-slate-600 mb-6 leading-relaxed text-lg">Digital assets are subject to rapid technological changes, algorithm updates, and shifting consumer behavior. Diversification and a deep understanding of the specific asset's technical foundation are essential for mitigating risk.</p>

        {/* Additional Content */}
        <h2 className="text-2xl font-bold text-[#0B152A] mt-10 mb-4">Key Takeaways</h2>
        <ul className="list-disc pl-6 text-slate-600 mb-6 space-y-2 text-lg">
          <li>Digital assets offer significantly higher yields and flexibility compared to traditional physical real estate.</li>
          <li>Understanding the specific monetization model (SaaS vs. E-commerce vs. Ad-driven) is crucial for accurate valuation.</li>
          <li>Properly vetting the technology stack is just as important as verifying the financials.</li>
        </ul>

        <h2 className="text-2xl font-bold text-[#0B152A] mt-8 mb-4">What Buyers Should Know</h2>
        <p className="text-slate-600 mb-6 leading-relaxed text-lg">Not all revenue is created equal. A digital asset generating $10k/month via highly defensible B2B SaaS subscriptions is fundamentally more valuable and secure than an asset making $10k/month from a viral, short-lived social media trend.</p>

        <div className="bg-[#f8fafc] border border-slate-200 rounded-2xl p-6 mt-8">
          <h3 className="text-xl font-bold text-[#0B4C8C] mb-3">How InfyBuys Can Help</h3>
          <p className="text-slate-600 leading-relaxed">Whether you're looking to acquire your first content site or add a major enterprise SaaS to your portfolio, InfyBuys categorized marketplace makes discovering and evaluating premium digital assets simpler and more secure.</p>
        </div>
      </>
    )
  },
  b5: {
    heroHeading: 'Everything Buyers Should Know About Due Diligence',
    heroDescription: 'A practical framework for verifying financials, uncovering operational risks, and buying with confidence.',
    heroImage: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?q=80&w=2070',
    content: (
      <>
        <h2 className="text-2xl font-bold text-[#0B152A] mt-8 mb-4">What Is Due Diligence?</h2>
        <p className="text-slate-600 mb-6 leading-relaxed text-lg">Due diligence is the comprehensive appraisal of a business undertaken by a prospective buyer to establish its assets and liabilities and evaluate its commercial potential. It is the crucial "trust but verify" phase of any acquisition on InfyBuys.</p>
        
        <h2 className="text-2xl font-bold text-[#0B152A] mt-8 mb-4">Financial Due Diligence</h2>
        <p className="text-slate-600 mb-6 leading-relaxed text-lg">This is the foundation of the process. Buyers must reconstruct the Profit and Loss (P&L) statement by tying bank deposits directly to the payment processor statements (Stripe, PayPal, Shopify). Ensure all expenses, including software tools and hosting, are accounted for.</p>
        
        <h2 className="text-2xl font-bold text-[#0B152A] mt-8 mb-4">Revenue Verification</h2>
        <p className="text-slate-600 mb-6 leading-relaxed text-lg">Never take stated revenue at face value. Request read-only access to the business's payment processors and banking dashboards. Verify that the revenue is coming from genuine customers and that there are no abnormal refund or chargeback rates.</p>
        
        <h2 className="text-2xl font-bold text-[#0B152A] mt-8 mb-4">Customer and Traffic Analysis</h2>
        <p className="text-slate-600 mb-6 leading-relaxed text-lg">For SaaS and e-commerce, analyze cohort data to understand customer retention and Lifetime Value (LTV). For content sites, request read-only access to Google Analytics to verify traffic sources, geographic distribution, and engagement metrics.</p>
        
        <h2 className="text-2xl font-bold text-[#0B152A] mt-8 mb-4">Operational Review</h2>
        <p className="text-slate-600 mb-6 leading-relaxed text-lg">Understand the day-to-day operations. How many hours does the owner actually work? Are there documented Standard Operating Procedures (SOPs)? Review vendor contracts, employee/contractor agreements, and customer support ticket volume.</p>
        
        <h2 className="text-2xl font-bold text-[#0B152A] mt-8 mb-4">Technical Due Diligence</h2>
        <p className="text-slate-600 mb-6 leading-relaxed text-lg">For software businesses, a code review is highly recommended. Assess the technical debt, scalability of the architecture, security practices, and third-party dependencies. Ensure the codebase is fully owned by the seller and not tangled in licensing issues.</p>
        
        <h2 className="text-2xl font-bold text-[#0B152A] mt-8 mb-4">Legal Considerations</h2>
        <p className="text-slate-600 mb-6 leading-relaxed text-lg">Verify corporate structuring, intellectual property ownership (trademarks, domain names, copyrights), and ensure there is no pending litigation against the company. A clean legal slate is non-negotiable.</p>
        
        <h2 className="text-2xl font-bold text-[#0B152A] mt-8 mb-4">Common Red Flags</h2>
        <p className="text-slate-600 mb-6 leading-relaxed text-lg">Watch out for declining traffic trends hidden by recent paid spikes, unrecorded personal expenses that artificially inflate profit, heavily concentrated customer bases, or sellers who are hesitant to share live screen-shares of their dashboards.</p>

        {/* Additional Content */}
        <h2 className="text-2xl font-bold text-[#0B152A] mt-10 mb-4">Important Things to Consider</h2>
        <p className="text-slate-600 mb-6 leading-relaxed text-lg">Do not rush the due diligence period. A standard timeframe is 14 to 30 days depending on the size of the business. If a seller is aggressively pushing you to skip diligence checks, this is a major warning sign.</p>

        <h2 className="text-2xl font-bold text-[#0B152A] mt-8 mb-4">Practical Tips</h2>
        <ul className="list-disc pl-6 text-slate-600 mb-6 space-y-2 text-lg">
          <li><strong>Use video calls:</strong> Always have the seller log into their Stripe and Google Analytics accounts live on a Zoom screen share to prevent doctored screenshots.</li>
          <li><strong>Hire an expert:</strong> If you are buying a SaaS but aren't a developer, hire a third-party CTO to conduct the technical code review.</li>
          <li><strong>Audit customer support:</strong> Read through the last 50 support tickets to see exactly what customers are complaining about—it reveals the true state of the product.</li>
        </ul>

        <div className="bg-[#f8fafc] border border-slate-200 rounded-2xl p-6 mt-8">
          <h3 className="text-xl font-bold text-[#0B4C8C] mb-3">How InfyBuys Can Help</h3>
          <p className="text-slate-600 leading-relaxed">We require initial vetting for all listings before they go live, ensuring a baseline of quality. Additionally, our platform securely manages the document exchange process, making it easy for buyers and sellers to share sensitive financials and contracts during due diligence.</p>
        </div>
      </>
    )
  },
  b6: {
    heroHeading: 'How to Prepare Your Business for a Successful Sale',
    heroDescription: 'Learn how to optimize your operations, organize your financials, and maximize your valuation before going to market.',
    heroImage: 'https://images.unsplash.com/photo-1556761175-5973dc0f32d7?q=80&w=2070',
    content: (
      <>
        <h2 className="text-2xl font-bold text-[#0B152A] mt-8 mb-4">When Should You Sell?</h2>
        <p className="text-slate-600 mb-6 leading-relaxed text-lg">The best time to sell is when your business is growing and you have at least 12 to 24 months of clean, consistent financial history. Selling during a downward trend will significantly hurt your valuation. Capitalize on momentum.</p>
        
        <h2 className="text-2xl font-bold text-[#0B152A] mt-8 mb-4">Preparing Your Business for Sale</h2>
        <p className="text-slate-600 mb-6 leading-relaxed text-lg">Preparation should begin 6 to 12 months before listing on InfyBuys. This period is used to systematize operations, untangle personal expenses from business accounts, and ensure the business can run independently of the founder.</p>
        
        <h2 className="text-2xl font-bold text-[#0B152A] mt-8 mb-4">Organizing Financial Records</h2>
        <p className="text-slate-600 mb-6 leading-relaxed text-lg">Clean bookkeeping is the fastest way to build buyer trust. Use professional accounting software (like Xero or QuickBooks). Ensure your P&L statement accurately reflects the business's cash flow and clearly outlines any necessary add-backs.</p>
        
        <h2 className="text-2xl font-bold text-[#0B152A] mt-8 mb-4">Improving Business Metrics</h2>
        <p className="text-slate-600 mb-6 leading-relaxed text-lg">Before listing, focus on improving key valuation drivers. Reduce churn, optimize your pricing, negotiate better rates with suppliers, and diversify your traffic sources. Even marginal improvements can result in a substantially higher sale price.</p>
        
        <h2 className="text-2xl font-bold text-[#0B152A] mt-8 mb-4">Preparing Documentation</h2>
        <p className="text-slate-600 mb-6 leading-relaxed text-lg">Create a comprehensive prospectus or "deal book." This should include Standard Operating Procedures (SOPs), an organizational chart, a detailed overview of the tech stack, and a growth roadmap outlining opportunities the new buyer can pursue.</p>
        
        <h2 className="text-2xl font-bold text-[#0B152A] mt-8 mb-4">Finding the Right Buyers</h2>
        <p className="text-slate-600 mb-6 leading-relaxed text-lg">Listing your business on a premium marketplace like InfyBuys exposes your asset to a vast network of vetted, serious acquirers. Professional buyers appreciate well-prepared listings and move quickly when the data is presented clearly.</p>
        
        <h2 className="text-2xl font-bold text-[#0B152A] mt-8 mb-4">Listing Your Business</h2>
        <p className="text-slate-600 mb-6 leading-relaxed text-lg">When creating your listing, be transparent. Highlight the business's strengths, but be upfront about its weaknesses and challenges. Buyers appreciate honesty, and hiding issues will only cause deals to fall apart during due diligence.</p>
        
        <h2 className="text-2xl font-bold text-[#0B152A] mt-8 mb-4">Preparing for Negotiation</h2>
        <p className="text-slate-600 mb-6 leading-relaxed text-lg">Understand your absolute bottom line and your preferred deal structure before entering negotiations. Be prepared to discuss training and transition periods, seller financing, and potential earn-out structures to facilitate a successful closing.</p>

        {/* Additional Content */}
        <h2 className="text-2xl font-bold text-[#0B152A] mt-10 mb-4">What Sellers Should Know</h2>
        <p className="text-slate-600 mb-6 leading-relaxed text-lg">The buyer is not just buying your past revenue; they are buying the future stability of the business. Be prepared to prove that the business can survive and thrive after you leave. The more organized you are, the higher the multiple you can command.</p>

        <h2 className="text-2xl font-bold text-[#0B152A] mt-8 mb-4">Common Mistakes to Avoid</h2>
        <ul className="list-disc pl-6 text-slate-600 mb-6 space-y-2 text-lg">
          <li><strong>Co-mingling funds:</strong> Mixing personal and business expenses makes due diligence a nightmare and lowers buyer confidence.</li>
          <li><strong>Checking out early:</strong> Don't stop running the business during the sale process. If revenue drops while you are negotiating, the deal will likely fall through.</li>
          <li><strong>Hiding bad news:</strong> Disclose problems early. If a buyer discovers a major issue late in due diligence, they will assume there are more hidden problems and walk away.</li>
        </ul>

        <div className="bg-[#f8fafc] border border-slate-200 rounded-2xl p-6 mt-8">
          <h3 className="text-xl font-bold text-[#0B4C8C] mb-3">How InfyBuys Can Help</h3>
          <p className="text-slate-600 leading-relaxed">Selling your business on InfyBuys gives you access to a massive pool of qualified investors, significantly increasing the likelihood of multiple offers. Our guided listing process ensures your business is presented professionally to maximize your exit value.</p>
        </div>
      </>
    )
  }
};
