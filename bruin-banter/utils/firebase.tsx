import {FirebaseApp, initializeApp } from 'firebase/app'
import {getAuth} from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import 'firebase/auth'
import 'firebase/firestore'
import 'firebase/storage'
import 'firebase/performance'
import 'firebase/analytics'

const firebaseConfig = {
    apiKey: "AIzaSyCvRoc9FQ062XeJFyfU0NLAYGMBj5FYcKA",
    authDomain: "bruin-banter-3cc68.firebaseapp.com",
    projectId: "bruin-banter-3cc68",
    storageBucket: "bruin-banter-3cc68.appspot.com",
    messagingSenderId: "258877012527",
    appId: "1:258877012527:web:b6517aedaa443d2456a4da",
    measurementId: "G-RQL68MHJF2"
  };

const app = initializeApp(firebaseConfig)

export const auth = getAuth(app)
export const db = getFirestore(app)

