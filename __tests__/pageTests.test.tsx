import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import UserSettings from "../pages/preferences";
import HowItWorks from "@/pages/howItWorks";
import LoginPage from "@/pages/login";
import GoogleMap from "@/pages/googlemap";
import { act } from "@testing-library/react";

// Mocking the userAnimals module
jest.mock("../assets/values/userAnimals", () => ({
  animals: ["cat", "dog", "bird"],
}));

// Mocking the reactfire module
jest.mock("reactfire", () => ({
  useUser: jest.fn().mockReturnValue({
    data: { uid: "123", displayName: "John Doe", email: "johndoe@example.com" },
  }),
  useFirestore: jest.fn().mockReturnValue(null),
}));

// Mocking the next/router module
jest.mock("next/router", () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

// Mocking the firebase/firestore module
jest.mock("firebase/firestore", () => ({
  collection: jest.fn(),
  query: jest.fn(),
  where: jest.fn(),
  getDocs: jest.fn().mockReturnValueOnce({
    docs: [
      {
        id: 1,
        data: jest
          .fn()
          .mockReturnValueOnce({ time: "time", animal: "example" }),
      },
    ],
  }),
}));

// Testing the UserSettings component
describe("UserSettings", () => {
  it("Changes State and Renders Dropdown + Save Button Correctly", async () => {
    await act(async () => render(<UserSettings />));
    const saveButton = screen.getByText("Save Changes");
    expect(saveButton).toBeInTheDocument();
    const nameButton = screen.getByText("Anonymous Name");
    expect(nameButton).toBeInTheDocument();
  });
});

// Testing the HowItWorks component
describe("How It works page renders correctly", () => {
  it("How it works loads HTML content correctly", async () => {
    await act(async () => render(<HowItWorks />));
    const heading = screen.getByText("Join the conversation.");
    expect(heading).toBeInTheDocument();
  });
});

// Mocking the reactfire module again
jest.mock("reactfire", () => ({
  useUser: jest.fn().mockReturnValue({
    data: { uid: "123", displayName: "John Doe", email: "johndoe@example.com" },
  }),
  useFirestore: jest.fn().mockReturnValue(null),
  useAuth: jest.fn().mockReturnValue,
}));

// Testing the LoginPage component
describe("LoginPage", () => {
  it("Login page rendered by default", async () => {
    await act(async () => render(<LoginPage />));
    expect(screen.getByText("Sign In")).toBeInTheDocument();
    expect(screen.getByText("Password")).toBeInTheDocument();
    expect(screen.getByText("Email Address")).toBeInTheDocument();
  });
});

// Testing the GoogleMap component
describe("Map Component", () => {
  it("GoogleMap component can be rendered correctly without crashing", async () => {
    const setPlace = jest.fn();
    const setIsOpen = jest.fn();
    const mockLocation = {
      lat: 1000,
      lng: 1000,
    };
    const showToast = jest.fn();
    const setClosestMarker = jest.fn();
    const searchValue = jest.fn();
    await act(async () =>
      render(
        <GoogleMap
          setPlace={setPlace}
          setIsOpen={setIsOpen}
          apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!}
          center={mockLocation}
          notSignedIn={showToast}
          signInCheckResult={true}
          onMarkerChange={setClosestMarker}
          In={showToast}
          searchValue={searchValue}
          selectedLocation={mockLocation!}
        />
      )
    );
  });
});
