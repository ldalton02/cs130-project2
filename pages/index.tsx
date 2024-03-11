/**
 * Create guidelines for home page.
 */
import GoogleMap from "./googlemap";
import { useEffect, useState } from "react";
import {
  collection,
  orderBy,
  query,
  where,
  getDocs,
  QueryDocumentSnapshot,
  Timestamp,
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
import { MyScrollableChart } from "../components/activity-chart/activity-chart";
import { useToast } from "@/components/ui/use-toast";
import { Autocomplete, TextField } from "@mui/material";
import { useRouter } from "next/router";

/**
 * Collects firebase data to be rendered in the homepage.
 * Performs user geolocation.
 * Analyzes database data for analytics purposes.
 * @returns homepage props, including user information and map data
 */
export default function Home() {
  // Hooks
  const { toast, dismiss } = useToast();
  const { status: signInStatus, data: signInCheckResult } = useSigninCheck();
  const { data: user } = useUser();
  const router = useRouter();
  // State variables

  const [userLocation, setUserLocation] = useState<{
    lat: number;
    lng: number;
  }>({ lat: 34.0699, lng: -118.4438 });
  const [closestMarker, setClosestMarker] = useState<string[] | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [place, setPlace] = useState(null);
  const [userUID, setUserUID] = useState("");
  const [loading, setLoading] = useState(true);
  const [userAnimal, setUserAnimal] = useState("");
  const [searchValue, setSearchValue] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null); // Add state variable for selected location

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

  // START: reactfire Hooks to subscribe to places database:
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

  // Fetch chats data from Firestore
  const chatsCollection = collection(firestore, "chats");
  const chatsQuery = query(chatsCollection);
  const { status: chatQueryStatus, data: chats } = useFirestoreCollectionData(
    chatsQuery,
    {
      idField: "id",
    }
  );
  // END

  const activities: { [key: string]: number } = {};

  // Calculate the timestamp for an hour ago
  const now = Timestamp.now().seconds;
  const oneHourAgo = now - 3600;

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
    setLoading(false);
  };

  useEffect(() => {
    if (user) {
      setUserUID(user?.uid);
      getUserAnimal();
    } else {
      router.push("/login");
    }
  }, [user]);

  // TODO(ldalton02): create better loading status...
  if (placeQueryStatus == "loading" || signInStatus == "loading" || loading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="h-full">
      <Autocomplete
        selectOnFocus
        clearOnBlur
        autoComplete
        options={places.map((place) => place.name)}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Search for a place"
            variant="outlined"
            style={{ width: "30%", left: "35%" }}
          />
        )}
        onKeyDown={(event) => {
          if (event.key === "Enter") {
            //            if (event.target.value === "") {
            setSelectedLocation(null);
            //            }
          }
        }}
        onSelect={(event) => {
          const s = event.target as HTMLInputElement;
          const selectedPlace = places.find((place) => place.name === s.value);
          if (selectedPlace && searchValue !== selectedPlace.name) {
            setSelectedLocation({
              lat: selectedPlace.location._lat,
              lng: selectedPlace.location._long,
            });
            setSearchValue(selectedPlace.name);
          }
        }}
      />

      <section className="h-full flex flex-col justify-center items-center pb-8 pt-6 md:pb-12 md:pt-10">
        <div className="h-full container flex flex-col items-center gap-8 text-center sm:px-0">
          <GoogleMap
            setPlace={setPlace}
            setIsOpen={setIsOpen}
            apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!}
            center={userLocation}
            style={{ marginBottom: "20px" }}
            markers={places}
            activities={activities}
            In={showToast}
            signInCheckResult={signInCheckResult.signedIn === true}
            onMarkerChange={setClosestMarker}
            searchValue={searchValue}
            selectedLocation={selectedLocation!} // Pass selectedLocation as prop
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
