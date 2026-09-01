import { LegalLayout } from '@/components/layout/public/LegalLayout';

export default function CookiePolicy() {
  return (
    <LegalLayout
      title="Cookie Policy"
      description="Information about how InfyBuys uses cookies and tracking technologies."
      lastUpdated="August 1, 2026"
    >
      <h2>1. What are Cookies?</h2>
      <p>
        Cookies are small text files that are placed on your computer or mobile device when you visit a website. They are widely used to make websites work more efficiently, as well as to provide reporting information to the site owners.
      </p>

      <h2>2. How We Use Cookies</h2>
      <p>
        InfyBuys uses cookies for several reasons:
      </p>
      <ul>
        <li><strong>Essential Cookies:</strong> Required for the operation of our platform, such as logging into secure areas.</li>
        <li><strong>Analytical/Performance Cookies:</strong> Allow us to recognize and count the number of visitors and see how visitors move around our platform.</li>
        <li><strong>Functionality Cookies:</strong> Used to recognize you when you return to our platform, enabling us to personalize content and remember your preferences.</li>
        <li><strong>Targeting Cookies:</strong> Record your visit to our platform, the pages you have visited, and the links you have followed to make advertising more relevant to your interests.</li>
      </ul>

      <h2>3. Managing Cookies</h2>
      <p>
        You have the right to decide whether to accept or reject cookies. You can exercise your cookie rights by setting your preferences in the Cookie Consent Banner that appears when you first visit our site, or by modifying your web browser controls.
      </p>
      <p>
        Please note that if you choose to reject cookies, you may still use our website though your access to some functionality and areas of our website may be restricted.
      </p>
    </LegalLayout>
  );
}
