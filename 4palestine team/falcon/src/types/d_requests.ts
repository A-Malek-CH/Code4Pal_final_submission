export type Request = {
  id: string // Adding an ID for internal table management
  name: string
  email: string
  phone: string
  type: "individual" | "organization"
  request_date: Date // Using Date object for datetime
  document: string // Storing document name/URL as a string
  status: "pending" | "approved" | "rejected"
}