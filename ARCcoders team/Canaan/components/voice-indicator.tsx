import React from "react";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Check, Gauge, Volume2 } from "lucide-react";
import { voiceOptions } from "@/voice-options";
import { useVoice } from "@/providers/input-provider";
function VoiceIndicator() {
	const { voiceId, setVoiceId, speechRate, setSpeechRate } = useVoice();

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button
					variant="outline"
					size="sm"
					className="gap-2 hover:bg-accent/50"
				>
					<Volume2 className="h-4 w-4" />
					<span className="hidden sm:inline">Voice</span>
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent
				align="end"
				className="w-80 bg-background/95 backdrop-blur-md border-border/50"
			>
				<div className="p-2">
					<h4 className="text-sm font-medium mb-2">Voice Selection</h4>
					{voiceOptions["en"].map((voice) => (
						<DropdownMenuItem
							key={voice.id}
							onClick={() => setVoiceId(voice.id)}
							className="flex items-center justify-between p-2 hover:bg-accent/30"
						>
							<div className="flex flex-col">
								<span className="text-sm">{voice.name}</span>
								<span className="text-xs text-muted-foreground">
									{voice.quality === "premium"
										? "Premium Quality"
										: "Standard Quality"}
								</span>
							</div>
							{voiceId === voice.id && (
								<Check className="h-4 w-4 text-blue-500" />
							)}
						</DropdownMenuItem>
					))}
				</div>

				<DropdownMenuSeparator />

				<div className="p-3">
					<div className="flex items-center gap-2 mb-2">
						<Gauge className="h-4 w-4" />
						<span className="text-sm font-medium">Reading Speed</span>
					</div>
					<div className="space-y-2">
						<input
							type="range"
							min="0.5"
							max="2.0"
							step="0.1"
							value={speechRate}
							onChange={(e) => setSpeechRate(Number.parseFloat(e.target.value))}
							className="w-full accent-blue-500"
						/>
						<div className="flex justify-between text-xs text-muted-foreground">
							<span>Slow</span>
							<span>{speechRate.toFixed(1)}</span>
							<span>Fast</span>
						</div>
					</div>
				</div>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}

export default VoiceIndicator;
