export interface VerifiedUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  type: string;
  joined_date: Date;
  markers: number;
  reports: number;
  status: "active" | "suspended"
}