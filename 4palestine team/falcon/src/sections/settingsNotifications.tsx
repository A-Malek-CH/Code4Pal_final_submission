"use client";

import * as React from "react";
import { Bell } from "lucide-react";
import { TabsContent } from "@/components/ui/tabs";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";

import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import type { Settings } from "@/types/d_settings";

export default function settingsNotifications({
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
        <TabsContent value="notifications">
            <Card className="full flex">
                <CardHeader className="flex flex-row items-center gap-2">
                    <Bell className="h-4 w-4 text-muted-foreground" />
                    <div>
                        <CardTitle>Notifications</CardTitle>
                        <CardDescription>Email and push preferences.</CardDescription>
                    </div>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                        <div className="flex items-center justify-between rounded-md border p-3">
                            <div>
                                <div className="font-medium">Requests</div>
                                <div className="text-sm text-muted-foreground">
                                    Updates about Verifications (/dashboard/verifications).
                                </div>
                            </div>
                            <Switch
                                checked={settings.notifications.emailRequests}
                                onCheckedChange={(v) =>
                                    setSettings((s) => ({ ...s, notifications: { ...s.notifications, emailRequests: v } }))
                                }
                            />
                        </div>

                        <div className="flex items-center justify-between rounded-md border p-3">
                            <div>
                                <div className="font-medium">Users</div>
                                <div className="text-sm text-muted-foreground">
                                    Registered and Verified users updates.
                                </div>
                            </div>
                            <Switch
                                checked={settings.notifications.emailUsers}
                                onCheckedChange={(v) =>
                                    setSettings((s) => ({ ...s, notifications: { ...s.notifications, emailUsers: v } }))
                                }
                            />
                        </div>

                        <div className="flex items-center justify-between rounded-md border p-3">
                            <div>
                                <div className="font-medium">Locations</div>
                                <div className="text-sm text-muted-foreground">
                                    Markers and SOS activity.
                                </div>
                            </div>
                            <Switch
                                checked={settings.notifications.emailLocations}
                                onCheckedChange={(v) =>
                                    setSettings((s) => ({ ...s, notifications: { ...s.notifications, emailLocations: v } }))
                                }
                            />
                        </div>

                        <div className="flex items-center justify-between rounded-md border p-3">
                            <div>
                                <div className="font-medium">Push notifications</div>
                                <div className="text-sm text-muted-foreground">Enable real-time push alerts.</div>
                            </div>
                            <Switch
                                checked={settings.notifications.pushEnabled}
                                onCheckedChange={(v) =>
                                    setSettings((s) => ({ ...s, notifications: { ...s.notifications, pushEnabled: v } }))
                                }
                            />
                        </div>
                    </div>

                    <div className="grid gap-2 max-w-sm">
                        <Label>Digest frequency</Label>
                        <Select
                            value={settings.notifications.digest}
                            onValueChange={(v: Settings["notifications"]["digest"]) =>
                                setSettings((s) => ({ ...s, notifications: { ...s.notifications, digest: v } }))
                            }
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select frequency" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="off">Off</SelectItem>
                                <SelectItem value="daily">Daily</SelectItem>
                                <SelectItem value="weekly">Weekly</SelectItem>
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
