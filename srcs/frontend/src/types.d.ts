export interface LoginObject {
	username: string;
	password: string;
}

export interface LastMessage {
	body: string;
	chat_id: number;
	sender_username: string;
	friend_username: string;
	sent_at: string;	
}

export interface Chat {
	chat_id: number;
	first_user_id: number;
	first_username: string;
	messages: Array;
	second_user_id: number;
	second_username: string;
	receiver: string;
	socket: WebSocket | null;
}

export interface Message {
	body: string;
	message_id?: number;
	chat_id?: number;
	receiver_id: number;
	receiver_username?: string;
	sender_id: number;
	sender_username?: string;
	sent_at: string;
}

export interface User {
	user_id: number;
	socket: WebSocket | null;
}