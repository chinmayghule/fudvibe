"use client";

import React, { useState, useEffect } from "react";
import { 
  getCategories, 
  addCategory, 
  updateCategory, 
  deleteCategory, 
  getMenuItemsByCategory,
  Category,
  MenuItem
} from "@/lib/db";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Plus, 
  Pencil, 
  Trash2, 
  X, 
  Check, 
  Loader2, 
  Search,
  LayoutGrid
} from "lucide-react";
import { toast } from "sonner";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export function CategoryManager() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");
  const [newValue, setNewValue] = useState("");
  const [isAdding, setIsAdding] = useState(false);

  // Deletion state
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [blockingItems, setBlockingItems] = useState<MenuItem[]>([]);
  const [isCheckingItems, setIsCheckingItems] = useState(false);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    setLoading(true);
    try {
      const data = await getCategories();
      setCategories(data);
    } catch (err) {
      toast.error("Failed to load categories");
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async () => {
    if (!newValue.trim()) {
      toast.error("Category name cannot be empty");
      return;
    }
    try {
      await addCategory(newValue.trim());
      setNewValue("");
      setIsAdding(false);
      toast.success("Category added successfully");
      loadCategories();
    } catch (err) {
      toast.error("Failed to add category");
    }
  };

  const handleUpdate = async (id: string) => {
    if (!editValue.trim()) {
      toast.error("Category name cannot be empty");
      return;
    }
    try {
      await updateCategory(id, editValue.trim());
      setEditingId(null);
      toast.success("Category updated successfully");
      loadCategories();
    } catch (err) {
      toast.error("Failed to update category");
    }
  };

  const handleDeleteClick = async (category: Category) => {
    setCategoryToDelete(category);
    setDeleteDialogOpen(true);
    setBlockingItems([]);
    setIsCheckingItems(true);
    
    try {
      const items = await getMenuItemsByCategory(category.id);
      setBlockingItems(items);
    } catch (err) {
      console.error("Failed to check items in category:", err);
    } finally {
      setIsCheckingItems(false);
    }
  };

  const confirmDelete = async () => {
    if (!categoryToDelete) return;
    
    setIsDeleting(true);
    try {
      await deleteCategory(categoryToDelete.id);
      toast.success("Category deleted successfully");
      setDeleteDialogOpen(false);
      setCategoryToDelete(null);
      loadCategories();
    } catch (err) {
      toast.error("Failed to delete category");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-gray-900 tracking-tight">Manage Categories</h2>
          <p className="text-gray-500 text-sm">Organize your menu by creating and editing dish categories.</p>
        </div>
        <Button 
          onClick={() => setIsAdding(true)}
          className="bg-primary hover:bg-primary/90 text-white font-bold rounded-xl shadow-lg shadow-primary/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
          disabled={isAdding}
        >
          <Plus className="h-5 w-5 mr-2" /> Add Category
        </Button>
      </div>

      <div className="grid gap-4">
        {isAdding && (
          <div className="border border-primary/20 bg-primary/5 rounded-2xl p-4 animate-in slide-in-from-top-2 duration-200">
            <div className="flex items-center gap-3">
              <Input 
                placeholder="New category name (e.g. Desserts)"
                value={newValue}
                onChange={(e) => setNewValue(e.target.value)}
                className="h-11 rounded-xl bg-white"
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleAdd();
                  if (e.key === 'Escape') setIsAdding(false);
                }}
              />
              <div className="flex gap-2">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => setIsAdding(false)}
                  className="h-11 w-11 rounded-xl"
                >
                  <X className="h-5 w-5" />
                </Button>
                <Button 
                  onClick={handleAdd}
                  className="h-11 w-11 rounded-xl bg-green-600 hover:bg-green-700 text-white"
                >
                  <Check className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>
        )}

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-400 gap-4 bg-white rounded-3xl border border-gray-50 transition-colors">
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
            <p className="font-medium">Loading categories...</p>
          </div>
        ) : categories.length === 0 ? (
          <div className="text-center py-20 bg-gray-50/50 rounded-3xl border-2 border-dashed border-gray-200 flex flex-col items-center">
            <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mb-4 text-gray-400">
               <LayoutGrid className="h-8 w-8" />
            </div>
            <h3 className="text-lg font-bold text-gray-900">No categories found</h3>
            <p className="text-gray-500 max-w-sm mx-auto mt-1">Start by adding categories to organize your restaurant menu items.</p>
          </div>
        ) : (
          <Card className="rounded-2xl border border-gray-100 overflow-hidden shadow-sm bg-white">
            <div className="divide-y divide-gray-100">
              {categories.map((category) => (
                <div 
                  key={category.id} 
                  className={cn(
                    "group flex items-center justify-between p-4 transition-colors hover:bg-gray-50/50",
                    editingId === category.id && "bg-primary/[0.02]"
                  )}
                >
                  {editingId === category.id ? (
                    <div className="flex items-center gap-2 flex-1 animate-in fade-in duration-200">
                      <Input 
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        className="h-10 text-md rounded-lg focus:ring-primary border-gray-200 bg-white"
                        autoFocus
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleUpdate(category.id);
                          if (e.key === 'Escape') setEditingId(null);
                        }}
                      />
                      <Button 
                        size="icon" 
                        onClick={() => handleUpdate(category.id)}
                        className="bg-green-600 hover:bg-green-700 text-white rounded-lg h-10 w-10 shrink-0"
                      >
                        <Check className="h-5 w-5" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => setEditingId(null)}
                        className="text-gray-400 rounded-lg h-10 w-10 shrink-0"
                      >
                        <X className="h-5 w-5" />
                      </Button>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-center gap-3 overflow-hidden">
                        <div className="h-9 w-9 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400 group-hover:text-primary transition-colors shrink-0">
                          <LayoutGrid className="h-4 w-4" />
                        </div>
                        <span className="font-bold text-gray-800 text-base truncate">{category.name}</span>
                      </div>
                      <div className="flex gap-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => {
                            setEditingId(category.id);
                            setEditValue(category.name);
                          }}
                          className="h-9 w-9 rounded-lg text-gray-400 hover:text-primary hover:bg-primary/5"
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => handleDeleteClick(category)}
                          className="h-9 w-9 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          </Card>
        )}
      </div>

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[450px] rounded-2xl">
          <DialogHeader>
            <DialogTitle className={cn(
              "text-xl font-black",
              blockingItems.length > 0 ? "text-amber-600" : "text-red-600"
            )}>
              {blockingItems.length > 0 ? "Cannot Delete Category" : "Delete Category?"}
            </DialogTitle>
            <DialogDescription className="text-gray-500 pt-2 text-base">
              {isCheckingItems ? (
                <span className="flex items-center gap-2 py-2">
                  <Loader2 className="h-4 w-4 animate-spin text-primary" />
                  Checking for assigned items...
                </span>
              ) : blockingItems.length > 0 ? (
                <>
                  The category <strong className="text-gray-900">"{categoryToDelete?.name}"</strong> is currently assigned to <strong className="text-gray-900">{blockingItems.length}</strong> menu item{blockingItems.length > 1 ? 's' : ''}. 
                  Please reassign or delete these items before deleting the category.
                </>
              ) : (
                <>
                  Are you sure you want to delete <strong className="text-gray-900">"{categoryToDelete?.name}"</strong>? This action cannot be undone.
                </>
              )}
            </DialogDescription>
          </DialogHeader>

          {!isCheckingItems && blockingItems.length > 0 && (
            <div className="mt-4 bg-gray-50 rounded-xl p-4 border border-gray-100">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Assigned Menu Items:</p>
              <div className="max-h-[200px] overflow-y-auto space-y-2 pr-2 custom-scrollbar">
                {blockingItems.map((item) => (
                  <div key={item.id} className="flex items-center gap-2 text-sm bg-white p-2 rounded-lg border border-gray-100 shadow-sm">
                    <div className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                    <span className="font-bold text-gray-700">{item.name}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <DialogFooter className="mt-6 flex flex-col sm:flex-row gap-2">
            <Button 
              variant="secondary" 
              onClick={() => setDeleteDialogOpen(false)}
              className="rounded-xl font-bold flex-1"
            >
              {blockingItems.length > 0 ? "Understood" : "Cancel"}
            </Button>
            {blockingItems.length === 0 && !isCheckingItems && (
              <Button 
                variant="danger" 
                onClick={confirmDelete}
                disabled={isDeleting}
                className="rounded-xl font-bold bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-200 flex-1"
              >
                {isDeleting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Deleting...
                  </>
                ) : "Delete Category"}
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function cn(...classes: any[]) {
  return classes.filter(Boolean).join(" ");
}
