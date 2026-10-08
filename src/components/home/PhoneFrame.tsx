import { cn } from "@/lib/utils";

export const APP_SCREENS = {
  passengerHome: {
    src: "/images/app/passenger-home.jpg",
    alt: "RideShare passenger home screen with destination search, trip statistics and recent rides.",
  },
  driverHome: {
    src: "/images/app/driver-home.jpg",
    alt: "RideShare driver home screen showing driver mode, route setup and ride statistics.",
  },
  pickRoute: {
    src: "/images/app/pick-route.jpg",
    alt: "RideShare route selection on a Google map, with three route options showing travel time, distance and arrival time.",
  },
  findingRide: {
    src: "/images/app/finding-ride.jpg",
    alt: "RideShare searching for a ride from Madhapur to Gachibowli, 8.1 km, on a live map.",
  },
  myRides: {
    src: "/images/app/my-rides.jpg",
    alt: "RideShare ride history listing completed trips.",
  },
  driverDestination: {
    src: "/images/app/driver-destination.jpg",
    alt: "Driver searching for a destination, with Gachibowli suggestions listed as they type.",
  },
  driverRoute: {
    src: "/images/app/driver-route.jpg",
    alt: "Driver choosing between route options on a Google map, with the fastest route highlighted.",
  },
  driverSeats: {
    src: "/images/app/driver-seats.jpg",
    alt: "Driver choosing how many passenger seats to offer, from one to four, before starting the ride.",
  },
  driverActive: {
    src: "/images/app/driver-active.jpg",
    alt: "Driver home screen showing an ongoing ride to Gachibowli Stadium with seats aboard, distance and arrival time.",
  },
  driverNavigation: {
    src: "/images/app/driver-navigation.jpg",
    alt: "Live turn-by-turn navigation for the driver, with the passenger's pickup status and trip progress.",
  },
  driverCollectFare: {
    src: "/images/app/driver-collect-fare.jpg",
    alt: "Driver collecting the fare at the end of a ride, confirming pickup and drop-off before sliding to confirm payment.",
  },
  driverDrives: {
    src: "/images/app/driver-drives.jpg",
    alt: "Driver ride history listing completed drives with the number of passengers carried.",
  },
  driverWomenOnly: {
    src: "/images/app/driver-women-only.jpg",
    alt: "Driver safety setting for women-only passengers, switched on.",
  },
  driverSos: {
    src: "/images/app/driver-sos.jpg",
    alt: "Driver emergency alert confirmation, sharing the current location with the organisation's safety team.",
  },
  sos: {
    src: "/images/app/sos.jpg",
    alt: "RideShare emergency alert confirmation asking the user to send an SOS to their organisation's safety team.",
  },
} as const;

/** An image in a phone-shaped frame with curved corners. */
export function AppScreenshot({
  screen,
  label,
  className,
}: {
  screen: { src: string; alt: string; position?: string };
  label?: string;
  className?: string;
}) {
  return (
    <figure className={cn("relative mx-auto w-[260px] shrink-0", className)}>
      <div className="rounded-[2.4rem] bg-ink p-2.5 shadow-phone ring-1 ring-white/10">
        <img
          src={screen.src}
          alt={screen.alt}
          width={717}
          height={1600}
          loading="lazy"
          decoding="async"
          className={cn(
            "block aspect-[717/1600] w-full rounded-[1.9rem] object-cover",
            screen.position ?? "object-top",
          )}
        />
      </div>
      {label ? (
        <figcaption className="mt-4 text-center text-sm font-medium text-muted">{label}</figcaption>
      ) : null}
    </figure>
  );
}
