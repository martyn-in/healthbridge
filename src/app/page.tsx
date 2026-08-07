import { redirect } from 'next/navigation';

export default function RootPage() {
  // Permanently redirect root URL to /dashboard (gated by AuthGuard -> /login if unauthenticated)
  redirect('/dashboard');
}
