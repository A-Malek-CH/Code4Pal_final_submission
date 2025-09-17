"use client";

import * as React from "react";
import { AuthContext } from "./AuthContext";
import { IUser } from "@/types/user";

export interface AuthProviderProps {
	user: IUser | null;
	children: React.ReactNode;
}

export const AuthProvider: React.FunctionComponent<AuthProviderProps> = ({
	user,
	children,
}) => {
	return (
		<AuthContext.Provider
			value={{
				user,
			}}
		>
			{children}
		</AuthContext.Provider>
	);
};
