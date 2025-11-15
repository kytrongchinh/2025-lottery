import type { CommonFields } from "./interface";

export const MESSAGE_TEMPLATES = {
	GENERAL: `<p>Chương trình chưa diễn ra.</p>`,
} as const;

export type MESSAGE_TEMPLATES =
	(typeof MESSAGE_TEMPLATES)[keyof typeof MESSAGE_TEMPLATES];
export const loadMyMessage = (
	template: MESSAGE_TEMPLATES,
	params: CommonFields
): string => {
	let message: string = template;
	if (params) {
		Object.entries(params).forEach(([key, value]) => {
			message = message.replace(`{{${key}}}`, value || "");
		});
	}
	return message;
};
