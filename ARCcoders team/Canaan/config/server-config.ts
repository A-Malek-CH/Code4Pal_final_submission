import { clientConfig } from "./client-config";
const FIREBASE_ADMIN_SDK_CONFIG = process.env.FIREBASE_ADMIN_SDK_CONFIG;
const API_KEY = process.env.FIREBASE_API_KEY;

if (!FIREBASE_ADMIN_SDK_CONFIG || !API_KEY) {
  throw new Error(
    "FIREBASE_ADMIN_SDK_CONFIG or FIREBASE_API_KEY is not defined"
  );
}
const config = JSON.parse(FIREBASE_ADMIN_SDK_CONFIG);
export const serverConfig = {
  useSecureCookies: process.env.USE_SECURE_COOKIES === "true",
  firebaseApiKey: API_KEY,
  serviceAccount: {
    projectId: config.project_id,
    clientEmail: config.client_email,
    privateKey: config.private_key.replace(/\\n/g, "\n"),
  },
};

export const authConfig = {
  apiKey: serverConfig.firebaseApiKey,
  cookieName: "AuthToken",
  cookieSignatureKeys: [
    process.env.COOKIE_SECRET_CURRENT!,
    process.env.COOKIE_SECRET_PREVIOUS!,
  ],
  cookieSerializeOptions: {
    path: "/",
    httpOnly: true,
    secure: serverConfig.useSecureCookies, // Set this to true on HTTPS environments
    sameSite: "lax" as const,
    maxAge: 60 * 60 * 24 * 15, // 15 days
    // maxAge: 60 * 60 * 2, // test,
  },
  serviceAccount: serverConfig.serviceAccount,
  // Set to false in Firebase Hosting environment due to https://stackoverflow.com/questions/44929653/firebase-cloud-function-wont-store-cookie-named-other-than-session
  enableMultipleCookies: true,
  // Set to false if you're not planning to use `signInWithCustomToken` Firebase Client SDK method
  enableCustomToken: true,
  experimental_enableTokenRefreshOnExpiredKidHeader: false,
  debug: false,
  tenantId: clientConfig.tenantId,
};
