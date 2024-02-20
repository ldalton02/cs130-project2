import GoogleMap from "./googlemap";
import { useEffect, useState } from "react";
import {
  collection,
  orderBy,
  query,
  where,
  getDocs
} from "firebase/firestore";
import {
  useFirestore,
  useFirestoreCollectionData,
  useSigninCheck
} from "reactfire";

import { ChatroomModal } from "@/components/ChatroomModal";
// Define the interface for a place
interface Place {
  location: {
    _lat: number;
    _long: number;
  };
}
import { useToast } from "@/components/ui/use-toast";

export default function Home() {
  const [userLocation, setUserLocation] = useState<{
    lat: number;
    lng: number;
  }>({ lat: 34.0699, lng: -118.4438 });

  const [isOpen, setIsOpen] = useState(false);
  const [place, setPlace] = useState(null);
  const [numberOfChats, setNumberOfChats] = useState<number>(0); // State to store the number of chats
  const { toast, dismiss } = useToast();
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
    }, 3000)
  };
  
  // START: reactfire Hooks to subscribe to places database:
  const firestore = useFirestore();
  const placesCollection = collection(firestore, "places");
  const placesQuery = query(placesCollection, orderBy("name", "asc"));
  // Fetch places data from Firestore
  const { status: placeQueryStatus, data: places } = useFirestoreCollectionData(placesQuery, {
    idField: "id",
  });
  const { status: signInStatus, data: signInCheckResult } = useSigninCheck();

  // END

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

  // chelsea

  const fetchNumberOfChats = async (room: string) => {
    const chatsCollection = collection(firestore, "chats");
    const now = new Date();
    const oneHourAgo = now.getTime() - 60 * 60 * 1000;
  
    const chatsQuery = query(chatsCollection, where("time", ">=", oneHourAgo), where("place", "==", room));
    const querySnapshot = await getDocs(chatsQuery);
    // Get the size of the snapshot to determine the number of chats
    const numberOfChats = querySnapshot.size;
    // Update the state with the number of chats
    setNumberOfChats(numberOfChats);
  };
  
  // Fetch the number of chats when the component mounts
  useEffect(() => {
    const room = "your_room_name_here"; // Specify the room name here
    fetchNumberOfChats(room);
  }, []);
  
  // chelsea

  // TODO(ldalton02): create better loading status...
  if (placeQueryStatus == 'loading' || signInStatus == 'loading') {
    return <p>loading</p>
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
            notSignedIn={showToast}
            signInCheckResult={signInCheckResult.signedIn === true}
          />
        </div>
      </section>
      <ChatroomModal isOpen={isOpen} setIsOpen={setIsOpen} setPlace={setPlace} place={place} />
    </div>
  );
}
