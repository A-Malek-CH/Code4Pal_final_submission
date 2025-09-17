"use server";

import admin from "./firebase-admin";

export async function setCustomUserClaims(uid: string) {
  try {
    const claims = {
      app_role: "user",
      role: "authenticated",
    };
    await admin.auth().setCustomUserClaims(uid, claims);
    console.log(`Custom claims set for user: ${uid}`, claims);
    return { success: true };
  } catch (error) {
    console.error(`Error setting custom claims for user ${uid}:`, error);
    return { success: false, error: "Failed to set custom claims." };
  }
}