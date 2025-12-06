import type { CommonFields } from "./interface";

export const MESSAGE_TEMPLATES = {
	GENERAL: `<p>Chương trình chưa diễn ra.</p>`,
	CHOOSE_DIGIT: `<h1>Please enter your digits</h1>`,
	CHOOSE_AMOUNT: `<h1>Please enter your amount</h1>`,
	BET_INVALID: `<h1>Please enter your digit, amount,... to bet</h1>`,
	BET_CONFITM: `<h1>Are you sure to bet?</h1>`,
	BET_SUCCESS: `<h1>Submit successful!</h1>`,
} as const;

export type MESSAGE_TEMPLATES = (typeof MESSAGE_TEMPLATES)[keyof typeof MESSAGE_TEMPLATES];
export const loadMyMessage = (template: MESSAGE_TEMPLATES, params: CommonFields): string => {
	let message: string = template;
	if (params) {
		Object.entries(params).forEach(([key, value]) => {
			message = message.replace(`{{${key}}}`, value || "");
		});
	}
	return message;
};
