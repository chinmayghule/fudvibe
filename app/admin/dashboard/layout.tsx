"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { useEffect, useState } from "react";
import { Loader2, LogOut, Utensils } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSettings } from "@/context/SettingsContext";

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading, logout } = useAuth();
  const { settings } = useSettings();
  const router = useRouter();
  const [isLogoutOpen, setIsLogoutOpen] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/admin");
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (settings?.businessName) {
      document.title = `${settings.businessName}: Dashboard`;
    } else {
      document.title = "Admin Dashboard";
    }
  }, [settings]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect via useEffect
  }

  const handleLogout = async () => {
    await logout();
    setIsLogoutOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 transition-colors">
      <header className="bg-white/80 backdrop-blur-md border-b border-gray-100 sticky top-0 z-10 shadow-sm transition-colors">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 sm:h-9 sm:w-9 rounded-full overflow-hidden border border-gray-100 flex items-center justify-center bg-gray-50 shrink-0">
               {settings?.businessIcon ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={settings.businessIcon} alt="Logo" className="h-full w-full object-cover" />
               ) : (
                  <Utensils className="h-4 w-4 text-primary" />
               )}
            </div>
            <h1 className="text-lg sm:text-xl font-bold text-gray-900 truncate max-w-[300px] sm:max-w-none">
              {settings?.businessName || "Admin"} Dashboard
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <Dialog open={isLogoutOpen} onOpenChange={setIsLogoutOpen}>
              <DialogTrigger asChild>
                <Button variant="ghost" size="sm" className="text-gray-600 hover:text-red-600">
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Confirm Logout</DialogTitle>
                  <DialogDescription>
                    Are you sure you want to log out of the admin panel?
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <Button variant="ghost" onClick={() => setIsLogoutOpen(false)}>Cancel</Button>
                  <Button variant="danger" onClick={handleLogout}>Log out</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </header>
      <main className="container mx-auto px-4 py-8">{children}</main>
    </div>
  );
}
