// /home/ubuntu/zapp_report_app/src/app/dashboard/layout.tsx
import Link from "next/link";
import LogoutButton from "@/components/LogoutButton"; // Import the LogoutButton component

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Middleware handles route protection

  return (
    <div className="flex min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white">
      {/* Sidebar Navigation */}
      <aside className="w-64 bg-white dark:bg-gray-800 p-4 flex flex-col shadow-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-indigo-600 dark:text-indigo-400">Omni Platform</h2>
        <nav className="flex flex-col gap-2">
          <Link href="/dashboard" className="text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white px-3 py-2 rounded-md text-sm font-medium">Visão Geral</Link>
          <Link href="/dashboard/contacts" className="text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white px-3 py-2 rounded-md text-sm font-medium">Contatos</Link>
          <Link href="/dashboard/channels" className="text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white px-3 py-2 rounded-md text-sm font-medium">Canais</Link>
          {/* Add links for Chatbot, Campaigns, Settings later */}
        </nav>
        <div className="mt-auto">
          {/* Use the LogoutButton component */}
          <LogoutButton />
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-6 overflow-auto">
        {children}
      </main>
    </div>
  );
}

