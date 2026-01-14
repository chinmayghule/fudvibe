"use client";

import { MenuItemForm } from "@/components/admin/MenuItemForm";
import { getMenuItems, type MenuItem } from "@/lib/db";
import { Loader2 } from "lucide-react";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function EditMenuItemPage() {
  const params = useParams();
  const [item, setItem] = useState<MenuItem | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchItem = async () => {
      try {
        const items = await getMenuItems(); // In a real app we'd fetch single doc, but our db helper fetches all. Optimized later.
        const foundItem = items.find(i => i.id === params.id);
        if (foundItem) {
          setItem(foundItem);
        } else {
          toast.error("Item not found");
        }
      } catch (error) {
        console.error("Error fetching item:", error);
        toast.error("Failed to load item");
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchItem();
    }
  }, [params.id]);

  if (loading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    );
  }

  if (!item) {
    return (
      <div className="flex h-[50vh] flex-col items-center justify-center text-gray-500">
        <p>Item not found</p>
      </div>
    );
  }

  return <MenuItemForm initialData={item} isEditing={true} />;
}
