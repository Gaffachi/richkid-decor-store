import { FirebaseError } from "firebase/app";

const messages: Record<string, string> = {
  "auth/email-already-in-use": "An account with this email already exists. Try signing in instead.",
  "auth/invalid-credential": "Incorrect email or password.",
  "auth/invalid-email": "Enter a valid email address.",
  "auth/user-not-found": "Incorrect email or password.",
  "auth/wrong-password": "Incorrect email or password.",
  "auth/weak-password": "Password must be at least 8 characters.",
  "auth/too-many-requests": "Too many attempts. Please wait a moment and try again.",
  "auth/network-request-failed": "Network error — check your connection and try again.",
};

export function getAuthErrorMessage(error: unknown): string {
  if (error instanceof FirebaseError) {
    return messages[error.code] ?? "Something went wrong. Please try again.";
  }
  return "Something went wrong. Please try again.";
}
