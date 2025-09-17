"use client";

import * as React from "react";
import Cookies from "js-cookie";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import type { Settings } from "@/types/d_settings";

import SettingsGeneral from "@/sections/settingsGeneral";
import SettingsAppearence from "@/sections/settingsAppearence";
import SettingsMap from "@/sections/settingsMap";
import SettingsNotifications from "@/sections/settingsNotifications";
import SettingsPrivacy from "@/sections/settingsPrivacy";
import SettingsAdvanced from "@/sections/settingsAdvanced";

const COOKIE_KEY = "falcon_settings";

const initialSettings: Settings = {
  general: {
    orgName: "Falcon Dashboard",
    supportEmail: "support@falcon.app",
    timezone: "UTC",
    language: "en",
  },
  map: {
    style: "streets",
    defaultZoom: 8,
    showMarkers: true,
    showSOS: true,
    centerLat: "0.0000",
    centerLng: "0.0000",
  },
  notifications: {
    emailRequests: true,
    emailUsers: false,
    emailLocations: true,
    pushEnabled: false,
    digest: "daily",
  },
  appearance: {
    theme: "system",
    density: "comfortable",
    collapseSidebarOnMobile: true,
  },
  privacy: {
    shareLocation: false,
    anonymizeMarkers: true,
    dataRetentionDays: 90,
  },
};

export default function Page() {
  const [settings, setSettings] = React.useState<Settings>(() => {
    if (typeof window !== "undefined") {
      const saved = Cookies.get(COOKIE_KEY);
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch {
          return initialSettings;
        }
      }
    }
    return initialSettings;
  });

  const [saving, setSaving] = React.useState(false);

  const onSave = async () => {
    setSaving(true);
    try {
      console.log("Saving settings:", settings);

      // Save to cookies
      Cookies.set(COOKIE_KEY, JSON.stringify(settings), {
        expires: 30, // days
        sameSite: "strict",
      });

      await new Promise((r) => setTimeout(r, 600));
    } finally {
      setSaving(false);
    }
  };

  const onReset = () => {
    setSettings(initialSettings);
    Cookies.remove(COOKIE_KEY);
  };

  return (
    <main className="full flex flex-col space-y-6 p-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Settings</h1>
          <p className="text-sm text-muted-foreground">
            Configure your map dashboard, modules, and preferences.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={onReset}>
            Reset
          </Button>
          <Button onClick={onSave} disabled={saving}>
            {saving ? "Saving..." : "Save changes"}
          </Button>
        </div>
      </div>

      <Tabs defaultValue="general" className="full">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="map">Map</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="appearance">Appearance</TabsTrigger>
          <TabsTrigger value="privacy">Privacy</TabsTrigger>
          <TabsTrigger value="advanced">Advanced</TabsTrigger>
        </TabsList>

        <SettingsGeneral settings={settings} setSettings={setSettings} saving={saving} onSave={onSave} />
        <SettingsAppearence settings={settings} setSettings={setSettings} saving={saving} setSaving={setSaving} onSave={onSave} />
        <SettingsMap settings={settings} setSettings={setSettings} saving={saving} onSave={onSave} />
        <SettingsNotifications settings={settings} setSettings={setSettings} saving={saving} onSave={onSave} />
        <SettingsPrivacy settings={settings} setSettings={setSettings} saving={saving} setSaving={setSaving} onSave={onSave} />
        <SettingsAdvanced onReset={onReset} settings={settings} setSettings={setSettings} saving={saving} onSave={onSave} />
      </Tabs>
    </main>
  );
}
