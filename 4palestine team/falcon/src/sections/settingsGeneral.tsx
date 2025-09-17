"use client";

import * as React from "react";
import { SlidersHorizontal } from "lucide-react";
import { TabsContent } from "@/components/ui/tabs";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import type { Settings } from "@/types/d_settings";

export default function settingsGeneral({
    settings,
    setSettings,
    saving,
    onSave,
}: {
    settings: Settings;
    setSettings: React.Dispatch<React.SetStateAction<typeof settings>>;
    saving: boolean;
    onSave: () => void;
}) {
    return (
        <TabsContent value="general">
            <Card className="full flex">
                <CardHeader className="flex flex-row items-center gap-2">
                    <SlidersHorizontal className="h-4 w-4 text-muted-foreground" />
                    <div>
                        <CardTitle>General</CardTitle>
                        <CardDescription>Basic preferences for your workspace.</CardDescription>
                    </div>
                </CardHeader>
                <CardContent className="grid gap-6 md:grid-cols-2">
                    <div className="grid gap-2">
                        <Label htmlFor="orgName">Organization name</Label>
                        <Input
                            id="orgName"
                            value={settings.general.orgName}
                            onChange={(e) =>
                                setSettings((s) => ({ ...s, general: { ...s.general, orgName: e.target.value } }))
                            }
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="supportEmail">Support email</Label>
                        <Input
                            id="supportEmail"
                            type="email"
                            value={settings.general.supportEmail}
                            onChange={(e) =>
                                setSettings((s) => ({ ...s, general: { ...s.general, supportEmail: e.target.value } }))
                            }
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label>Timezone</Label>
                        <Select
                            value={settings.general.timezone}
                            onValueChange={(v) => setSettings((s) => ({ ...s, general: { ...s.general, timezone: v } }))}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select timezone" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="UTC">UTC</SelectItem>
                                <SelectItem value="Europe/Berlin">Europe/Berlin</SelectItem>
                                <SelectItem value="America/New_York">America/New_York</SelectItem>
                                <SelectItem value="Asia/Dubai">Asia/Dubai</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="grid gap-2">
                        <Label>Language</Label>
                        <Select
                            value={settings.general.language}
                            onValueChange={(v) => setSettings((s) => ({ ...s, general: { ...s.general, language: v } }))}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select language" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="en">English</SelectItem>
                                <SelectItem value="de">Deutsch</SelectItem>
                                <SelectItem value="fr">Français</SelectItem>
                                <SelectItem value="es">Español</SelectItem>
                            </SelectContent>
                        </Select>
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
