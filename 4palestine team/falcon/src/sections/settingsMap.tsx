"use client";

import * as React from "react";
import { Map } from "lucide-react";
import { TabsContent } from "@/components/ui/tabs";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import type { Settings } from "@/types/d_settings";

export default function settingsMap({
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
        <TabsContent value="map">
            <Card className="full flex">
                <CardHeader className="flex flex-row items-center gap-2">
                    <Map className="h-4 w-4 text-muted-foreground" />
                    <div>
                        <CardTitle>Map</CardTitle>
                        <CardDescription>Configure map defaults and layers.</CardDescription>
                    </div>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="grid gap-6 md:grid-cols-2">
                        <div className="grid gap-2">
                            <Label>Map style</Label>
                            <Select
                                value={settings.map.style}
                                onValueChange={(v: Settings["map"]["style"]) =>
                                    setSettings((s) => ({ ...s, map: { ...s.map, style: v } }))
                                }
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select style" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="streets">Streets</SelectItem>
                                    <SelectItem value="satellite">Satellite</SelectItem>
                                    <SelectItem value="dark">Dark</SelectItem>
                                    <SelectItem value="light">Light</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid gap-2">
                            <Label>Default zoom ({settings.map.defaultZoom})</Label>
                            <Slider
                                value={[settings.map.defaultZoom]}
                                min={1}
                                max={20}
                                step={1}
                                onValueChange={(vals) =>
                                    setSettings((s) => ({ ...s, map: { ...s.map, defaultZoom: vals[0] ?? s.map.defaultZoom } }))
                                }
                            />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="centerLat">Default center latitude</Label>
                            <Input
                                id="centerLat"
                                inputMode="decimal"
                                value={settings.map.centerLat}
                                onChange={(e) =>
                                    setSettings((s) => ({ ...s, map: { ...s.map, centerLat: e.target.value } }))
                                }
                                placeholder="e.g. 25.276987"
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="centerLng">Default center longitude</Label>
                            <Input
                                id="centerLng"
                                inputMode="decimal"
                                value={settings.map.centerLng}
                                onChange={(e) =>
                                    setSettings((s) => ({ ...s, map: { ...s.map, centerLng: e.target.value } }))
                                }
                                placeholder="e.g. 55.296249"
                            />
                        </div>
                    </div>

                    <Separator />

                    <div className="grid gap-4 md:grid-cols-2">
                        <div className="flex items-center justify-between rounded-md border p-3">
                            <div>
                                <div className="font-medium">Markers layer</div>
                                <div className="text-sm text-muted-foreground">
                                    Toggle visibility for Locations › Markers (/dashboard/markers).
                                </div>
                            </div>
                            <Switch
                                checked={settings.map.showMarkers}
                                onCheckedChange={(v) => setSettings((s) => ({ ...s, map: { ...s.map, showMarkers: v } }))
                                }
                            />
                        </div>

                        <div className="flex items-center justify-between rounded-md border p-3">
                            <div>
                                <div className="font-medium">SOS layer</div>
                                <div className="text-sm text-muted-foreground">
                                    Toggle visibility for Locations › SOS (/dashboard/sos).
                                </div>
                            </div>
                            <Switch
                                checked={settings.map.showSOS}
                                onCheckedChange={(v) => setSettings((s) => ({ ...s, map: { ...s.map, showSOS: v } }))
                                }
                            />
                        </div>
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
