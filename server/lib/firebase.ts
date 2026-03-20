import admin from "firebase-admin";

if (!admin.apps.length) {
  try {
    admin.initializeApp({
      credential: admin.credential.applicationDefault(),
      projectId: process.env.GOOGLE_CLOUD_PROJECT,
    });
    console.log("✓ Firebase Admin initialized with Application Default Credentials");
  } catch (error) {
    console.warn("⚠️ Firebase Admin initialization failed. Falling back to project ID only.");
    admin.initializeApp({
      projectId: process.env.GOOGLE_CLOUD_PROJECT,
    });
  }
}

export const db = admin.firestore();
export const FieldValue = admin.firestore.FieldValue;
