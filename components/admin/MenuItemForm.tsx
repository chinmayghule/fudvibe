"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { 
  getMenuItems, 
  addMenuItem, 
  updateMenuItem, 
  getCategories, 
  addCategory, 
  getGalleryImages,
  type MenuItem, 
  type Category,
  type GalleryImage
} from "@/lib/db";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
} from "@/components/ui/dialog";
import { formatCurrency, cn } from "@/lib/utils";
import { Loader2, Plus, ArrowUp, ArrowDown, Trash2, Check, Leaf, Bone, ArrowLeft, ChevronDown } from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select } from "@/components/ui/select";

interface MenuItemFormProps {
  initialData?: MenuItem;
  isEditing?: boolean;
}

export function MenuItemForm({ initialData, isEditing = false }: MenuItemFormProps) {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [dataLoading, setDataLoading] = useState(true);
  
  // Image Picker State
  const [isImagePickerOpen, setIsImagePickerOpen] = useState(false);
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([]);
  const [loadingGallery, setLoadingGallery] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    price: "",
    categoryId: "",
    description: "",
    available: true,
    visible: true,
    imageUrls: [] as string[],
    type: "veg" as "veg" | "non-veg",
  });

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const catData = await getCategories();
        setCategories(catData);
        
        // If we're creating a new item and have categories, default to the first one
        if (!isEditing && catData.length > 0 && !formData.categoryId) {
          setFormData(prev => ({ ...prev, categoryId: catData[0].id }));
        }
      } catch (err) {
        console.error("Failed to load categories:", err);
        toast.error("Failed to load categories");
      } finally {
        setDataLoading(false);
      }
    };
    loadCategories();
  }, [isEditing, formData.categoryId]);

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name,
        price: initialData.price.toString(),
        categoryId: initialData.categoryId || "",
        description: initialData.description || "",
        available: initialData.available,
        visible: initialData.visible,
        imageUrls: Array.isArray(initialData.imageUrls) ? initialData.imageUrls : [],
        type: initialData.type || "veg",
      });
    }
  }, [initialData]);

  useEffect(() => {
    if (isImagePickerOpen) {
      setLoadingGallery(true);
      getGalleryImages().then(imgs => {
        setGalleryImages(imgs);
        setLoadingGallery(false);
      });
    }
  }, [isImagePickerOpen]);

  // If initialData is still loading (for edit mode) or categories are loading, show minimal loader
  // However, we passed initialData as prop which means it should be ready if the parent fetched it.
  // We'll just check if categories are loaded.

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (!formData.categoryId) {
      toast.error("Please select a category");
      setLoading(false);
      return;
    }

    const itemData = {
      name: formData.name,
      price: parseFloat(formData.price),
      categoryId: formData.categoryId,
      description: formData.description,
      available: formData.available,
      visible: formData.visible,
      imageUrls: formData.imageUrls,
      type: formData.type,
    };

    try {

      if (isEditing && initialData) {
        await updateMenuItem(initialData.id, itemData);
        toast.success("Item updated successfully");
      } else {
        await addMenuItem(itemData);
        toast.success("Item added successfully");
      }
      router.push("/admin/dashboard");
      router.refresh();
    } catch (error) {
      console.error(error);
      toast.error("An error occurred");
    } finally {
      setLoading(false);
    }
  };

  if (dataLoading) {
    return <div className="flex justify-center py-10"><Loader2 className="h-8 w-8 animate-spin" /></div>;
  }

  return (
    <div className="max-w-5xl mx-auto pb-10">
      <div className="mb-6 flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-2xl font-bold tracking-tight">
          {isEditing ? "Edit Menu Item" : "Create New Item"}
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column: Basic Details */}
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Basic Details</CardTitle>
              <CardDescription>Enter the core information for this dish.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Item Name</Label>
                <Input 
                  id="name" 
                  value={formData.name} 
                  onChange={(e) => setFormData({...formData, name: e.target.value})} 
                  placeholder="e.g. Butter Chicken"
                  required 
                  className="text-lg"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="price">Price (₹)</Label>
                  <Input 
                    id="price" 
                    type="number" 
                    step="0.01" 
                    value={formData.price} 
                    onChange={(e) => setFormData({...formData, price: e.target.value})} 
                    placeholder="0.00"
                    required 
                  />
                </div>
                <div className="grid gap-2">
                  <Label>Item Type</Label>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setFormData({...formData, type: 'veg'})}
                      className={cn(
                        "flex-1 flex items-center justify-center gap-2 h-10 border rounded-md transition-all text-sm",
                        formData.type === 'veg' ? "border-green-600 bg-green-50 text-green-700 font-bold" : "bg-white text-gray-500 hover:bg-gray-50"
                      )}
                    >
                      <Leaf className="h-4 w-4" /> Veg
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormData({...formData, type: 'non-veg'})}
                      className={cn(
                        "flex-1 flex items-center justify-center gap-2 h-10 border rounded-md transition-all text-sm",
                        formData.type === 'non-veg' ? "border-red-600 bg-red-50 text-red-700 font-bold" : "bg-white text-gray-500 hover:bg-gray-50"
                      )}
                    >
                      <Bone className="h-4 w-4" /> Non-Veg
                    </button>
                  </div>
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="category">Category</Label>
                <Select 
                  value={formData.categoryId}
                  onValueChange={(val) => setFormData({...formData, categoryId: val})}
                  placeholder="Select category"
                  options={categories.map(cat => ({ value: cat.id, label: cat.name }))}
                />
                <p className="text-[10px] text-muted-foreground">Manage categories in the Categories tab.</p>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="description">Description (Optional)</Label>
                <textarea 
                  id="description" 
                  value={formData.description} 
                  onChange={(e) => setFormData({...formData, description: e.target.value})} 
                  className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  placeholder="Describe the ingredients and taste..."
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Media & Settings */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="space-y-0.5">
                  <Label htmlFor="available" className="text-base">Available</Label>
                  <p className="text-xs text-muted-foreground">Is this item currently in stock?</p>
                </div>
                <Switch 
                  id="available" 
                  checked={formData.available} 
                  onCheckedChange={(c) => setFormData({...formData, available: c})} 
                />
              </div>
              <div className="flex items-center justify-between p-3 border rounded-lg">
                 <div className="space-y-0.5">
                  <Label htmlFor="visible" className="text-base">Visible</Label>
                   <p className="text-xs text-muted-foreground">Show this item on the public menu?</p>
                </div>
                <Switch 
                  id="visible" 
                  checked={formData.visible} 
                  onCheckedChange={(c) => setFormData({...formData, visible: c})} 
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Images</CardTitle>
              <CardDescription>Select images from your gallery used for this item.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
               {/* Selected Images List */}
               <div className="space-y-2">
                {formData.imageUrls.length === 0 ? (
                  <div className="text-sm text-gray-500 italic p-6 border border-dashed rounded-lg text-center bg-gray-50">
                    No images selected.
                  </div>
                ) : (
                  formData.imageUrls.map((url, index) => (
                    <div key={index} className="group relative flex items-center gap-3 p-3 border rounded-lg bg-white shadow-sm hover:border-gray-300 transition-colors">
                      <div className="h-16 w-16 shrink-0 bg-gray-100 rounded-md overflow-hidden border border-gray-200">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={url} alt="Item" className="h-full w-full object-cover" />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                         <div className="flex gap-1 justify-end">
                            <Button 
                              type="button" variant="ghost" size="icon" className="h-8 w-8 text-gray-500"
                              disabled={index === 0}
                              onClick={() => {
                                const newUrls = [...formData.imageUrls];
                                [newUrls[index - 1], newUrls[index]] = [newUrls[index], newUrls[index - 1]];
                                setFormData({...formData, imageUrls: newUrls});
                              }}
                            >
                              <ArrowUp className="h-4 w-4" />
                            </Button>
                            <Button 
                              type="button" variant="ghost" size="icon" className="h-8 w-8 text-gray-500"
                              disabled={index === formData.imageUrls.length - 1}
                              onClick={() => {
                                const newUrls = [...formData.imageUrls];
                                [newUrls[index + 1], newUrls[index]] = [newUrls[index], newUrls[index + 1]];
                                setFormData({...formData, imageUrls: newUrls});
                              }}
                            >
                              <ArrowDown className="h-4 w-4" />
                            </Button>
                             <Button 
                              type="button" variant="ghost" size="icon" className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50"
                              onClick={() => {
                                const newUrls = formData.imageUrls.filter((_, i) => i !== index);
                                setFormData({...formData, imageUrls: newUrls});
                              }}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

               <Button type="button" variant="secondary" className="w-full" onClick={() => setIsImagePickerOpen(true)}>
                  <Plus className="mr-2 h-4 w-4" /> Select from Gallery
                </Button>
            </CardContent>
          </Card>
        </div>

        {/* Footer Actions */}
        <div className="md:col-span-3 flex justify-end gap-4 pt-6 mt-6 border-t">
          <Button type="button" variant="ghost" onClick={() => router.back()} disabled={loading}>
            Cancel
          </Button>
          <Button type="submit" disabled={loading} className="min-w-[150px]">
            {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
            {isEditing ? "Save Changes" : "Create Item"}
          </Button>
        </div>
      </form>

      {/* Image Picker Dialog */}
      <Dialog open={isImagePickerOpen} onOpenChange={setIsImagePickerOpen}>
        <DialogContent className="sm:max-w-[800px] h-[80vh] flex flex-col">
          <DialogHeader>
            <DialogTitle>Select Images</DialogTitle>
            <DialogDescription>
              Choose images from your library to add to this menu item.
            </DialogDescription>
          </DialogHeader>
          
          <div className="flex-1 overflow-y-auto min-h-0 py-4 px-1">
            {loadingGallery ? (
              <div className="flex justify-center py-20">
                <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
              </div>
            ) : galleryImages.length === 0 ? (
              <div className="text-center py-20 text-gray-500">
                No images in gallery. Go to the "Image Gallery" tab to add some.
              </div>
            ) : (
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4">
                {galleryImages.map((img) => {
                  const isSelected = formData.imageUrls.includes(img.url);
                  return (
                    <div 
                      key={img.id} 
                      className={cn(
                        "group relative aspect-square rounded-xl overflow-hidden border-2 cursor-pointer transition-all shadow-sm",
                        isSelected ? "border-primary ring-2 ring-primary/30" : "border-gray-200 hover:border-gray-300 hover:shadow-md"
                      )}
                      onClick={() => {
                        if (isSelected) {
                          // Remove if already selected
                            setFormData(prev => ({ 
                              ...prev, 
                              imageUrls: prev.imageUrls.filter(u => u !== img.url) 
                            }));
                        } else {
                          // Add if not selected
                          setFormData(prev => ({ 
                            ...prev, 
                            imageUrls: [...prev.imageUrls, img.url] 
                          }));
                        }
                      }}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={img.url} alt="Gallery item" className="w-full h-full object-cover" />
                      
                      <div className={cn(
                        "absolute inset-0 transition-colors flex items-center justify-center",
                        isSelected ? "bg-primary/20 backdrop-blur-[1px]" : "bg-black/0 group-hover:bg-black/5"
                      )}>
                        {isSelected && (
                          <div className="bg-primary text-white rounded-full p-2 shadow-sm animate-in zoom-in-50 duration-200">
                            <Check className="h-6 w-6" />
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <DialogFooter>
            <Button onClick={() => setIsImagePickerOpen(false)} className="w-full sm:w-auto">
              Done Selecting
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
