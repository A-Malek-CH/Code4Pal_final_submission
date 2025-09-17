export interface MarkerType {
  id: string;
  lat: number;
  long: number;
  type: "food" | "water" | "danger" | "aid";
  description: string;
  image?: string;
  user_id: string;
  last_updated: Date;
  reports: number;
}
