/**
 * Allows for login and collecting user data, including creating an animal icon.
 */
import { SignInForm } from "@/components/auth/SignInForm";
import { SignUpForm } from "@/components/auth/SignUpForm";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useFirestore, useUser } from "reactfire";
import { addDoc, collection } from "firebase/firestore";
import { getRandomAnimal } from "@/assets/values/userAnimals";

/**
 * Prompts sign in, collects user data upon login.
 * @returns login prompts and user data
 */
export default function LoginPage() {
  const [isShowingSignUp, setIsShowingSignUp] = useState<boolean>(false);
  const { data: user } = useUser();
  const router = useRouter();
  const firestore = useFirestore();

  const createAnimalForUser = (uid: any) => {
    addDoc(collection(firestore, "userdata"), {
      uid: uid,
      animal: getRandomAnimal()
    });
  };

  useEffect(() => {
    if (user) {
      router.push("/");
    }
  }, [user]);

  return (
    <div className="mt-[20%]">
      <section className="max-w-md mx-auto">
        <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
          Bruin Banter
        </h1>
        <Card>
          <CardHeader>
            <CardTitle>{isShowingSignUp ? "Sign Up" : "Sign In"}</CardTitle>
            <CardDescription>
              Give them a reason to {isShowingSignUp ? "sign up" : "sign in"}.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isShowingSignUp ? (
              <SignUpForm
                onSignUp={createAnimalForUser}
                onShowLogin={() => setIsShowingSignUp(false)}
              />
            ) : (
              <SignInForm onShowSignUp={() => setIsShowingSignUp(true)} />
            )}
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
