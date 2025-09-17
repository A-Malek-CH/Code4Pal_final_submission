import { createContext, useContext } from "react";
import { IUser } from "@/types/user";

export interface AuthContextValue {
	user: IUser | null;
}

export const AuthContext = createContext<AuthContextValue>({
	user: null,
});

export const useAuth = () => useContext(AuthContext);
