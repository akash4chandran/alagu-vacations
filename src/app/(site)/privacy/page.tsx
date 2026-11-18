import type { Metadata } from "next";
import { LegalPage } from "@/components/site/LegalPage";

export const metadata: Metadata = { title: "Privacy Policy", alternates: { canonical: "/privacy" } };

export default function PrivacyPage() {
  return (
    <LegalPage title="Privacy Policy" updated="18 November 2026 (draft)">
      <p>Alagu Vacations (&quot;we&quot;) respects your privacy. This policy explains what we collect when you send a booking enquiry and how we use it.</p>
      <h2>What we collect</h2>
      <ul>
        <li>Your name, mobile number and (optionally) email address.</li>
        <li>Trip details: pickup location, destination, dates, number of passengers, vehicle and trip preferences, and any notes you add.</li>
      </ul>
      <h2>Why we collect it</h2>
      <ul>
        <li>To check vehicle availability and contact you about your enquiry by phone or WhatsApp.</li>
        <li>To prepare and confirm your trip if you choose to book.</li>
      </ul>
      <h2>How long we keep it</h2>
      <p>[Business to confirm: e.g. enquiry details are deleted after 12 months unless needed for a confirmed booking or legal requirements.]</p>
      <h2>Sharing</h2>
      <p>We do not sell your information. It is stored securely with our hosting and database providers and is accessible only to authorised Alagu Vacations staff.</p>
      <h2>Your rights</h2>
      <p>You can ask us to see, correct or delete your information, or withdraw consent, by contacting us. [Business to add grievance contact name, phone and email, as required under India&apos;s Digital Personal Data Protection Act, 2023.]</p>
      <h2>Contact</h2>
      <p>[Business to add contact details for privacy requests.]</p>
    </LegalPage>
  );
}
