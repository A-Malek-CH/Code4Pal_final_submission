"use client";

import * as React from "react";
import { Shield } from "lucide-react";
import { TabsContent } from "@/components/ui/tabs";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import type { Settings } from "@/types/d_settings";

export default function settingsPrivacy({
    settings,
    setSettings,
    saving,
    setSaving,
    onSave,
}: {
    settings: Settings;
    setSettings: React.Dispatch<React.SetStateAction<typeof settings>>;
    saving: boolean;
    setSaving: React.Dispatch<React.SetStateAction<boolean>>;
    onSave: () => void;
}) {
    return (
        <TabsContent value="privacy">
            <Card className="full flex">
                <CardHeader className="flex flex-row items-center gap-2">
                    <Shield className="h-4 w-4 text-muted-foreground" />
                    <div>
                        <CardTitle>Privacy</CardTitle>
                        <CardDescription>Control data visibility and retention.</CardDescription>
                    </div>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="grid gap-4 md:grid-cols-2">
                        <div className="flex items-center justify-between rounded-md border p-3">
                            <div>
                                <div className="font-medium">Share location</div>
                                <div className="text-sm text-muted-foreground">Allow sharing current map location with team.</div>
                            </div>
                            <Switch
                                checked={settings.privacy.shareLocation}
                                onCheckedChange={(v) =>
                                    setSettings((s) => ({ ...s, privacy: { ...s.privacy, shareLocation: v } }))
                                }
                            />
                        </div>

                        <div className="flex items-center justify-between rounded-md border p-3">
                            <div>
                                <div className="font-medium">Anonymize markers</div>
                                <div className="text-sm text-muted-foreground">Mask PII on user-related markers.</div>
                            </div>
                            <Switch
                                checked={settings.privacy.anonymizeMarkers}
                                onCheckedChange={(v) =>
                                    setSettings((s) => ({ ...s, privacy: { ...s.privacy, anonymizeMarkers: v } }))
                                }
                            />
                        </div>
                    </div>

                    <div className="grid gap-2 max-w-sm">
                        <Label htmlFor="retention">Data retention (days)</Label>
                        <Input
                            id="retention"
                            type="number"
                            min={1}
                            value={settings.privacy.dataRetentionDays}
                            onChange={(e) =>
                                setSettings((s) => ({
                                    ...s,
                                    privacy: { ...s.privacy, dataRetentionDays: Number(e.target.value || 0) },
                                }))
                            }
                        />
                    </div>
                </CardContent>
                <CardFooter className="justify-end">
                    <Button onClick={onSave} disabled={saving}>
                        {saving ? "Saving..." : "Save"}
                    </Button>
                </CardFooter>
            </Card>
        </TabsContent>
    );
};
