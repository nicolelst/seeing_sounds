import { ReactNode, ReactElement } from "react";
import {
	AccordionItem,
	AccordionTrigger,
	AccordionContent,
} from "@/shadcn/components/ui/accordion";
import { ScrollArea } from "@/shadcn/components/ui/scroll-area";

interface SettingsAccordionItemProps {
	value: string;
	header: string;
	children: ReactNode;
	scrollable?: boolean;
}

export default function SettingsAccordionItem({
	value,
	header,
	children,
	scrollable,
}: SettingsAccordionItemProps): ReactElement {
	return (
		<AccordionItem value={value}>
			<AccordionTrigger type="button" className="text-lg font-semibold hover:no-underline py-3">
				{header}
			</AccordionTrigger>
			<AccordionContent className="px-1 pt-1 pb-4">
				{scrollable ?? false ? (
					<ScrollArea className="h-52 pr-4">
						{/* TODO dynamically determine size based on screen */}
						{children}
					</ScrollArea>
				) : (
					children
				)}
			</AccordionContent>
		</AccordionItem>
	);
}
