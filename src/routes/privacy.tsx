import { createFileRoute, Link } from "@tanstack/react-router";
import { LegalPage, List, type LegalSection } from "@/components/legal/LegalPage";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy policy — RideShare" },
      {
        name: "description",
        content:
          "How RideShare collects, uses, shares and protects personal data for closed-community commute carpooling.",
      },
    ],
  }),
  component: PrivacyPage,
});

const SECTIONS: LegalSection[] = [
  {
    id: "who-we-are",
    title: "Who we are",
    body: (
      <>
        <p>
          RideShare is a closed-community commute carpooling platform. It is provided to
          organisations, such as employers and campuses, and used by their verified employees
          to share rides to and from work.
        </p>
        <p>
          Your organisation decides to offer RideShare and manages its own members, campuses and
          administrators. RideShare operates the platform and processes personal data to provide
          it. This policy explains what data is involved, why, and the choices you have.
        </p>
      </>
    ),
  },
  {
    id: "data-we-collect",
    title: "Data we collect",
    body: (
      <>
        <p>We collect only what the service needs to work:</p>
        <List
          items={[
            <><strong className="text-ink">Account details:</strong> your name, work email address, phone number (if you add one), organisation, campus and role.</>,
            <><strong className="text-ink">Profile details:</strong> an optional bio and notification preferences. Drivers also provide a UPI ID so passengers can pay them, and their vehicle's make, model, number plate and seat count.</>,
            <><strong className="text-ink">Gender, where relevant:</strong> used only to apply the women-only passengers setting, which is available when the account holder is female.</>,
            <><strong className="text-ink">Trip details:</strong> pickup and drop-off points, routes, times, seats offered or taken, and ride status (ongoing, completed or cancelled).</>,
            <><strong className="text-ink">Live location:</strong> your position while a ride is in progress, from the moment you are matched until the ride is closed. The Android app uses background location during an active ride so tracking continues when the app is not open.</>,
            <><strong className="text-ink">Payment records:</strong> the fare for each ride and the rate and minimum in force at the time. Payment itself happens directly between you and the driver; we do not hold your money or your bank or card details.</>,
            <><strong className="text-ink">Safety records:</strong> SOS alerts (your location, the ride, the people on it and the time), ratings, and the members you have blocked.</>,
            <><strong className="text-ink">Audit records:</strong> for consequential actions on the platform, who performed the action, what it affected and what changed.</>,
            <><strong className="text-ink">Messages to us:</strong> anything you send through our contact or feedback forms.</>,
            <><strong className="text-ink">Technical data:</strong> a secure sign-in cookie and basic server logs needed to keep the service running and protected.</>,
          ]}
        />
      </>
    ),
  },
  {
    id: "how-we-use",
    title: "How we use your data",
    body: (
      <List
        items={[
          "To verify that you belong to a registered organisation and campus, and to keep the platform closed to everyone else.",
          "To match passengers with colleagues driving the same way, including ranking waiting passengers by waiting time, detour and rating.",
          "To show routes, live tracking and arrival times during a ride.",
          "To calculate fares using the published formula and keep an accurate record of each payment.",
          "To run safety features: SOS alerts, women-only matching, blocking and the audit trail.",
          "To send notifications about matches, arrivals and fares, which you can turn off in your profile.",
          "To give your organisation's administrators programme reporting, and to maintain, secure and improve the service.",
        ]}
      />
    ),
  },
  {
    id: "who-can-see",
    title: "Who can see your data",
    body: (
      <>
        <List
          items={[
            <><strong className="text-ink">People on your ride:</strong> your name, rating and, for drivers, vehicle details and UPI ID. During a ride, the people on it can see its live position and route.</>,
            <><strong className="text-ink">Your organisation's administrators:</strong> programme figures for their own organisation and campus (such as rides completed, seats shared, participation and the most active drivers), SOS alerts and the audit record. Their access does not extend to other organisations.</>,
            <><strong className="text-ink">Police administrators:</strong> SOS alerts, so that emergencies can be acknowledged and resolved, and city-wide transport and carpooling metrics.</>,
            <><strong className="text-ink">Service providers:</strong> companies that host the platform or provide maps and directions, acting only on our instructions.</>,
            <><strong className="text-ink">Authorities:</strong> where the law requires us to disclose information.</>,
          ]}
        />
        <p>We do not sell your personal data, and we do not use it for advertising.</p>
      </>
    ),
  },
  {
    id: "location",
    title: "Location data",
    body: (
      <>
        <p>
          Location is central to carpooling, so we are specific about it. Live location is shared
          only while a ride is in progress. If you raise an SOS alert, your location at that
          moment is sent to your organisation's safety team and to the police console.
        </p>
        <p>
          You can control location permission in your phone's settings at any time, although
          live tracking and SOS need it to work.
        </p>
      </>
    ),
  },
  {
    id: "retention",
    title: "How long we keep data",
    body: (
      <p>
        We keep personal data for as long as your account is active and as needed to provide the
        service, meet legal obligations and resolve disputes. Payment and audit records are kept
        so that a fare or an incident can still be explained accurately later. When data is no
        longer needed, we delete or anonymise it.
      </p>
    ),
  },
  {
    id: "security",
    title: "How we protect data",
    body: (
      <List
        items={[
          "Organisation and campus boundaries are enforced in the database, not only in the app.",
          "Six levels of role-based access, with permissions checked again on every request.",
          "Encrypted connections (HTTPS) throughout, with additional browser security protections.",
          "Secure sign-in cookies that cannot be read by scripts on the page.",
          "Validation of all incoming data, and rate limits that are strictest on sign-in.",
        ]}
      />
    ),
  },
  {
    id: "your-rights",
    title: "Your rights",
    body: (
      <>
        <p>
          Under India's Digital Personal Data Protection Act, 2023, and other applicable laws, you
          can ask to:
        </p>
        <List
          items={[
            "access a summary of the personal data we hold about you;",
            "correct or update inaccurate data;",
            "erase data we no longer need, subject to legal and safety record-keeping;",
            "withdraw consent where processing is based on it;",
            "nominate someone to exercise these rights on your behalf; and",
            "raise a grievance about how your data has been handled.",
          ]}
        />
        <p>
          You can update most profile details yourself in the app. For anything else, please{" "}
          <Link to="/contact" className="font-semibold text-primary underline underline-offset-4">
            contact our team
          </Link>
          . Because your account belongs to your organisation, some requests may also involve
          your organisation's administrator.
        </p>
      </>
    ),
  },
  {
    id: "children",
    title: "Age requirement",
    body: (
      <p>
        RideShare is intended for working adults. You must be at least 18 years old to use it,
        and we do not knowingly collect data from anyone younger.
      </p>
    ),
  },
  {
    id: "changes",
    title: "Changes to this policy",
    body: (
      <p>
        We may update this policy as the service changes. We will change the date at the top of
        this page and, for significant changes, let you know in the app or by email.
      </p>
    ),
  },
];

function PrivacyPage() {
  return (
    <LegalPage
      eyebrow="Legal"
      title="Privacy policy"
      intro="How RideShare collects, uses, shares and protects your personal data, written as plainly as we can."
      updated="24 September 2026"
      sections={SECTIONS}
    />
  );
}
