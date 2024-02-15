import { NavBar } from "@/components/NavBar";
import "@/styles/globals.css";
import { FirebaseOptions } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { AppProps } from "next/app";
import Head from "next/head";
import { FC, ReactNode } from "react";
import {
  FirestoreProvider,
  FirebaseAppProvider,
  AuthProvider,
} from "reactfire";
import { Work_Sans } from "next/font/google";
import { Toaster } from "@/components/ui/toaster";
import { getAuth } from "firebase/auth";
import { FishIcon } from "lucide-react";

const inter = Work_Sans({ subsets: ["latin"] });

const firebaseConfig: FirebaseOptions = {
  apiKey: "AIzaSyCvRoc9FQ062XeJFyfU0NLAYGMBj5FYcKA",
  authDomain: "bruin-banter-3cc68.firebaseapp.com",
  projectId: "bruin-banter-3cc68",
  storageBucket: "bruin-banter-3cc68.appspot.com",
  messagingSenderId: "258877012527",
  appId: "1:258877012527:web:b6517aedaa443d2456a4da",
  measurementId: "G-RQL68MHJF2"
};

export const FirebaseProviders: FC<{ children: ReactNode }> = ({
  children,
}) => {
  const firestore = getFirestore();
  const auth = getAuth();
  return (
    <AuthProvider sdk={auth}>
      <FirestoreProvider sdk={firestore}>{children}</FirestoreProvider>
    </AuthProvider>
  );
};

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>Bruin Banter</title>
      </Head>
      <main className={`${inter.className} flex flex-col min-h-screen`}>
        <FirebaseAppProvider firebaseConfig={firebaseConfig}>
          <FirebaseProviders>
            <NavBar />
            <div className="container grow">
              <Component {...pageProps} />
            </div>
            <footer>
              <div className="container flex flex-col items-center justify-between gap-4 py-10 md:h-24 md:flex-row md:py-0">
                <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
                  <FishIcon />
                  <p className="text-center text-sm leading-loose md:text-left">
                    {" "}
                    <a
                      href="https://github.com/ldalton02/cs130-project2"
                      target="_blank"
                      rel="noreferrer"
                      className="font-medium underline underline-offset-4"
                    >
                      Scrum Studs
                    </a>{" "}
                    .
                  </p>
                </div>
              </div>
            </footer>
            <Toaster />
          </FirebaseProviders>
        </FirebaseAppProvider>
      </main>
    </>
  );
}
