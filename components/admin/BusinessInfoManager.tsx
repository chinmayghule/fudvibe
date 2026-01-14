"use client";

import { useEffect, useState } from "react";
import { getBusinessSettings, updateBusinessSettings, type BusinessSettings } from "@/lib/db";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Loader2, Clock, MapPin, Edit2, X, Save } from "lucide-react";

export function BusinessInfoManager() {
  const [settings, setSettings] = useState<BusinessSettings | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  
  // Local form state
  const [location, setLocation] = useState("");
  const [hours, setHours] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const data = await getBusinessSettings();
        setSettings(data);
        setLocation(data.location || "");
        setHours(data.openingHours || "");
      } catch (err) {
        toast.error("Failed to load business info");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const handleSave = async () => {
    try {
      await updateBusinessSettings({
        location,
        openingHours: hours
      });
      toast.success("Business information updated");
      setIsEditing(false);
    } catch (err) {
      toast.error("Failed to update business information");
    }
  };

  const handleCancel = () => {
    if (settings) {
      setLocation(settings.location || "");
      setHours(settings.openingHours || "");
    }
    setIsEditing(false);
  };

  if (loading) {
    return (
      <div className="flex justify-center py-10">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Business Information</h3>
        {!isEditing ? (
          <Button variant="secondary" onClick={() => setIsEditing(true)}>
            <Edit2 className="h-4 w-4 mr-2" /> Edit Info
          </Button>
        ) : (
          <div className="flex gap-2">
            <Button variant="ghost" onClick={handleCancel}>
              <X className="h-4 w-4 mr-2" /> Cancel
            </Button>
            <Button onClick={handleSave}>
              <Save className="h-4 w-4 mr-2" /> Save Changes
            </Button>
          </div>
        )}
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <MapPin className="h-4 w-4 text-red-500" /> Business Location
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-2">
              <textarea
                disabled={!isEditing}
                className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="Enter business address..."
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Clock className="h-4 w-4 text-blue-500" /> Business Hours
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-2">
              <textarea
                disabled={!isEditing}
                className="flex min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="e.g. Mon - Fri: 9:00 AM - 10:00 PM..."
                value={hours}
                onChange={(e) => setHours(e.target.value)}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
