/**
 * Outlines various states and user data collection specifications.
 */
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Select from "@/components/ui/select";
import * as Separator from "@radix-ui/react-separator";
import { animals } from "@/assets/values/userAnimals";
import { Button } from "@/components/ui/button";
import {
  collection,
  getDocs,
  QueryDocumentSnapshot,
  doc,
  query,
  where,
  updateDoc,
  Timestamp,
  DocumentData,
} from "firebase/firestore";
import { useFirestore, useUser } from "reactfire";
import { toast } from "@/components/ui/use-toast";

/**
 * Creates and specifies user preferences
 * @returns user preferences
 */
export default function userSettings() {
  // Hooks + fireStore setup
  const { data: user } = useUser();
  const firestore = useFirestore();
  const router = useRouter();
  const userDataCollection = collection(firestore, "userdata");

  // State tracking variables
  const [stateChanged, setStateChanged] = useState(false);
  const [loading, setLoading] = useState(true);

  // Store userData query result and query result information for later use
  const [userDataResult, setUserDataResult] = useState<DocumentData | null>(
    null
  );
  const [userDocumentID, setUserDocumentID] = useState("");
  const [userLastTimeChanged, setUserLastTimeChanged] =
    useState<Timestamp | null>(null);

  // State data for input from user
  const [userAnimal, setUserAnimal] = useState("");

  // Queries Firestore "userdata" table and sets resulting state variables
  const fetchUserData = async () => {
    try {
      // Firestore query
      const messageQuery = query(
        userDataCollection,
        where("uid", "==", user?.uid)
      );
      const querySnapshot = await getDocs(messageQuery);
      // Process query result
      const userDataDocs = querySnapshot.docs.map(
        (doc: QueryDocumentSnapshot) => {
          setUserDocumentID(doc.id);
          return doc.data();
        }
      );
      setUserDataResult(userDataDocs[0]); // Assuming there's only one document matching the query
      if (userDataDocs[0].time) {
        setUserLastTimeChanged(userDataDocs[0].time);
      }
      setUserAnimal(userDataDocs[0].animal);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };
  
  // useEffect hook to only query user data once user query has finished 
  useEffect(() => {
    if (user) {
      fetchUserData();
    }
  }, [user]);

  // State change function passed down to Select component 
  const updateAnimal = (animal: any) => {
    if (!stateChanged) {
      setStateChanged(true);
    }
    setUserAnimal(animal);
  };

  // Update appropriate user animal in "userdata" Firestore table 
  const submitUserAnimalChange = async () => {
    try {
      // Select appropriate document queried earlier 
      const userDocRef = doc(userDataCollection, userDocumentID);
      // Only update if user hasn't changed recently
      if (userLastTimeChanged) {
        const currentTime = Timestamp.now();
        const twentyFourHoursAgo = new Date(
          currentTime.toMillis() - 24 * 60 * 60 * 1000
        );
        if (userLastTimeChanged.toDate() > twentyFourHoursAgo) {
          toast({
            title: "Error",
            description: "You can only update your animal once every 24 hours.",
          });
          setStateChanged(false);
          setUserAnimal(userDataResult?.animal);
          // Need to refresh the selected value in the dropdown if user is not able to change their value yet.
          // Force a refresh of select component by rerendering entire component by "loading"
          setLoading(true);
          setTimeout(() => {
            setLoading(false);
          }, 500);
          return;
        }
      }
      // Update document 
      await updateDoc(userDocRef, {
        animal: userAnimal,
        time: Timestamp.now(),
      });
      toast({
        title: "Success!",
        description: "User animal updated successfully.",
      });
    } catch (error) {
      console.error("Error updating user animal:", error);
      toast({
        title: "Error",
        description: "Error updating user animal.",
      });
    }
    // Reload page if user has changed state 
    setTimeout(() => {
      router.reload();
    }, 2000);
  };

  /*  TODO(@anyone/@ldalton02):
    if we end up adding more options for user to change later on, this page serves as a good skeleton but will need
    more complex state logic and submission logic
  */

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="px-[10px] flex-col flex min-h-full items-start">
      <div className="flex items-end justify-between">
        <h2 className="text-3xl leading-5 font-bold tracking-tight">
          Preferences
        </h2>
      </div>
      <Separator.Root className="bg-black data-[orientation=horizontal]:h-px data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-px mt-[10px]" />
      <div className="flex-1 space-y-4 pt-6"></div>
      <h3 className="text-2xl leading-5 font-bold tracking-tight">
        Appearance
      </h3>
      <div className="flex grow w-full items-center space-x-4 my-[15px]">
        <p className="mr-2">Anonymous Name</p>
        <Select
          values={animals}
          onValueChange={updateAnimal}
          defaultValue={userAnimal}
        />
      </div>
      <div className="flex justify-center">
        <Button
          disabled={stateChanged === false}
          onClick={() => {
            submitUserAnimalChange();
          }}
        >
          Save Changes
        </Button>
      </div>
    </div>
  );
}
