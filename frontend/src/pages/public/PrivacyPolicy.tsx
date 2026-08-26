import { LegalLayout } from '@/components/layout/public/LegalLayout';

export default function PrivacyPolicy() {
  return (
    <LegalLayout
      title="Privacy Policy"
      description="Learn how InfyBuys collects, uses, and protects your personal information."
      lastUpdated="August 1, 2026"
    >
      <h2>1. Introduction</h2>
      <p>
        At InfyBuys, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website or use our marketplace platform.
      </p>

      <h2>2. Information We Collect</h2>
      <p>
        We collect information that you provide directly to us when you register for an account, create a listing, communicate with other users, or contact customer support. This may include:
      </p>
      <ul>
        <li>Name and contact data</li>
        <li>Credentials and security data</li>
        <li>Payment information (processed by secure third-party providers)</li>
        <li>Business and financial metrics (if you are a seller)</li>
      </ul>

      <h2>3. How We Use Your Information</h2>
      <p>
        We use the information we collect to operate, maintain, and provide the features and functionality of the marketplace, including:
      </p>
      <ul>
        <li>Verifying user identity and preventing fraud</li>
        <li>Facilitating communications between buyers and sellers</li>
        <li>Processing transactions and escrow services</li>
        <li>Improving our platform algorithms and user experience</li>
      </ul>

      <h2>4. Data Security</h2>
      <p>
        We use administrative, technical, and physical security measures to help protect your personal information. While we have taken reasonable steps to secure the personal information you provide to us, please be aware that despite our efforts, no security measures are perfect or impenetrable.
      </p>
    </LegalLayout>
  );
}
