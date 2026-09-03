export const CATEGORIES = [
  { id: '1', name: 'SaaS', icon: 'Cloud', description: 'Software-as-a-Service businesses with recurring revenue models.' },
  { id: '2', name: 'E-Commerce', icon: 'ShoppingCart', description: 'Online stores and D2C brands with physical or digital products.' },
  { id: '3', name: 'Agencies', icon: 'Briefcase', description: 'Service-based digital marketing, design, and development firms.' },
  { id: '4', name: 'Marketplaces', icon: 'Store', description: 'Platforms connecting buyers and sellers for various niches.' },
  { id: '5', name: 'Content Sites', icon: 'FileText', description: 'Blogs, newsletters, and media properties with established traffic.' },
  { id: '6', name: 'Mobile Apps', icon: 'Smartphone', description: 'iOS and Android applications with active user bases.' },
];

export const PRICING = {
  plans: [
    {
      name: 'Buyer Plan',
      price: 'Free',
      period: 'Forever',
      description: 'Essential tools for discovering your next acquisition.',
      isPopular: false,
      ctaText: 'Get Started',
      features: [
        'Browse Verified Businesses',
        'Access Business Listings',
        'Save Opportunities',
        'Basic Business Insights',
        'Buyer Support'
      ]
    },
    {
      name: 'Professional Plan',
      price: '$49',
      period: 'per month',
      description: 'Advanced features and priority access for serious acquirers.',
      isPopular: true,
      ctaText: 'Upgrade to Pro',
      features: [
        'Everything in Buyer',
        'Advanced Business Insights',
        'Priority Opportunity Access',
        'Detailed Listing Information',
        'Buyer Advisory Support',
        'Priority Assistance'
      ]
    },
    {
      name: 'Business Plan',
      price: '$199',
      period: 'per month',
      description: 'Complete marketplace access with premium visibility and support.',
      isPopular: false,
      ctaText: 'Contact Sales',
      features: [
        'Everything in Professional',
        'Premium Business Visibility',
        'Advanced Listing Tools',
        'Seller Analytics',
        'Dedicated Advisory Support',
        'Priority Listing Assistance'
      ]
    }
  ],
  comparison: [
    { feature: 'Browse Verified Businesses', buyer: true, professional: true, business: true },
    { feature: 'Save Opportunities', buyer: true, professional: true, business: true },
    { feature: 'Basic Business Insights', buyer: true, professional: true, business: true },
    { feature: 'Advanced Business Insights', buyer: false, professional: true, business: true },
    { feature: 'Priority Opportunity Access', buyer: false, professional: true, business: true },
    { feature: 'Buyer Advisory Support', buyer: false, professional: true, business: true },
    { feature: 'Premium Business Visibility', buyer: false, professional: false, business: true },
    { feature: 'Seller Analytics', buyer: false, professional: false, business: true },
    { feature: 'Dedicated Advisory Support', buyer: false, professional: false, business: true },
  ]
};

export const FAQS = [
  {
    question: 'How much does it cost to list my business?',
    answer: 'Listing on InfyBuys is completely free. We only charge a success fee when your business successfully sells through our platform. Our standard fee is 8% for deals under $1M, and drops progressively for larger deals.'
  },
  {
    question: 'How do you verify buyers?',
    answer: 'All buyers must complete our verification process, which includes identity verification (KYC), proof of funds, and a signed platform-wide Non-Disclosure Agreement (NDA) before they can access confidential listing details.'
  },
  {
    question: 'What is the average time to sell?',
    answer: 'While it varies by business model and price point, our average time from listing to closing is 65 days. Well-priced businesses with clean financials often receive offers within the first 14 days.'
  },
  {
    question: 'Is my data secure and confidential?',
    answer: 'Yes. Public listings hide sensitive identifying information. Financial details and URLs are only revealed to verified buyers who have agreed to an NDA and have been approved by you.'
  }
];

export const BLOG_POSTS = [
  {
    id: 'b1',
    title: 'How to Value a SaaS Business in 2026',
    excerpt: 'Multiples have shifted. Learn the new framework for calculating the true worth of your recurring revenue business.',
    category: 'Valuation',
    author: 'Elena Rodriguez',
    date: 'Aug 5, 2026',
    readTime: '6 min read',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070',
    isFeatured: true
  },
  {
    id: 'b2',
    title: 'The Ultimate Due Diligence Checklist',
    excerpt: 'Don\'t buy a business without checking these 50 critical items first.',
    category: 'Acquisition',
    author: 'David Chen',
    date: 'Jul 28, 2026',
    readTime: '12 min read',
    image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=2070',
  },
  {
    id: 'b3',
    title: 'What to Look for When Buying an Online Business',
    excerpt: 'Key factors buyers should evaluate before acquiring an online business, from revenue quality and growth potential to operations and risk.',
    category: 'Business Acquisition',
    author: 'Marcus Vance',
    date: 'Jul 15, 2026',
    readTime: '8 min read',
    image: 'https://images.unsplash.com/photo-1664575602276-acd073f104c1?q=80&w=2070'
  },
  {
    id: 'b4',
    title: 'Why Digital Assets Are Becoming Valuable Acquisition Opportunities',
    excerpt: 'Explore how websites, SaaS products, e-commerce stores, and other digital assets can create attractive opportunities for buyers.',
    category: 'Digital Assets',
    author: 'Sarah Jenkins',
    date: 'Jul 02, 2026',
    readTime: '7 min read',
    image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072'
  },
  {
    id: 'b5',
    title: 'A Practical Guide to Business Due Diligence',
    excerpt: 'Understand the essential financial, operational, technical, and market checks to complete before acquiring a business.',
    category: 'Due Diligence',
    author: 'David Chen',
    date: 'Jun 22, 2026',
    readTime: '15 min read',
    image: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?q=80&w=2070'
  },
  {
    id: 'b6',
    title: 'How to Prepare Your Business for a Successful Sale',
    excerpt: 'Learn how founders can organize their financials, operations, documentation, and business metrics before listing an online business for sale.',
    category: 'Selling a Business',
    author: 'Elena Rodriguez',
    date: 'Jun 10, 2026',
    readTime: '10 min read',
    image: 'https://images.unsplash.com/photo-1556761175-5973dc0f32d7?q=80&w=2070'
  }
];

export const STATS = [
  { value: '$200M+', label: 'Total Transaction Volume' },
  { value: '3,500+', label: 'Registered Buyers' },
  { value: '850+', label: 'Businesses Sold' },
  { value: '98%', label: 'Closing Success Rate' },
];
