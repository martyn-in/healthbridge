"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserButton } from "@clerk/nextjs";
import {
  LayoutDashboard,
  CalendarDays,
  Users,
  FileSignature,
  MessageSquare,
  Settings,
} from "lucide-react";
import { motion } from "framer-motion";

const sidebarLinks = [
  { name: "Dashboard", href: "/dashboard/doctor", icon: LayoutDashboard },
  { name: "Schedule", href: "/dashboard/doctor/appointments", icon: CalendarDays },
  { name: "Patients", href: "/dashboard/doctor/patients", icon: Users },
  { name: "Prescriptions", href: "/dashboard/doctor/prescriptions", icon: FileSignature },
  { name: "Messages", href: "/dashboard/doctor/messages", icon: MessageSquare },
  { name: "Settings", href: "/dashboard/doctor/settings", icon: Settings },
];

export default function DoctorSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-72 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl border-r border-gray-200 dark:border-zinc-800 h-screen flex flex-col transition-all">
      <div className="p-6 flex items-center gap-3">
        <div className="w-10 h-10 bg-indigo-500 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-indigo-500/30">
          HB
        </div>
        <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-blue-400">
          Doctor Panel
        </h1>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-2">
        {sidebarLinks.map((link) => {
          const isActive = pathname === link.href;
          const Icon = link.icon;

          return (
            <Link key={link.name} href={link.href}>
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                  isActive
                    ? "bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 font-medium"
                    : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-zinc-800/50"
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? "text-indigo-500" : ""}`} />
                {link.name}
              </motion.div>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-gray-200 dark:border-zinc-800 flex items-center justify-between">
        <UserButton appearance={{ elements: { avatarBox: "w-10 h-10" } }} />
      </div>
    </aside>
  );
}
