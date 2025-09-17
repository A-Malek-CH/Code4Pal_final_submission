"use client";

import * as React from "react";
import { ChevronsUpDown, X } from "lucide-react";
import {
	Command,
	CommandGroup,
	CommandItem,
	CommandList,
} from "@/components/ui/command";
import { Command as CommandPrimitive } from "cmdk";

import { Avatar, AvatarFallback, AvatarImage } from "./avatar";
import { Button } from "./button";
import { TSelected } from "@/types/selected";

import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import { cn } from "@/lib/utils";
import { ScrollArea } from "./scroll-area";

interface SelectionMultiSelectProps {
	options: TSelected[];
	selected: TSelected | null;
	className?: string;
	onChange: (selected: TSelected | null) => void;
	label: string;
	placeholder?: string;
	disabled?: boolean;
}

export function SelectionSingleSelect({
	options,
	selected,
	onChange,
	className,
	label,
	placeholder,
	disabled = false,
}: SelectionMultiSelectProps) {
	const inputRef = React.useRef<HTMLInputElement>(null);
	const [open, setOpen] = React.useState(false);
	const [inputValue, setInputValue] = React.useState("");
	const handleUnselect = () => {
		onChange(null);
	};
	const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
		const input = inputRef.current;
		if (input) {
			if (e.key === "Delete" || e.key === "Backspace") {
				if (input.value === "") {
					handleUnselect();
				}
			}
			if (e.key === "Escape") {
				input.blur();
			}
		}
	};
	// Filter out already selected Selections
	const selectables = options.filter((option) => selected?.id !== option.id);

	// Filter selectables based on input value
	const filteredSelectables = selectables.filter((option) => {
		const fullName = `${option.label}`.toLowerCase();
		return fullName.includes(inputValue.toLowerCase());
	});
	return (
		<section className="flex flex-col space-y-2">
			{/* --- THIS ENTIRE BLOCK NEEDS TO BE FIXED --- */}
			{selected ? (
				// What to show when an item IS selected
				<div className="flex items-center space-x-3">
					<Avatar className="h-8 w-8">
						<AvatarImage
							className="object-cover"
							src={selected.photoURL || ""}
						/>
						<AvatarFallback className="text-xs">
							{selected.label?.charAt(0) || "E"}
						</AvatarFallback>
					</Avatar>
					<div>
						<p className="text-foreground text-sm font-medium">
							{selected.label.slice(0, 100)}
						</p>
					</div>
					<Button
						variant="ghost"
						type="button"
						size="icon"
						onClick={() => handleUnselect()}
						className="hover:text-red-500 hover:bg-red-500/20 rounded-full"
					>
						<X className="h-4 w-4 " />
					</Button>
				</div>
			) : (
				// What to show when NOTHING is selected
				<span className="text-muted-foreground">
					{placeholder || `Select ${label}...`}
				</span>
			)}

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
													onChange(option);
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
