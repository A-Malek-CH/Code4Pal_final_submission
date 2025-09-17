"use client";

import * as React from "react";
import { X } from "lucide-react";
import {
	Command,
	CommandGroup,
	CommandItem,
	CommandList,
} from "@/components/ui/command";
import { Command as CommandPrimitive } from "cmdk";
import { ScrollArea } from "./scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "./avatar";
import { Button } from "./button";
import { TSelected } from "@/types/selected";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "./select";
import { Label } from "recharts";

interface SelectionMultiSelectProps {
	options: TSelected[];
	selected: TSelected[];
	onChange: (selected: TSelected[]) => void;
	className?: string;
	badgeClassName?: string;
	label: string;
	role?: boolean;
	placeholder?: string;
	disabled?: boolean;
}

export function SelectionMultiSelect({
	options,
	selected,
	onChange,
	className,
	role,
	badgeClassName,
	label,
	placeholder,
	disabled = false,
}: SelectionMultiSelectProps) {
	const inputRef = React.useRef<HTMLInputElement>(null);
	const [open, setOpen] = React.useState(false);
	const [inputValue, setInputValue] = React.useState("");

	const handleUnselect = (SelectionToRemove: TSelected) => {
		onChange(
			selected.filter((Selection) => Selection.id !== SelectionToRemove.id)
		);
	};

	const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
		const input = inputRef.current;
		if (input) {
			if (e.key === "Delete" || e.key === "Backspace") {
				if (input.value === "" && selected.length > 0) {
					handleUnselect(selected[selected.length - 1]);
				}
			}
			if (e.key === "Escape") {
				input.blur();
			}
		}
	};

	// Filter out already selected Selections
	const selectables = options.filter(
		(option) => !selected.some((selected) => selected.id === option.id)
	);

	// Filter selectables based on input value
	const filteredSelectables = selectables.filter((option) => {
		const fullName = `${option.label}`.toLowerCase();
		return fullName.includes(inputValue.toLowerCase());
	});

	return (
		<section className="flex flex-col space-y-2">
			<ScrollArea className="h-48 w-full px-4">
				<div className="space-y-2">
					{selected.map((Selection) => (
						<div
							key={Selection.id}
							className="flex flex-col items-center justify-center rounded-lg border transition-all duration-300"
						>
							<div className="w-full flex items-center justify-between p-2 rounded-lg border transition-all duration-300 ">
								<div className="flex items-center space-x-3">
									<Avatar className="h-8 w-8">
										<AvatarImage
											className="object-cover"
											src={Selection.photoURL || ""}
										/>
										<AvatarFallback className="text-xs">
											{Selection.label?.charAt(0) || "U"}
										</AvatarFallback>
									</Avatar>
									<div>
										<p className="text-foreground text-sm font-medium">
											{Selection.label.slice(0, 100)}
										</p>
									</div>
								</div>
								{Selection.role && (
									<div className="ml-6 mr-auto">
										<Label className="text-xs">Role:</Label>
										<Select
											value={Selection.role}
											onValueChange={(role) =>
												onChange(
													selected.map((selection) =>
														role ? { ...selection, role } : selection
													)
												)
											}
										>
											<SelectTrigger className="h-8 text-xs">
												<SelectValue />
											</SelectTrigger>
											<SelectContent>
												<SelectItem value="participant">Participant</SelectItem>
												<SelectItem value="leader">Leader</SelectItem>
												<SelectItem value="organizer">Organizer</SelectItem>
												<SelectItem value="victim">Victim</SelectItem>
												<SelectItem value="opponent">Opponent</SelectItem>
												<SelectItem value="supporter">Supporter</SelectItem>
												<SelectItem value="witness">Witness</SelectItem>
												<SelectItem value="commander">Commander</SelectItem>
												<SelectItem value="diplomat">Diplomat</SelectItem>
											</SelectContent>
										</Select>
									</div>
								)}
								<Button
									variant="ghost"
									type="button"
									size="icon"
									onClick={() => handleUnselect(Selection)}
									className="hover:text-red-500 hover:bg-red-500/20 rounded-full"
								>
									<X className="h-4 w-4 " />
								</Button>
							</div>
						</div>
					))}
				</div>
			</ScrollArea>

			<Command
				onKeyDown={handleKeyDown}
				className={`overflow-visible bg-transparent ${className}`}
			>
				<div className="group border border-border/70 px-3 py-2 text-sm ring-offset-background rounded-md focus-within:ring-2 focus-within:ring-foreground focus-within:ring-offset-2 bg-background/80">
					<div className="flex gap-1 flex-wrap">
						<CommandPrimitive.Input
							ref={inputRef}
							value={inputValue}
							onValueChange={setInputValue}
							onBlur={() => setOpen(false)}
							onFocus={() => setOpen(true)}
							placeholder={placeholder || `Select ${label}...`}
							className="ml-2 bg-transparent outline-none flex-1 "
							disabled={disabled}
						/>
					</div>
				</div>
				<div className="relative mt-2 z-[999]">
					{open && filteredSelectables.length > 0 && !disabled ? (
						<div className="absolute w-full  top-0 rounded-md bordershadow-md outline-none animate-in">
							<CommandGroup>
								<CommandList>
									<ScrollArea className="h-48 px-4">
										{filteredSelectables.map((option) => (
											<CommandItem
												key={option.id}
												onMouseDown={(e) => {
													e.preventDefault();
													e.stopPropagation();
												}}
												onSelect={() => {
													setInputValue("");
													onChange([...selected, option]);
												}}
												className=" px-3 py-2 rounded-sm cursor-pointer"
											>
												{option.label}
											</CommandItem>
										))}
									</ScrollArea>
								</CommandList>
							</CommandGroup>
						</div>
					) : null}
				</div>
			</Command>
		</section>
	);
}
