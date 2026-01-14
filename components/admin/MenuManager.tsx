"use client";

import { useEffect, useState } from "react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

import { useRouter } from "next/navigation";
import { 
  getMenuItems, 
  deleteMenuItem, 
  type MenuItem,
  updateMenuItem, 
} from "@/lib/db";
import { formatCurrency, cn } from "@/lib/utils";
import { Loader2, Plus, Pencil, Trash2, ImageOff, Leaf, Bone, ArrowUp, ArrowDown, Check } from "lucide-react";
import { toast } from "sonner";

export function MenuManager() {
  const router = useRouter();
  const [items, setItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<MenuItem | null>(null);

  const fetchItems = async () => {
    setLoading(true);
    try {
      const menuData = await getMenuItems();
      setItems(menuData);
    } catch (err) {
      console.error("Failed to fetch data:", err);
      toast.error("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleEdit = (item: MenuItem) => {
    router.push(`/admin/dashboard/menu/${item.id}`);
  };

  const handleAddNew = () => {
    router.push("/admin/dashboard/menu/new");
  }

  const handleDeleteClick = (item: MenuItem) => {
    setItemToDelete(item);
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!itemToDelete) return;
    try {
      await deleteMenuItem(itemToDelete.id);
      toast.success("Item deleted");
      setIsDeleteDialogOpen(false);
      setItemToDelete(null);
      fetchItems();
    } catch (err) {
      toast.error("Failed to delete item");
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Menu Items</h3>
        <div>
            <Button onClick={handleAddNew}>
              <Plus className="mr-2 h-4 w-4" /> Add Item
            </Button>
            
            <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
              <DialogContent className="sm:max-w-[400px]">
                <DialogHeader>
                  <DialogTitle className="text-red-600">Delete Menu Item?</DialogTitle>
                  <DialogDescription>
                    Are you sure you want to delete <strong>{itemToDelete?.name}</strong>? This action cannot be undone.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter className="gap-2 sm:gap-0">
                  <Button type="button" variant="ghost" onClick={() => setIsDeleteDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="button" variant="danger" onClick={handleConfirmDelete}>
                    Delete
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
        </div>
      </div>

        <div className="hidden md:block border rounded-md">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Image</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Available</TableHead>
                <TableHead>Visible</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin mx-auto" />
                  </TableCell>
                </TableRow>
              ) : items.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                    No items found. Add one to get started.
                  </TableCell>
                </TableRow>
              ) : (
                items.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      {item.imageUrls && item.imageUrls.length > 0 ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img 
                          src={item.imageUrls[0]} 
                          alt={item.name} 
                          className="h-10 w-10 rounded-md object-cover border" 
                        />
                      ) : (
                        <div className="h-10 w-10 rounded-md bg-gray-50 flex items-center justify-center border border-dashed">
                          <ImageOff className="h-4 w-4 text-gray-300" />
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      {item.type === "non-veg" ? (
                        <Bone className="h-4 w-4 text-red-500" />
                      ) : (
                        <Leaf className="h-4 w-4 text-green-500" />
                      )}
                    </TableCell>
                    <TableCell className="font-medium">{item.name}</TableCell>
                    <TableCell>{item.category}</TableCell>
                    <TableCell>{formatCurrency(item.price)}</TableCell>
                    <TableCell>
                      <Switch 
                        checked={item.available} 
                        onCheckedChange={async (checked) => {
                          await updateMenuItem(item.id, { available: checked });
                          toast.success(`${item.name} ${checked ? 'in stock' : 'sold out'}`);
                          fetchItems();
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <Switch 
                        checked={item.visible} 
                        onCheckedChange={async (checked) => {
                          await updateMenuItem(item.id, { visible: checked });
                          toast.success(`${item.name} ${checked ? 'visible' : 'hidden'}`);
                          fetchItems();
                        }}
                      />
                    </TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button variant="ghost" size="icon" onClick={() => handleEdit(item)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-600" onClick={() => handleDeleteClick(item)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Mobile View */}
        <div className="md:hidden space-y-4">
          {loading ? (
             <div className="text-center py-8">
               <Loader2 className="h-6 w-6 animate-spin mx-auto text-primary" />
             </div>
          ) : items.length === 0 ? (
             <div className="text-center py-8 text-muted-foreground border rounded-md bg-gray-50">
               No items found.
             </div>
          ) : (
            items.map((item) => (
              <div key={item.id} className="border rounded-lg p-4 bg-white shadow-sm space-y-3">
                <div className="flex gap-4">
                  {item.imageUrls && item.imageUrls.length > 0 ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img 
                      src={item.imageUrls[0]} 
                      alt={item.name} 
                      className="h-20 w-20 rounded-md object-cover border shrink-0" 
                    />
                  ) : (
                    <div className="h-20 w-20 rounded-md bg-gray-50 flex items-center justify-center border border-dashed shrink-0">
                      <ImageOff className="h-8 w-8 text-gray-300" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-1.5 mb-1">
                          {item.type === "non-veg" ? (
                             <Bone className="h-3 w-3 text-red-500" />
                          ) : (
                             <Leaf className="h-3 w-3 text-green-500" />
                          )}
                          <span className="text-xs font-medium text-muted-foreground uppercase">{item.category}</span>
                        </div>
                        <h4 className="font-bold truncate pr-2">{item.name}</h4>
                        <p className="font-medium text-primary mt-1">{formatCurrency(item.price)}</p>
                      </div>
                      <div className="flex">
                         <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleEdit(item)}>
                           <Pencil className="h-4 w-4" />
                         </Button>
                         <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500" onClick={() => handleDeleteClick(item)}>
                           <Trash2 className="h-4 w-4" />
                         </Button>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between pt-3 border-t bg-gray-50/50 -mx-4 -mb-4 px-4 py-3 mt-2 rounded-b-lg">
                  <div className="flex items-center gap-2">
                    <Switch 
                      id={`avail-${item.id}`}
                      checked={item.available} 
                      onCheckedChange={async (checked) => {
                        await updateMenuItem(item.id, { available: checked });
                        toast.success(`${item.name} ${checked ? 'in stock' : 'sold out'}`);
                        fetchItems();
                      }}
                    />
                    <Label htmlFor={`avail-${item.id}`} className="text-xs">Available</Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch 
                      id={`vis-${item.id}`}
                      checked={item.visible} 
                      onCheckedChange={async (checked) => {
                        await updateMenuItem(item.id, { visible: checked });
                        toast.success(`${item.name} ${checked ? 'visible' : 'hidden'}`);
                        fetchItems();
                      }}
                    />
                    <Label htmlFor={`vis-${item.id}`} className="text-xs">Visible</Label>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
    </div>
  );
}
