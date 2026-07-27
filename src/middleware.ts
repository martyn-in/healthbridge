import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'

// Protect specific routes
const isPatientRoute = createRouteMatcher(['/dashboard/patient(.*)'])
const isDoctorRoute = createRouteMatcher(['/dashboard/doctor(.*)'])
const isReceptionistRoute = createRouteMatcher(['/dashboard/receptionist(.*)'])
const isClinicAdminRoute = createRouteMatcher(['/dashboard/clinic-admin(.*)'])
const isSuperAdminRoute = createRouteMatcher(['/dashboard/super-admin(.*)'])
const isDashboardRoute = createRouteMatcher(['/dashboard(.*)'])

export default clerkMiddleware(async (auth, req) => {
  if (isPatientRoute(req)) await auth.protect({ role: 'org:patient' })
  if (isDoctorRoute(req)) await auth.protect({ role: 'org:doctor' })
  if (isReceptionistRoute(req)) await auth.protect({ role: 'org:receptionist' })
  if (isClinicAdminRoute(req)) await auth.protect({ role: 'org:clinic_admin' })
  if (isSuperAdminRoute(req)) await auth.protect({ role: 'org:super_admin' })

  // Protect all dashboard routes as a fallback
  if (isDashboardRoute(req)) {
    await auth.protect()
  }
})

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
}
