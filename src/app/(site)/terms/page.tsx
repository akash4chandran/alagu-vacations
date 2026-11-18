import type { Metadata } from "next";
import { LegalPage } from "@/components/site/LegalPage";

export const metadata: Metadata = { title: "Booking Terms", alternates: { canonical: "/terms" } };

export default function TermsPage() {
  return (
    <LegalPage title="Booking Terms" updated="18 November 2026 (draft)">
      <h2>Enquiries are not confirmed bookings</h2>
      <p>Submitting the online form sends a booking <strong>enquiry</strong>. A vehicle is reserved only after Alagu Vacations confirms availability and the trip details with you directly.</p>
      <h2>Pricing</h2>
      <p>[Business to confirm: how fares are calculated (e.g. per km / per day), what is included (fuel, driver allowance, tolls, parking, permits) and what is extra.]</p>
      <h2>Advance and payment</h2>
      <p>[Business to confirm: advance amount, accepted payment methods and when the balance is due.] No payment is collected on this website.</p>
      <h2>Cancellations and changes</h2>
      <p>[Business to confirm: cancellation charges, refund timelines and how date changes are handled.]</p>
      <h2>Passenger responsibilities</h2>
      <ul>
        <li>The number of passengers must not exceed the vehicle&apos;s permitted seating capacity.</li>
        <li>[Business to confirm: luggage limits, conduct, smoking/alcohol policy, damage.]</li>
      </ul>
      <h2>Contact</h2>
      <p>For questions about these terms, please call or WhatsApp us using the details on our contact section.</p>
    </LegalPage>
  );
}
