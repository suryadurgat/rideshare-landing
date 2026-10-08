import { createFileRoute, Link } from "@tanstack/react-router";
import { LegalPage, List, type LegalSection } from "@/components/legal/LegalPage";
import {
  FARE_MIN_INR,
  FARE_MIN_SHORT_INR,
  FARE_RATE_PER_KM_INR,
  formatInr,
  SHORT_HOP_KM,
} from "@/lib/fare";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "Terms and conditions — RideShare" },
      {
        name: "description",
        content:
          "The terms for using RideShare, the closed-community commute carpooling platform for verified organisations.",
      },
    ],
  }),
  component: TermsPage,
});

const SECTIONS: LegalSection[] = [
  {
    id: "acceptance",
    title: "Accepting these terms",
    body: (
      <p>
        These terms apply whenever you use RideShare, on the web or in the app. By signing in, you
        agree to them and to our{" "}
        <Link to="/privacy" className="font-semibold text-primary underline underline-offset-4">
          privacy policy
        </Link>
        . If you do not agree, please do not use the service.
      </p>
    ),
  },
  {
    id: "what-rideshare-is",
    title: "What RideShare is",
    body: (
      <>
        <p>
          RideShare helps colleagues who already travel the same way share a car. It connects
          passengers with drivers from their own organisation and campus; it is not a taxi or
          transport service.
        </p>
        <p>
          Drivers are fellow members making a journey they would make anyway. They are not
          employed by RideShare, and the fare is a contribution towards their costs, not income
          from commercial hire.
        </p>
      </>
    ),
  },
  {
    id: "eligibility",
    title: "Who can use RideShare",
    body: (
      <List
        items={[
          "You must be at least 18 years old.",
          "You must belong to an organisation registered with RideShare and sign in with your work email. There is no public sign-up.",
          "Your access depends on your organisation. If it removes your account or stops using RideShare, your access ends.",
        ]}
      />
    ),
  },
  {
    id: "account",
    title: "Your account",
    body: (
      <p>
        Keep your sign-in details secure and your profile accurate. You are responsible for
        activity on your account. Tell your organisation's administrator or our team straight away
        if you think someone else has used it.
      </p>
    ),
  },
  {
    id: "drivers",
    title: "If you drive",
    body: (
      <List
        items={[
          "Hold a valid driving licence and keep your vehicle registered, insured and roadworthy.",
          "Register your vehicle accurately. Your organisation's administrator may verify it before you can carry passengers.",
          "Offer only the seats you genuinely have available, and follow all traffic laws.",
          "Collect only the fare calculated by RideShare, and confirm payment in the app only once you have received it.",
        ]}
      />
    ),
  },
  {
    id: "passengers",
    title: "If you travel as a passenger",
    body: (
      <List
        items={[
          "Be at your pickup point within the waiting window you set.",
          "Pay the calculated fare to the driver at the end of the ride.",
          "Treat drivers and fellow passengers with respect, and follow any reasonable safety instructions from the driver.",
        ]}
      />
    ),
  },
  {
    id: "fares",
    title: "Fares and payment",
    body: (
      <>
        <p>
          Every fare follows the same published formula: {formatInr(FARE_RATE_PER_KM_INR)} per
          kilometre, per seat, with a minimum of {formatInr(FARE_MIN_SHORT_INR)} for trips up to{" "}
          {SHORT_HOP_KM} km and {formatInr(FARE_MIN_INR)} for longer trips. These are the platform
          defaults; your organisation may set its own.
        </p>
        <List
          items={[
            "The fare is based on the distance between your pickup and drop-off points, not the driver's whole journey.",
            "You pay the driver directly, for example by UPI. RideShare does not hold money in a wallet and takes no cut of the fare.",
            "The rate in force is recorded on every payment, so any fare can be explained later.",
            "Payment is between passenger and driver. If you disagree about a payment, contact the other person first, then your organisation's administrator or our team.",
          ]}
        />
      </>
    ),
  },
  {
    id: "safety",
    title: "Safety features and their limits",
    body: (
      <>
        <p>
          RideShare includes an SOS alert on every screen, live journey tracking, women-only
          passengers for women drivers, permanent mutual blocking and a full audit trail.
        </p>
        <p>
          These features reduce risk; they do not remove it. We do not run criminal background
          checks and we do not put cameras in cars. If your organisation requires background
          verification, that is carried out by your organisation.
        </p>
        <p className="rounded-2xl bg-[#fdecee] p-4 font-medium text-[#8a1c2b]">
          RideShare is not an emergency service. In an emergency, call 112 first, then raise an
          SOS alert in the app.
        </p>
      </>
    ),
  },
  {
    id: "conduct",
    title: "Acceptable use",
    body: (
      <>
        <p>You must not:</p>
        <List
          items={[
            "use RideShare to run a commercial taxi or hire service, or charge more than the calculated fare;",
            "harass, threaten or discriminate against anyone;",
            "raise false SOS alerts or misuse safety features;",
            "share another person's personal details outside the purpose of the ride;",
            "attempt to access other organisations' data or interfere with the platform's security.",
          ]}
        />
      </>
    ),
  },
  {
    id: "suspension",
    title: "Suspension and closure",
    body: (
      <p>
        Your organisation's administrators or RideShare may suspend or close an account that
        breaks these terms or puts others at risk. Ride, payment, safety and audit records may be
        kept afterwards, as described in our privacy policy.
      </p>
    ),
  },
  {
    id: "liability",
    title: "Our responsibility",
    body: (
      <p>
        We work to keep RideShare available, accurate and secure, but we cannot guarantee that a
        ride will always be available or that the service will never be interrupted. To the extent
        permitted by law, RideShare is not responsible for the conduct of drivers or passengers,
        or for losses arising from journeys arranged through the platform. Nothing in these terms
        limits rights you have under applicable law.
      </p>
    ),
  },
  {
    id: "law",
    title: "Governing law",
    body: <p>These terms are governed by the laws of India.</p>,
  },
  {
    id: "changes",
    title: "Changes to these terms",
    body: (
      <p>
        We may update these terms as the service changes. We will change the date at the top of
        this page and, for significant changes, let you know in the app or by email. Continuing
        to use RideShare after a change means you accept the updated terms.
      </p>
    ),
  },
];

function TermsPage() {
  return (
    <LegalPage
      eyebrow="Legal"
      title="Terms and conditions"
      intro="The terms for using RideShare: what the service is, what we ask of drivers and passengers, and how fares and safety work."
      updated="24 September 2026"
      sections={SECTIONS}
    />
  );
}
