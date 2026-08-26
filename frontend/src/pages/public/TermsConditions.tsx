import { LegalLayout } from '@/components/layout/public/LegalLayout';

export default function TermsConditions() {
  return (
    <LegalLayout
      title="Terms & Conditions"
      description="Read the terms and conditions governing your use of the InfyBuys platform."
      lastUpdated="August 1, 2026"
    >
      <h2>1. Acceptance of Terms</h2>
      <p>
        By accessing or using the InfyBuys platform, you agree to be bound by these Terms and Conditions and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using or accessing this site.
      </p>

      <h2>2. Use License</h2>
      <p>
        Permission is granted to temporarily download one copy of the materials (information or software) on InfyBuys's website for personal, non-commercial transitory viewing only.
      </p>
      <p>
        This is the grant of a license, not a transfer of title, and under this license you may not:
      </p>
      <ul>
        <li>Modify or copy the materials</li>
        <li>Use the materials for any commercial purpose</li>
        <li>Attempt to decompile or reverse engineer any software contained on the website</li>
        <li>Remove any copyright or other proprietary notations from the materials</li>
      </ul>

      <h2>3. Marketplace Rules</h2>
      <p>
        Users participating in the marketplace agree to provide accurate, current, and complete information. Sellers must not misrepresent financial data or traffic metrics. Buyers must respect the confidentiality of all listings and adhere strictly to any signed Non-Disclosure Agreements (NDAs).
      </p>

      <h2>4. Limitation of Liability</h2>
      <p>
        In no event shall InfyBuys or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on InfyBuys's website.
      </p>
    </LegalLayout>
  );
}
