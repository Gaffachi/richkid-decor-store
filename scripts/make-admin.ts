/**
 * Promotes a registered account to the admin role.
 * Usage: npm run make-admin -- someone@example.com
 */
import { config } from "dotenv";
config({ path: ".env.local" });

import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore, FieldValue } from "firebase-admin/firestore";

function getAdminApp() {
  if (!getApps().length) {
    const projectId = process.env.FIREBASE_PROJECT_ID;
    const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
    const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n");
    if (!projectId || !clientEmail || !privateKey) {
      throw new Error("Firebase Admin SDK is not configured. Check .env.local.");
    }
    initializeApp({ credential: cert({ projectId, clientEmail, privateKey }) });
  }
}

async function main() {
  const email = process.argv[2];
  if (!email) {
    console.error("Usage: npm run make-admin -- someone@example.com");
    process.exit(1);
  }

  getAdminApp();
  const user = await getAuth().getUserByEmail(email);
  await getFirestore()
    .collection("users")
    .doc(user.uid)
    .set({ role: "admin", updatedAt: FieldValue.serverTimestamp() }, { merge: true });

  console.log(`${email} (${user.uid}) is now an admin.`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Failed to promote user:", error);
    process.exit(1);
  });
