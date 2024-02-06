import { firestore, db} from './firebase'
import { collection, query, where, getDocs } from "firebase/firestore";

export const retrievePlaces = async () => {
  let places = []
  const q = query(collection(db, "places"));
  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {
    places = [...places, doc.data()]
  });
  return places
}

export const retrievePlacesByName = async (name) => {
  let place = {}
  const q = query(collection(db, "places"), where("name", "==", name));
  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {
    place = doc.data();
  });
  return place
}

export const retrievePlacesById = async (id) => {
  let place = {}
  const q = query(collection(db, "places"), where("id", "==", id));
  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {
    place = doc.data();
  });
  return place
}