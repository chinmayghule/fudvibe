"use client";

import { useEffect, useState } from "react";
import { 
  getBusinessSettings, 
  updateBusinessSettings, 
  type BusinessSettings, 
  getGalleryImages, 
  type GalleryImage 
} from "@/lib/db";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { Loader2, LogOut, Image as ImageIcon, Plus, Check, Trash2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { cn } from "@/lib/utils";

export function SettingsManager() {
  const [settings, setSettings] = useState<BusinessSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditingPhone, setIsEditingPhone] = useState(false);
  const [phoneValue, setPhoneValue] = useState("");
  
  const [isEditingBranding, setIsEditingBranding] = useState(false);
  const [nameValue, setNameValue] = useState("");
  const [iconValue, setIconValue] = useState("");

  const [isImagePickerOpen, setIsImagePickerOpen] = useState(false);
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([]);
  const [loadingGallery, setLoadingGallery] = useState(false);

  const [isLogoutDialogOpen, setIsLogoutDialogOpen] = useState(false);
  const { logout } = useAuth();

  useEffect(() => {
    async function load() {
      try {
        const data = await getBusinessSettings();
        setSettings(data);
        setPhoneValue(data.whatsappNumber);
        setNameValue(data.businessName || "My Restaurant");
        setIconValue(data.businessIcon || "");
      } catch (err) {
        toast.error("Failed to load settings");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  useEffect(() => {
    if (isImagePickerOpen) {
      setLoadingGallery(true);
      getGalleryImages().then(imgs => {
        setGalleryImages(imgs);
        setLoadingGallery(false);
      });
    }
  }, [isImagePickerOpen]);

  const handleToggle = async (key: keyof BusinessSettings, value: boolean) => {
    if (!settings) return;
    try {
      await updateBusinessSettings({ [key]: value });
      setSettings({ ...settings, [key]: value });
      toast.success(`${key === "businessOpen" ? "Business status" : "Order acceptance"} updated`);
    } catch (err) {
      toast.error("Failed to update setting");
    }
  };

  const handleSavePhone = async () => {
    if (!settings) return;
    try {
      await updateBusinessSettings({ whatsappNumber: phoneValue });
      setSettings({ ...settings, whatsappNumber: phoneValue });
      setIsEditingPhone(false);
      toast.success("WhatsApp number updated");
    } catch (err) {
      toast.error("Failed to update WhatsApp number");
    }
  };

  const handleSaveBranding = async () => {
    if (!settings) return;
    
    const trimmedName = nameValue.trim();
    if (!trimmedName) {
      toast.error("Restaurant name cannot be empty");
      return;
    }

    try {
      await updateBusinessSettings({ 
        businessName: trimmedName,
        businessIcon: iconValue 
      });
      setSettings({ 
        ...settings, 
        businessName: trimmedName,
        businessIcon: iconValue 
      });
      setIsEditingBranding(false);
      setNameValue(trimmedName);
      toast.success("Identity settings updated");
    } catch (err) {
      toast.error("Failed to update Identity settings");
    }
  };

  const handleConfirmLogout = () => {
    logout();
    setIsLogoutDialogOpen(false);
  };

  if (loading) {
    return (
      <div className="flex justify-center py-10">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  if (!settings) return null;

  return (
    <div className="space-y-6">
      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Brand Identity</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4">
              <div className="flex items-center justify-between mb-2">
                <Label className="text-base">Identity Settings</Label>
                {!isEditingBranding ? (
                  <Button variant="secondary" size="sm" onClick={() => setIsEditingBranding(true)}>Edit</Button>
                ) : (
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm" onClick={() => {
                      setIsEditingBranding(false);
                      setNameValue(settings.businessName || "My Restaurant");
                      setIconValue(settings.businessIcon || "");
                    }}>Cancel</Button>
                    <Button variant="primary" size="sm" onClick={handleSaveBranding}>Save</Button>
                  </div>
                )}
              </div>

              <div className="flex flex-col gap-6">
                <div className="space-y-2">
                  <Label htmlFor="businessName">Restaurant Name</Label>
                  <Input
                    id="businessName"
                    value={nameValue}
                    onChange={(e) => setNameValue(e.target.value)}
                    disabled={!isEditingBranding}
                    placeholder="e.g. Tasty Delights"
                    className="mt-2"
                  />
                  <p className="text-sm text-muted-foreground">This name appears on the public menu header.</p>
                </div>

                <div className="space-y-2">
                  <Label>Business Icon</Label>
                  <div className="flex items-center gap-4 mt-2 ml-2">
                    <div className="group relative h-16 w-16 rounded-xl bg-gray-100 flex items-center justify-center overflow-hidden border border-gray-200 shrink-0">
                      {iconValue ? (
                        <>
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={iconValue} alt="Icon" className="h-full w-full object-cover" />
                          {isEditingBranding && (
                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                              <Button 
                                size="icon" 
                                variant="danger" 
                                className="h-7 w-7 rounded-full"
                                onClick={() => setIconValue("")}
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </Button>
                            </div>
                          )}
                        </>
                      ) : (
                        <ImageIcon className="h-6 w-6 text-gray-400" />
                      )}
                    </div>
                    {isEditingBranding && (
                      <Button 
                        type="button" 
                        variant="secondary" 
                        size="sm" 
                        onClick={() => setIsImagePickerOpen(true)}
                      >
                        {iconValue ? "Change Icon" : "Select Icon"}
                      </Button>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">Used for the logo and loading screens.</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Business Status</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base">Business Open</Label>
                <div className="text-sm text-muted-foreground">
                  Toggle whether the restaurant is currently open.
                </div>
              </div>
              <Switch
                checked={settings.businessOpen}
                onCheckedChange={(checked) => handleToggle("businessOpen", checked)}
              />
            </div>
            <div className="flex items-center justify-between pt-4 border-t">
              <div className="space-y-0.5">
                <Label className="text-base">Taking Orders</Label>
                <div className="text-sm text-muted-foreground">
                  Toggle whether customers can see order buttons in the cart.
                </div>
              </div>
              <Switch
                checked={settings.acceptingOrders}
                onCheckedChange={(checked) => handleToggle("acceptingOrders", checked)}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Contact Settings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-2">
              <div className="flex items-center justify-between mb-2">
                <Label className="text-base">WhatsApp Number</Label>
                {!isEditingPhone ? (
                   <Button variant="secondary" size="sm" onClick={() => setIsEditingPhone(true)}>Edit</Button>
                ) : (
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm" onClick={() => {
                      setIsEditingPhone(false);
                      setPhoneValue(settings.whatsappNumber);
                    }}>Cancel</Button>
                    <Button variant="primary" size="sm" onClick={handleSavePhone}>Save</Button>
                  </div>
                )}
              </div>
              <Input
                value={phoneValue}
                onChange={(e) => setPhoneValue(e.target.value)}
                disabled={!isEditingPhone}
                placeholder="e.g. +91 9876543210"
              />
              <p className="text-sm text-muted-foreground">
                This number will be used for receiving WhatsApp orders.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-red-100 bg-red-50/30">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-red-600">Danger Zone</CardTitle>
          </CardHeader>
          <CardContent>
            <Button
              variant="danger"
              className="w-full sm:w-auto"
              onClick={() => setIsLogoutDialogOpen(true)}
            >
              <LogOut className="h-4 w-4 mr-2" /> Log Out
            </Button>
            <p className="text-sm text-red-600/70 mt-2">
              Sign out of your admin account. You will need to log in again to access the dashboard.
            </p>
          </CardContent>
        </Card>

        <Dialog open={isLogoutDialogOpen} onOpenChange={setIsLogoutDialogOpen}>
          <DialogContent className="sm:max-w-[400px]">
            <DialogHeader>
              <DialogTitle>Log Out?</DialogTitle>
              <DialogDescription>
                Are you sure you want to log out of the admin dashboard?
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="gap-2 sm:gap-0">
              <Button variant="ghost" onClick={() => setIsLogoutDialogOpen(false)}>
                Cancel
              </Button>
              <Button variant="danger" onClick={handleConfirmLogout}>
                Confirm Log Out
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Image Picker Dialog */}
        <Dialog open={isImagePickerOpen} onOpenChange={setIsImagePickerOpen}>
          <DialogContent className="sm:max-w-[800px] h-[80vh] flex flex-col">
            <DialogHeader>
              <DialogTitle>Select Business Icon</DialogTitle>
              <DialogDescription>
                Choose an image from your library to use as your restaurant icon.
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
                  {galleryImages.map((img) => (
                    <div 
                      key={img.id} 
                      className={cn(
                        "group relative aspect-square rounded-xl overflow-hidden border-2 cursor-pointer transition-all shadow-sm",
                        iconValue === img.url ? "border-primary ring-2 ring-primary/30" : "border-gray-200 hover:border-gray-300 hover:shadow-md"
                      )}
                      onClick={() => setIconValue(img.url)}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={img.url} alt="Gallery item" className="w-full h-full object-cover" />
                      
                      <div className={cn(
                        "absolute inset-0 transition-colors flex items-center justify-center",
                        iconValue === img.url ? "bg-primary/20 backdrop-blur-[1px]" : "bg-black/0 group-hover:bg-black/5"
                      )}>
                        {iconValue === img.url && (
                          <div className="bg-primary text-white rounded-full p-2 shadow-sm animate-in zoom-in-50 duration-200">
                            <Check className="h-6 w-6" />
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
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
    </div>
  );
}
