"use client";

import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";

export default function LogoutButton() {
  const router = useRouter();
  const supabase = createClient();

  const handleLogout = async () => {
    toast.info("Saindo...");
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error("Logout error:", error);
      toast.error("Erro ao sair: " + error.message);
    } else {
      toast.success("Você saiu com sucesso.");
      // Refresh the page to allow middleware to redirect to login
      router.refresh();
      // Or redirect directly
      // router.push("/login");
    }
  };

  return (
    <button
      onClick={handleLogout}
      className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 block text-center py-2 text-sm w-full"
    >
      Sair
    </button>
  );
}

