import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function Home() {
  const { sessionClaims } = await auth();

  // Redirect based on Clerk RBAC metadata
  if (sessionClaims?.role === "org:patient") {
    redirect("/dashboard/patient");
  } else if (sessionClaims?.role === "org:doctor") {
    redirect("/dashboard/doctor");
  } else if (sessionClaims?.role === "org:receptionist") {
    redirect("/dashboard/receptionist");
  } else if (sessionClaims?.role === "org:clinic_admin") {
    redirect("/dashboard/clinic-admin");
  } else if (sessionClaims?.role === "org:super_admin") {
    redirect("/dashboard/super-admin");
  }

  // If no specific role or not logged in, redirect to onboarding or generic dashboard
  redirect("/dashboard/patient");
}
