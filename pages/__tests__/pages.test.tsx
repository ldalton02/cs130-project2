import '@testing-library/jest-dom'
import { render, fireEvent } from '@testing-library/react';
import LoginPage from '@/pages/login';
import GoogleMap from '@/pages/googlemap';
import { useUser } from 'reactfire';
import {expect, jest} from '@jest/globals';
import App from 'next/app';

// Mock useRouter and useUser hooks
jest.mock('next/router', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

jest.mock('reactfire', () => ({
  useUser: jest.fn(),
}));

describe('LoginPage', () => {

  it('renders about page', async () => {
    const { getByText } = render(<App />);
    await expect(getByText('How it Works')).toBeInTheDocument();
  });
  
  it('renders sign-in form by default', async () => {
    (useUser as jest.Mock).mockReturnValueOnce({ data: null });
    const { getByText } = render(<LoginPage />);
    await expect(getByText('Sign In')).toBeInTheDocument();
  });

  it('renders map', async () => {
    const setPlace = jest.fn();
    const setIsOpen = jest.fn();
    const mockLocation = {
      lat: 1000,
      lng: 1000
    };    
    const showToast = jest.fn();
    const setClosestMarker = jest.fn();
    const { getByText } = render(<GoogleMap
      setPlace={setPlace}
      setIsOpen={setIsOpen}
      apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!}
      center={mockLocation}
      notSignedIn={showToast}
      signInCheckResult={true}
      onMarkerChange={setClosestMarker}
    />);
    await expect(getByText('Map')).toBeInTheDocument();
  });

  it('redirects to home page if user is already authenticated', () => {
    (useUser as jest.Mock).mockReturnValueOnce({ data: { uid: 'user123' } });
    const pushMock = jest.fn();
    useRouter.mockReturnValueOnce({ push: pushMock });
    render(<LoginPage />);
    expect(pushMock).toHaveBeenCalledWith('/');
  });

  it('switches to sign-up form when clicked on "Sign Up" link', () => {
    (useUser as jest.Mock).mockReturnValueOnce({ data: null });
    const { getByText } = render(<LoginPage />);
    fireEvent.click(getByText('Sign Up'));
    expect(getByText('Sign Up')).toBeInTheDocument();
  });

  it('switches to sign-in form when clicked on "Sign In" link', () => {
    (useUser as jest.Mock).mockReturnValueOnce({ data: null });
    const { getByText } = render(<LoginPage />);
    fireEvent.click(getByText('Sign In'));
    expect(getByText('Sign In')).toBeInTheDocument();
  });
});
