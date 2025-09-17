import * as React from "react";
import { Globe } from "lucide-react";
import { TabsContent } from "@/components/ui/tabs";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";

import { Button } from "@/components/ui/button";
import type { Settings } from "@/types/d_settings";

export default function settingsAdvanced({
    settings,
    saving,
    onReset,
    onSave,
}: {
    settings: Settings;

    setSettings: React.Dispatch<React.SetStateAction<typeof settings>>;
    saving: boolean;
    onReset: () => void;
    onSave: () => void;
}) {
    return (
        <TabsContent value="advanced">
            <Card className="full flex">
                <CardHeader className="flex flex-row items-center gap-2">
                    <Globe className="h-4 w-4 text-muted-foreground" />
                    <div>
                        <CardTitle>Advanced</CardTitle>
                        <CardDescription>System-level actions and defaults.</CardDescription>
                    </div>
                </CardHeader>
                <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                        These actions affect how the dashboard behaves across modules like Requests, Users, and
                        Locations. Proceed with caution.
                    </p>
                    <div className="flex flex-wrap gap-2">
                        <Button variant="outline" onClick={onReset}>
                            Restore defaults
                        </Button>
                        <Button variant="destructive" onClick={() => alert("Danger action triggered")}>
                            Clear cached layers
                        </Button>
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
