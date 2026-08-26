export const CATEGORIES = [
  { id: '1', name: 'SaaS', icon: 'Cloud' },
  { id: '2', name: 'E-Commerce', icon: 'ShoppingCart' },
  { id: '3', name: 'Agencies', icon: 'Briefcase' },
  { id: '4', name: 'Marketplaces', icon: 'Store' },
  { id: '5', name: 'Content Sites', icon: 'FileText' },
  { id: '6', name: 'Mobile Apps', icon: 'Smartphone' },
];

export const PRICING = {
  seller: [
    { range: 'Under $1M', fee: '8%', description: 'Standard success fee' },
    { range: '$1M - $5M', fee: '6%', description: 'Reduced tier for mid-market' },
    { range: 'Over $5M', fee: '4%', description: 'Enterprise acquisition rate' }
  ],
  buyer: [
    { plan: 'Basic Buyer', price: 'Free', features: ['Browse public listings', 'Basic filters', 'Standard support'] },
    { plan: 'Premium Buyer', price: '$49/mo', features: ['Access locked financials (subject to NDA)', 'Advanced search & alerts', 'Priority support', 'Due diligence tools'], isPopular: true }
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
  }
];

export const STATS = [
  { value: '$200M+', label: 'Total Transaction Volume' },
  { value: '3,500+', label: 'Registered Buyers' },
  { value: '850+', label: 'Businesses Sold' },
  { value: '98%', label: 'Closing Success Rate' },
];
