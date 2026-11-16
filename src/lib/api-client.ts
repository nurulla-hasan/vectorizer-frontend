import { ofetch } from "ofetch";

export const API_BASE_URL = (
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000/api/v1"
).replace(/\/$/, "");

export const apiClient = ofetch.create({
  baseURL: API_BASE_URL,
  credentials: "include",
  retry: 0,
});

export default apiClient;
