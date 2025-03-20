export interface LoginObject {
	username: string;
	password: string;
}

export interface Chat {
	chat_id: number;
	first_user_id: number;
	first_username: string;
	messages: Array;
	second_user_id: number;
	second_username: string;
	receiver: string;
}
