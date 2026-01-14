"use client";

import { useEffect, useState } from "react";
import { getMenuItems, type MenuItem } from "@/lib/db";
import { useCart } from "@/context/CartContext";
import { useSettings } from "@/context/SettingsContext";
import { MenuItemCard } from "@/components/MenuItemCard";
import { Accordion, AccordionItem } from "@/components/ui/accordion";
import { Search } from "lucide-react";

// Sub-components
import { LoadingScreen } from "@/components/public-menu/LoadingScreen";
import { ErrorScreen } from "@/components/public-menu/ErrorScreen";
import { MenuHeader } from "@/components/public-menu/MenuHeader";
import { MenuSearch } from "@/components/public-menu/MenuSearch";
import { ImageCarousel } from "@/components/public-menu/ImageCarousel";

export default function CustomerMenuPage() {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [itemsLoading, setItemsLoading] = useState(true);
  const { settings, loading: settingsLoading } = useSettings();
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState(false);
  const [carouselItem, setCarouselItem] = useState<MenuItem | null>(null);
  const [carouselIndex, setCarouselIndex] = useState(0);

  const { items: cartItems, addItem, updateQuantity, count } = useCart();

  useEffect(() => {
    const loadMenu = async () => {
      try {
        const menuData = await getMenuItems(true); // Only visible items
        setItems(menuData);
      } catch (err) {
        console.error("Failed to load menu:", err);
        setError(true);
      } finally {
        setItemsLoading(false);
      }
    };

    loadMenu();
  }, []);

  useEffect(() => {
    if (settings?.businessName) {
      document.title = `${settings.businessName}: Menu`;
    } else {
      document.title = "Restaurant Menu";
    }
  }, [settings]);

  const categories = Array.from(new Set(items.map(i => i.category || "Uncategorized"))).sort();

  const filteredItems = items.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          item.description?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const groupedItems = categories.reduce((acc, category) => {
    const itemsInCategory = filteredItems.filter(i => (i.category || "Uncategorized") === category);
    if (itemsInCategory.length > 0) {
      acc[category] = itemsInCategory;
    }
    return acc;
  }, {} as Record<string, MenuItem[]>);

  if (settingsLoading || itemsLoading) {
    return <LoadingScreen settings={settings} />;
  }

  if (error) {
    return <ErrorScreen onRetry={() => window.location.reload()} />;
  }

  return (
    <div className="min-h-screen bg-gray-50 transition-colors">


      <MenuHeader settings={settings} cartCount={count} />

      <main className="container mx-auto px-4 py-6 space-y-6">
        <div className="max-w-4xl mx-auto">
          <MenuSearch value={searchTerm} onChange={setSearchTerm} />
        </div>

        <div className="max-w-4xl mx-auto space-y-6">
          <div className="space-y-4">
            {Object.entries(groupedItems).map(([category, itemsInCategory]) => (
              <Accordion key={category} className="border-none">
                <AccordionItem 
                  title={category} 
                  count={itemsInCategory.length}
                  defaultOpen={true}
                >
                    <div className="flex flex-col">
                      {itemsInCategory.map((item) => (
                        <MenuItemCard 
                          key={item.id}
                          item={item}
                          settings={settings}
                          cartItem={cartItems.find(i => i.id === item.id)}
                          addItem={addItem}
                          updateQuantity={updateQuantity}
                          onImageClick={(item) => {
                            setCarouselItem(item);
                            setCarouselIndex(0);
                          }}
                        />
                      ))}
                    </div>
                  </AccordionItem>
              </Accordion>
            ))}
          </div>

          {filteredItems.length === 0 && (
            <div className="text-center py-20 flex flex-col items-center">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                 <Search className="h-10 w-10 text-gray-300" />
              </div>
              <h3 className="text-xl font-bold text-gray-800">No dishes found</h3>
              <p className="text-gray-500">Try searching for something else</p>
            </div>
          )}
        </div>

        {carouselItem && (
          <ImageCarousel 
            item={carouselItem} 
            index={carouselIndex} 
            setIndex={setCarouselIndex} 
            onClose={() => setCarouselItem(null)} 
          />
        )}
      </main>
    </div>
  );
}
