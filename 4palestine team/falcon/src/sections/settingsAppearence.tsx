import * as React from "react";
import { Palette } from "lucide-react";
import { TabsContent } from "@/components/ui/tabs";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";

import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import type { Settings } from "@/types/d_settings";

export default function settingsAppearence({
    settings,
    setSettings,
    saving,
    onSave,
}: {
    settings: Settings;
    setSettings: React.Dispatch<React.SetStateAction<typeof settings>>;
    saving: boolean;
    setSaving: React.Dispatch<React.SetStateAction<boolean>>;
    onSave: () => void;
}) {
    return (
        <TabsContent value="appearance">
            <Card className="full flex">
                <CardHeader className="flex flex-row items-center gap-2">
                    <Palette className="h-4 w-4 text-muted-foreground" />
                    <div>
                        <CardTitle>Appearance</CardTitle>
                        <CardDescription>Theme and layout density.</CardDescription>
                    </div>
                </CardHeader>
                <CardContent className="grid gap-6 md:grid-cols-2">
                    <div className="grid gap-2">
                        <Label>Theme</Label>
                        <Select
                            value={settings.appearance.theme}
                            onValueChange={(v: Settings["appearance"]["theme"]) =>
                                setSettings((s) => ({ ...s, appearance: { ...s.appearance, theme: v } }))
                            }
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select theme" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="system">System</SelectItem>
                                <SelectItem value="light">Light</SelectItem>
                                <SelectItem value="dark">Dark</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="grid gap-2">
                        <Label>Density</Label>
                        <Select
                            value={settings.appearance.density}
                            onValueChange={(v: Settings["appearance"]["density"]) =>
                                setSettings((s) => ({ ...s, appearance: { ...s.appearance, density: v } }))
                            }
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select density" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="comfortable">Comfortable</SelectItem>
                                <SelectItem value="compact">Compact</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="flex items-center justify-between rounded-md border p-3 md:col-span-2">
                        <div>
                            <div className="font-medium">Collapse sidebar on mobile</div>
                            <div className="text-sm text-muted-foreground">
                                Optimize the Sidebar for smaller screens.
                            </div>
                        </div>
                        <Switch
                            checked={settings.appearance.collapseSidebarOnMobile}
                            onCheckedChange={(v) =>
                                setSettings((s) => ({ ...s, appearance: { ...s.appearance, collapseSidebarOnMobile: v } }))
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
