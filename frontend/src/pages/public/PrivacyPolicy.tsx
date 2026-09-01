import { Seo } from '@/components/shared/Seo';

export default function PrivacyPolicy() {
  return (
    <>
      <Seo
        title="Privacy Policy - InfyBuys"
        description="Learn how InfyBuys collects, uses, protects, and manages information when you use our digital business marketplace."
      />

      {/* Hero Section */}
      <section className="relative w-full min-h-[400px] lg:min-h-[500px] flex items-center justify-center pt-32 pb-16 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1563986768494-4dee2763ff3f?q=80&w=2070" 
            alt="Data privacy and security" 
            className="w-full h-full object-cover"
          />
        </div>
        <div className="absolute inset-0 z-10 bg-gradient-to-br from-white/95 via-white/85 to-[#0B4C8C]/10"></div>
        <div className="container relative z-20 mx-auto px-4 text-center max-w-4xl">
          <div className="flex flex-col items-center">
            <span className="text-[#0B4C8C] font-extrabold tracking-widest text-xs md:text-sm uppercase mb-4 px-4 py-1.5 bg-[#0B4C8C]/10 rounded-full">
              INFYBUYS PRIVACY
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-[#0B152A] tracking-tight leading-[1.15] mb-6">
              Privacy Policy
            </h1>
            <p className="text-lg md:text-xl text-slate-700 leading-relaxed max-w-2xl">
              Learn how InfyBuys collects, uses, protects, and manages information when you use our digital business marketplace.
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
                At InfyBuys, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website or use our digital business marketplace platform.
              </p>

              <h2 className="text-2xl">2. Information We Collect</h2>
              <p>
                We collect information that you provide directly to us when you register for an account, create a listing, communicate with other users, or contact customer support. This may include:
              </p>
              <ul>
                <li><strong>Account and profile information:</strong> Name, contact data, credentials, and security data.</li>
                <li><strong>Contact information:</strong> Email addresses and phone numbers used for communication.</li>
                <li><strong>Listing information:</strong> Business details, traffic metrics, and financial information you choose to provide when creating a business listing.</li>
                <li><strong>Business information:</strong> Verification details required to operate as a buyer or seller on the marketplace.</li>
                <li><strong>Communication/support information:</strong> Records of your enquiries, support tickets, and direct communications.</li>
                <li><strong>Device and browser information:</strong> Data automatically collected regarding how you access the platform.</li>
                <li><strong>Usage and analytics information:</strong> How you navigate the platform, search for digital assets, and interact with features.</li>
                <li><strong>Payment information:</strong> Processed directly by secure third-party payment providers.</li>
              </ul>

              <h2 className="text-2xl">3. How We Use Information</h2>
              <p>
                We use the information we collect to operate, maintain, and provide the features and functionality of the marketplace, including:
              </p>
              <ul>
                <li>Operating the digital business marketplace and ensuring its stability.</li>
                <li>Managing user accounts and verifying user identity to prevent fraud.</li>
                <li>Publishing and managing business listings submitted by sellers.</li>
                <li>Connecting buyers and sellers and facilitating secure communications between them.</li>
                <li>Processing transactions, escrow services, and marketplace fees.</li>
                <li>Responding to enquiries, providing customer support, and addressing user issues.</li>
                <li>Improving website functionality, algorithms, and overall user experience.</li>
                <li>Providing security, preventing misuse, and maintaining a trusted marketplace environment.</li>
                <li>Sending important service communications, transactional emails, and marketplace updates.</li>
              </ul>

              <h2 className="text-2xl">4. Business Listing Information</h2>
              <p>
                When you create a business listing on InfyBuys, the information you submit (such as business descriptions, asking price, and provided metrics) may be displayed publicly on our marketplace or shared securely with verified buyers when necessary to facilitate the operation of the marketplace and connect you with potential acquirers.
              </p>

              <h2 className="text-2xl">5. Communications</h2>
              <p>
                As part of using the InfyBuys platform, you may receive service-related communications, enquiries from other users regarding listings, notifications about your account status, or important marketplace updates. You can manage certain communication preferences within your account settings.
              </p>

              <h2 className="text-2xl">6. Cookies and Tracking Technologies</h2>
              <p>
                We use cookies and similar tracking technologies to track the activity on our platform and hold certain information. Cookies are files with a small amount of data which may include an anonymous unique identifier. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent.
              </p>

              <h2 className="text-2xl">7. How We Share Information</h2>
              <p>
                We may share your information with third-party service providers that perform services on our behalf, such as payment processing, data analysis, email delivery, hosting services, and customer service. We may also share information to comply with legal obligations or to protect the rights and safety of our platform and users.
              </p>

              <h2 className="text-2xl">8. Data Security</h2>
              <p>
                We use reasonable administrative, technical, and organizational security safeguards to help protect your personal information against unauthorized access, alteration, disclosure, or destruction. While we have taken reasonable steps to secure the personal information you provide to us, please be aware that despite our efforts, no security measures over the Internet are perfect or impenetrable.
              </p>

              <h2 className="text-2xl">9. Data Retention</h2>
              <p>
                We will retain your personal information only for as long as is reasonably necessary for legitimate business, legal, security, and operational purposes as set out in this Privacy Policy. We will retain and use your information to the extent necessary to comply with our legal obligations, resolve disputes, and enforce our policies.
              </p>

              <h2 className="text-2xl">10. User Rights and Choices</h2>
              <p>
                You may review, change, or terminate your account at any time. Depending on your location and subject to applicable legal requirements, you may also have specific rights regarding your personal data, including the right to request access to, correction of, or deletion of the personal information we hold about you.
              </p>

              <h2 className="text-2xl">11. International Data Handling</h2>
              <p>
                Because InfyBuys operates a digital marketplace, your information may be processed, stored, or transferred in locations outside your region. In such cases, we ensure that your data is handled securely and in accordance with applicable data protection laws.
              </p>

              <h2 className="text-2xl">12. Third-Party Services and Links</h2>
              <p>
                InfyBuys may use trusted third-party providers for services such as hosting, analytics, communications, payments, or other operational functions. Additionally, our platform may contain links to third-party websites. We have no control over, and assume no responsibility for, the content, privacy policies, or practices of any third-party websites or services.
              </p>

              <h2 className="text-2xl">13. Children's Privacy</h2>
              <p>
                Our marketplace is not intended for use by children under the age of 18. We do not knowingly collect personally identifiable information from children under 18. If we become aware that we have collected personal data from anyone under the age of 18 without verification of parental consent, we take steps to remove that information from our servers.
              </p>

              <h2 className="text-2xl">14. Policy Updates</h2>
              <p>
                We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last Updated" date at the top of this policy.
              </p>

              <h2 className="text-2xl">15. Contact and Privacy Requests</h2>
              <p>
                If you have any questions, suggestions, or requests regarding this Privacy Policy or our data practices, please do not hesitate to contact our privacy team directly through our Contact Us page.
              </p>

            </div>
          </div>
        </div>
      </section>
    </>
  );
}
