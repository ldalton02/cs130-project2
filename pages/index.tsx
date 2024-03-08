import GoogleMap from "./googlemap";
import { useEffect, useState } from "react";
import {
  collection,
  orderBy,
  query,
  where,
  getDocs,
  QueryDocumentSnapshot,
} from "firebase/firestore";

import {
  useFirestore,
  useFirestoreCollectionData,
  useSigninCheck,
  useUser,
} from "reactfire";

import { ChatroomModal } from "@/components/ChatroomModal";
// Define the interface for a place
interface Place {
  location: {
    _lat: number;
    _long: number;
  };
}
import { MyScrollableChart } from '../components/activity-chart/activity-chart'

import { useToast } from "@/components/ui/use-toast";

export default function Home() {
  // Hooks
  const { toast, dismiss } = useToast();
  const { status: signInStatus, data: signInCheckResult } = useSigninCheck();
  const { data: user } = useUser();

  // State variables
  const [userLocation, setUserLocation] = useState<{
    lat: number;
    lng: number;
  }>({ lat: 34.0699, lng: -118.4438 });
  const [closestMarker, setClosestMarker] = useState<string[] | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [place, setPlace] = useState(null);
  const [userUID, setUserUID] = useState("");
  const [userAnimal, setUserAnimal] = useState("");
  const [loading, setLoading] = useState(true);

  const dismissToast = () => {
    dismiss(); // Dismiss all toasts
  };
  const showToast = () => {
    toast({
      title: "",
      description: "Sign in to view messages.",
    });

    setTimeout(() => {
      dismissToast();
    }, 3000);
  };

  // Reactfire Hooks
  const firestore = useFirestore();
  const placesCollection = collection(firestore, "places");
  const placesQuery = query(placesCollection, orderBy("name", "asc"));
  // Fetch places data from Firestore
  const { status: placeQueryStatus, data: places } = useFirestoreCollectionData(
    placesQuery,
    {
      idField: "id",
    }
  );

  // Manually get user location
  useEffect(() => {
    // Check if geolocation is supported by the browser
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          console.error("Error getting user location:", error);
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  }, []);

  // Fetch userdata
  const getUserAnimal = async () => {

    const userDataCollection = collection(firestore, "userdata");

    const messageQuery = query(
      userDataCollection,
      where("uid", "==", user?.uid)
    );

    const querySnapshot = await getDocs(messageQuery);

    // Process query result
    const userDataDocs = querySnapshot.docs.map((doc: QueryDocumentSnapshot) =>
      doc.data()
    );

    let result = userDataDocs[0]; // Assuming there's only one document matching the query

    setUserAnimal(result.animal);
    setLoading(false)
  };

  useEffect(() => {
    if (user) {
      setUserUID(user?.uid);
      getUserAnimal()
    }
  }, [user]);

  // TODO(ldalton02): create better loading status...
  if (placeQueryStatus == "loading" || signInStatus == "loading" || loading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="h-full">
      <section className="h-full flex flex-col justify-center items-center pb-8 pt-6 md:pb-12 md:pt-10">
        <div className="h-full container flex flex-col items-center gap-8 text-center sm:px-0">
          <GoogleMap
            setPlace={setPlace}
            setIsOpen={setIsOpen}
            apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!}
            center={userLocation}
            style={{ marginBottom: "20px" }}
            markers={
              // TODO(ldalton02): marker function supposed to accept place type, works with wrong code: FIX
              places
            }
            In={showToast}
            signInCheckResult={signInCheckResult.signedIn === true}
            onMarkerChange={setClosestMarker}
          />
        </div>
      </section>
      <ChatroomModal
        userUID={userUID}
        userAnimal={userAnimal}
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        setPlace={setPlace}
        place={place}
        closestMarkerIndex={closestMarker}
      />
      <div className="h-h-full flex flex-col justify-center items-center pb-8 pt-6 md:pb-12 md:pt-10">
        <MyScrollableChart />
      </div>
    </div>
  );
}
