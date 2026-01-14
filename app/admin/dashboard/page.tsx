"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MenuManager } from "@/components/admin/MenuManager";
import { CategoryManager } from "@/components/admin/CategoryManager";
import { SettingsManager } from "@/components/admin/SettingsManager";
import { BusinessInfoManager } from "@/components/admin/BusinessInfoManager";
import { ImageGalleryManager } from "@/components/admin/ImageGalleryManager";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";

import { ChevronDown, Menu as MenuIcon, Info, Settings as SettingsIcon, Image as ImageIcon, LayoutGrid } from "lucide-react";
import { cn } from "@/lib/utils";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("menu");
  const [isOpen, setIsOpen] = useState(false);

  const tabLabels: Record<string, string> = {
    menu: "Menu Management",
    categories: "Categories",
    gallery: "Image Gallery",
    info: "Business Info",
    settings: "Business Settings",
  };

  const TabIcon = ({ value }: { value: string }) => {
    switch (value) {
      case "menu": return <MenuIcon className="h-4 w-4" />;
      case "categories": return <LayoutGrid className="h-4 w-4" />;
      case "gallery": return <ImageIcon className="h-4 w-4" />;
      case "info": return <Info className="h-4 w-4" />;
      case "settings": return <SettingsIcon className="h-4 w-4" />;
      default: return null;
    }
  };

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        {/* Compact Mobile Tab Switcher (Custom Dropdown) */}
        <div className="md:hidden relative">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="w-full h-14 bg-white rounded-2xl border-2 border-gray-100 px-5 flex items-center justify-between shadow-sm active:scale-[0.98] transition-all"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg text-primary">
                <TabIcon value={activeTab} />
              </div>
              <span className="font-bold text-gray-800">{tabLabels[activeTab]}</span>
            </div>
            <ChevronDown className={cn("h-5 w-5 text-gray-400 transition-transform duration-300", isOpen && "rotate-180")} />
          </button>

          {isOpen && (
            <>
              <div className="fixed inset-0 z-20" onClick={() => setIsOpen(false)} />
              <div className="absolute top-[calc(100%+8px)] left-0 right-0 bg-white rounded-2xl border-2 border-gray-50 shadow-xl z-30 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                {Object.entries(tabLabels).map(([value, label]) => (
                  <button
                    key={value}
                    onClick={() => {
                      setActiveTab(value);
                      setIsOpen(false);
                    }}
                    className={cn(
                      "w-full h-14 px-5 flex items-center gap-3 transition-colors",
                      activeTab === value ? "bg-primary/5 text-primary" : "text-gray-600 hover:bg-gray-50"
                    )}
                  >
                    <TabIcon value={value} />
                    <span className={cn("font-bold text-sm", activeTab === value ? "text-primary" : "text-gray-600")}>
                      {label}
                    </span>
                    {activeTab === value && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary" />}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Desktop Tabs List */}
        <TabsList className="hidden md:flex h-12 bg-white p-1 rounded-xl border-2 border-gray-100 w-fit">
          <TabsTrigger value="menu" className="rounded-lg px-6 data-[state=active]:bg-primary data-[state=active]:text-white transition-all">
            <MenuIcon className="h-4 w-4 mr-2" /> Menu
          </TabsTrigger>
          <TabsTrigger value="categories" className="rounded-lg px-6 data-[state=active]:bg-primary data-[state=active]:text-white transition-all">
            <LayoutGrid className="h-4 w-4 mr-2" /> Categories
          </TabsTrigger>
          <TabsTrigger value="gallery" className="rounded-lg px-6 data-[state=active]:bg-primary data-[state=active]:text-white transition-all">
            <ImageIcon className="h-4 w-4 mr-2" /> Gallery
          </TabsTrigger>
          <TabsTrigger value="info" className="rounded-lg px-6 data-[state=active]:bg-primary data-[state=active]:text-white transition-all">
            <Info className="h-4 w-4 mr-2" /> Business
          </TabsTrigger>
          <TabsTrigger value="settings" className="rounded-lg px-6 data-[state=active]:bg-primary data-[state=active]:text-white transition-all">
            <SettingsIcon className="h-4 w-4 mr-2" /> Settings
          </TabsTrigger>
        </TabsList>

        <div className="pt-2">
          <TabsContent value="menu" className="animate-in fade-in slide-in-from-bottom-2 duration-300 outline-none">
            <MenuManager />
          </TabsContent>
          <TabsContent value="categories" className="animate-in fade-in slide-in-from-bottom-2 duration-300 outline-none">
            <CategoryManager />
          </TabsContent>
          <TabsContent value="gallery" className="animate-in fade-in slide-in-from-bottom-2 duration-300 outline-none">
            <ImageGalleryManager />
          </TabsContent>
          <TabsContent value="info" className="animate-in fade-in slide-in-from-bottom-2 duration-300 outline-none">
            <BusinessInfoManager />
          </TabsContent>
          <TabsContent value="settings" className="animate-in fade-in slide-in-from-bottom-2 duration-300 outline-none">
            <SettingsManager />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
