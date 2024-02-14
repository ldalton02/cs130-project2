import { Button } from "@/components/ui/button";
import Link from "next/link";
import GoogleMap from "./googlemap";
import { useEffect, useState } from "react";

export default function Home() {

  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number }>({lat: 34.0699, lng: -118.4438});


  useEffect(() => {

    // Check if geolocation is supported by the browser
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          console.error('Error getting user location:', error);
        }
      );
    } else {
      console.error('Geolocation is not supported by this browser.');
    }


  }, []);

  return (
    <div className="">
      <section className="space-y-6 pb-8 pt-6 md:pb-12 md:pt-10 lg:py-32">
        <div className="container flex flex-col items-center gap-8 text-center">
          <GoogleMap
            apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!}
            center={userLocation}
            style={{ marginBottom: '20px' }}
          />
          <h1 className="max-w-3xl font-heading font-semibold text-3xl sm:text-5xl md:text-6xl lg:text-7xl tracking-tighter">
            Start building your next billion dollar idea.
          </h1>
          <p className="max-w-xl leading-normal text-muted-foreground sm:text-xl sm:leading-8">
            Boilerplate for React projects using Next.js, shadcn/ui, Tailwind
            and Firebase...and TypeScript, of course!
          </p>
          <div className="space-x-4">
            <Link href="/login">
              <Button size="lg">Sign in to get started</Button>
            </Link>
            <Link target="_blank" href="https://github.com/enesien/venefish">
              <Button size="lg" variant="link">
                View on GitHub &rarr;
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
