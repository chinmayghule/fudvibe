"use client";

import { useState, useEffect } from "react";
import { getGalleryImages, addGalleryImage, deleteGalleryImage, type GalleryImage } from "@/lib/db";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Loader2, Trash2, Plus, Image as ImageIcon, ExternalLink, RefreshCw } from "lucide-react";
import { toast } from "sonner";

export function ImageGalleryManager() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [newImageUrl, setNewImageUrl] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  const fetchImages = async () => {
    setLoading(true);
    try {
      const data = await getGalleryImages();
      setImages(data);
    } catch (error) {
      console.error("Error fetching images:", error);
      toast.error("Failed to load image gallery");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchImages();
  }, []);

  const handleAddImage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newImageUrl.trim()) return;

    setIsAdding(true);
    try {
      await addGalleryImage(newImageUrl.trim());
      setNewImageUrl("");
      toast.success("Image added to gallery");
      fetchImages();
    } catch (error) {
      console.error("Error adding image:", error);
      toast.error("Failed to add image");
    } finally {
      setIsAdding(false);
    }
  };

  const handleDeleteImage = async (id: string) => {
    if (!confirm("Are you sure you want to delete this image? It might be in use by menu items.")) return;

    setIsDeleting(id);
    try {
      await deleteGalleryImage(id);
      setImages(images.filter(img => img.id !== id));
      toast.success("Image deleted from gallery");
    } catch (error) {
      console.error("Error deleting image:", error);
      toast.error("Failed to delete image");
    } finally {
      setIsDeleting(null);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Add New Image</CardTitle>
          <CardDescription>
            Paste image URLs to add them to your central library.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-6 bg-blue-50 border border-blue-100 rounded-lg p-4 flex gap-3 text-blue-800">
            <InfoIcon className="h-5 w-5 shrink-0" />
            <div className="text-sm">
              <p className="font-bold mb-1">How to host images?</p>
              <p className="mb-2">
                We recommend using <a href="https://postimages.org/" target="_blank" rel="noreferrer" className="underline font-bold hover:text-blue-900 inline-flex items-center">
                  postimages.org <ExternalLink className="h-3 w-3 ml-0.5" />
                </a> to host your images for free.
              </p>
              <ol className="list-decimal list-inside space-y-1 opacity-90 ml-1">
                <li>Upload your image to Postimages</li>
                <li>Copy the <strong>"Direct Link"</strong> (ends with .jpg or .png)</li>
                <li>Paste it below to add to your gallery</li>
              </ol>
            </div>
          </div>

          <form onSubmit={handleAddImage} className="flex gap-3">
            <div className="flex-1">
              <Label htmlFor="imageUrl" className="sr-only">Image URL</Label>
              <Input
                id="imageUrl"
                placeholder="Paste image URL here (e.g. https://i.postimg.cc/...)"
                value={newImageUrl}
                onChange={(e) => setNewImageUrl(e.target.value)}
                className="h-11"
              />
            </div>
            <Button type="submit" disabled={isAdding || !newImageUrl.trim()} className="h-11">
              {isAdding ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4 mr-2" />}
              Add Image
            </Button>
          </form>
        </CardContent>
      </Card>

      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Gallery Library ({images.length})</h3>
        <Button variant="secondary" size="sm" onClick={fetchImages} disabled={loading}>
          <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>

      {loading && images.length === 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {[1, 2, 3, 4, 5].map((n) => (
            <div key={n} className="aspect-square bg-gray-100 rounded-xl animate-pulse" />
          ))}
        </div>
      ) : images.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
            <ImageIcon className="h-8 w-8 text-gray-300" />
          </div>
          <h3 className="text-lg font-medium text-gray-900">No images yet</h3>
          <p className="text-gray-500 max-w-sm mx-auto mt-2">
            Add images using the form above to start building your library.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {images.map((img) => (
            <div key={img.id} className="group relative aspect-square bg-gray-100 rounded-xl overflow-hidden border border-gray-200 shadow-sm hover:shadow-md transition-all">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img 
                src={img.url} 
                alt="Gallery item" 
                className="w-full h-full object-cover"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
              
              <Button
                variant="danger"
                size="icon"
                className="absolute top-2 right-2 h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
                onClick={() => handleDeleteImage(img.id)}
                disabled={isDeleting === img.id}
              >
                {isDeleting === img.id ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Trash2 className="h-4 w-4" />
                )}
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function InfoIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M12 16v-4" />
      <path d="M12 8h.01" />
    </svg>
  );
}
