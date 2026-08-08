import { ConvexHttpClient } from "convex/browser";

const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL!;

if (!convexUrl) {
  console.error("NEXT_PUBLIC_CONVEX_URL is not set");
}

export const convex = new ConvexHttpClient(convexUrl || "https://bold-dodo-2.convex.cloud");
