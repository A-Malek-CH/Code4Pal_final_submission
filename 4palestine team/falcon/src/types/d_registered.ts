export interface RegisteredUser {
  id: string;
  name: string;
  email: string;
  joined_date: Date;
  verified: boolean;
  sos: number;
  status: "active" | "suspended";
}