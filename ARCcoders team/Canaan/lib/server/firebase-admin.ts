import { serverConfig } from "@/config/server-config";
import * as admin from "firebase-admin";

if (!admin.apps.length) {
	try {
		admin.initializeApp({
			credential: admin.credential.cert({
				projectId: serverConfig.serviceAccount.projectId,
				clientEmail: serverConfig.serviceAccount.clientEmail,
				privateKey: serverConfig.serviceAccount.privateKey.replace(
					/\\n/g,
					"\n"
				),
			}),
		});
	} catch (error) {
		console.error("Firebase admin initialization error", error);
	}
}

export default admin;
