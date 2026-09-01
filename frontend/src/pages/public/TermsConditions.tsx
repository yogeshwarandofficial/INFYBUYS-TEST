import { Seo } from '@/components/shared/Seo';

export default function TermsConditions() {
  return (
    <>
      <Seo
        title="Terms of Service - InfyBuys"
        description="Understand the terms and conditions that govern your use of the InfyBuys digital business marketplace."
      />

      {/* Hero Section */}
      <section className="relative w-full min-h-[400px] lg:min-h-[600px] flex items-center justify-center pt-32 pb-16 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=2071" 
            alt="Business agreements and contracts" 
            className="w-full h-full object-cover"
          />
        </div>
        <div className="absolute inset-0 z-10 bg-gradient-to-br from-white/95 via-white/85 to-[#0B4C8C]/10"></div>
        <div className="container relative z-20 mx-auto px-4 text-center max-w-4xl">
          <div className="flex flex-col items-center">
            <span className="text-[#0B4C8C] font-extrabold tracking-widest text-xs md:text-sm uppercase mb-4 px-4 py-1.5 bg-[#0B4C8C]/10 rounded-full">
              INFYBUYS TERMS
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-[#0B152A] tracking-tight leading-[1.15] mb-6">
              Terms of Service
            </h1>
            <p className="text-lg md:text-xl text-slate-700 leading-relaxed max-w-2xl">
              Understand the terms and conditions that govern your use of the InfyBuys digital business marketplace.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="bg-white rounded-2xl p-6 md:p-10 lg:p-12 border border-slate-200 shadow-sm text-left">
            <p className="text-xs md:text-sm font-semibold text-slate-500 mb-8 pb-4 border-b border-slate-100 text-left">
              Last Updated: August 1, 2026
            </p>

            <div className="text-left font-sans text-[#0B152A] opacity-100 [&_h2]:text-[#0B152A] md:[&_h2]:text-xl [&_h2]:text-lg [&_h2]:font-bold [&_h2]:mt-8 [&_h2]:mb-3 [&_h2]:opacity-100 [&_p]:text-[#0B152A] md:[&_p]:text-base [&_p]:text-sm [&_p]:leading-relaxed [&_p]:my-3 [&_p]:opacity-100 [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:my-3 [&_li]:text-[#0B152A] md:[&_li]:text-base [&_li]:text-sm [&_li]:mb-2 [&_li]:opacity-100 [&_a]:text-[#0B4C8C] hover:[&_a]:text-blue-600 [&_a]:opacity-100 [&_strong]:text-[#0B152A] [&_strong]:font-bold">
              
              <h2 className="text-2xl mt-0">1. Introduction</h2>
              <p>
                By accessing or using the InfyBuys platform, you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using or accessing this site.
              </p>

              <h2 className="text-2xl">2. User Accounts</h2>
              <p>
                You must be at least 18 years old to use the InfyBuys marketplace. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You agree to provide accurate, current, and complete information during the registration process and to keep your account information up to date.
              </p>

              <h2 className="text-2xl">3. Using the InfyBuys Marketplace</h2>
              <p>
                Permission is granted to temporarily download one copy of the materials on InfyBuys's website for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title.
              </p>

              <h2 className="text-2xl">4. Business Listings</h2>
              <p>
                Sellers and listing owners are solely responsible for the accuracy and completeness of their business listings. This includes ensuring the accuracy of pricing information, business descriptions, financial data, and keeping listings reasonably up to date. InfyBuys reserves the right to review, reject, or remove any listing that violates our policies or misrepresents financial data.
              </p>

              <h2 className="text-2xl">5. Buyer Responsibilities</h2>
              <p>
                Buyers are expected to act in good faith when engaging with sellers. Buyers must strictly respect the confidentiality of all listings and adhere to any signed Non-Disclosure Agreements (NDAs). Buyers must conduct their own evaluation and due diligence before making decisions involving a business or digital asset.
              </p>
              
              <h2 className="text-2xl">6. Seller Responsibilities</h2>
              <p>
                Sellers must provide accurate information and must not intentionally misrepresent a business, financial performance, ownership, assets, or material facts. Sellers are obligated to communicate honestly and fairly during all interactions with potential buyers.
              </p>

              <h2 className="text-2xl">7. Due Diligence</h2>
              <p>
                InfyBuys may provide marketplace tools, information, and advisory-related resources, but these do not replace independent verification. Users must independently verify all information, financial metrics, and operational claims before completing a transaction.
              </p>

              <h2 className="text-2xl">8. Advisory Services</h2>
              <p>
                InfyBuys may provide connections to advisory or third-party professional services to assist in the acquisition or sale process. The specific terms applicable to any professional or third-party service will be governed by separate agreements. Users should review those specific terms before engaging advisory services.
              </p>

              <h2 className="text-2xl">9. Transactions Between Users</h2>
              <p>
                Buyers and sellers are solely responsible for negotiating, structuring, and completing transactions according to their own agreements and applicable laws. InfyBuys is not a party to the actual transfer of business assets between users unless explicitly stated under a specific managed service agreement.
              </p>

              <h2 className="text-2xl">10. Payments and Fees</h2>
              <p>
                Certain features of the InfyBuys platform may be subject to fees. Applicable marketplace fees, advisory/service fees, and payment processing terms will be clearly displayed before purchase. Specific fees may depend on the relevant service utilized. All fees are stated in US Dollars and are non-refundable unless otherwise expressly noted in our refund policy.
              </p>

              <h2 className="text-2xl">11. Prohibited Content and Conduct</h2>
              <p>
                You may not use the platform for any illegal or unauthorized purpose. Prohibited activities include, but are not limited to: providing fraudulent information, creating misleading listings, unauthorized use of another person's information, attempts to manipulate marketplace activity, malicious activity, abuse of the platform, and illegal activities. You agree not to attempt to decompile, reverse engineer, or scrape any software or data contained on the website.
              </p>

              <h2 className="text-2xl">12. Intellectual Property</h2>
              <p>
                The InfyBuys website content, branding, design, platform materials, and its original features and functionality are owned by InfyBuys and may be protected by applicable international copyright, trademark, patent, trade secret, and other intellectual property or proprietary rights laws.
              </p>

              <h2 className="text-2xl">13. Third-Party Links and Services</h2>
              <p>
                Our platform may contain links to external websites or third-party services that are not owned or controlled by InfyBuys. These external websites or third-party services may have their own terms and policies. We assume no responsibility for the content, policies, or practices of any third-party sites or services.
              </p>

              <h2 className="text-2xl">14. Disclaimer</h2>
              <p>
                The materials on InfyBuys's website are provided on an 'as is' basis. Marketplace information should not automatically be treated as a guarantee of business performance, valuation, profitability, or transaction outcome. InfyBuys makes no warranties, expressed or implied, and hereby disclaims all other warranties including implied warranties of merchantability and fitness for a particular purpose.
              </p>

              <h2 className="text-2xl">15. Limitation of Liability</h2>
              <p>
                In no event shall InfyBuys or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on InfyBuys's website, even if InfyBuys or an authorized representative has been notified orally or in writing of the possibility of such damage.
              </p>

              <h2 className="text-2xl">16. Indemnification</h2>
              <p>
                You agree to defend, indemnify, and hold harmless InfyBuys, its affiliates, and their respective officers, directors, employees, and agents from and against any claims, liabilities, damages, losses, and expenses arising out of your access to or use of the platform.
              </p>

              <h2 className="text-2xl">17. Changes to Terms</h2>
              <p>
                InfyBuys may update or modify these Terms of Service from time to time at our sole discretion. Updated versions will be published on the website, and by continuing to access or use our platform after those revisions become effective, you agree to be bound by the revised terms.
              </p>

              <h2 className="text-2xl">18. Governing Law</h2>
              <p>
                These Terms shall be governed and construed in accordance with the laws of the applicable jurisdiction, without regard to its conflict of law provisions.
              </p>

              <h2 className="text-2xl">19. Contact</h2>
              <p>
                If you have any questions regarding these Terms, your responsibilities, or our policies, please contact us through our Contact Us page.
              </p>

            </div>
          </div>
        </div>
      </section>
    </>
  );
}
