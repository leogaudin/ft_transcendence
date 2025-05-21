import { getClientID } from "../../messages/messages-page.js";
import { GameState } from "../../types.js";

export let socketPong: WebSocket | null;
let current_game: GameState | null = null;

export interface Player {
	keyPress: boolean;
    keyCode: string | null;
    paddle: HTMLElement;
    paddleCenter: number;
    counter: number;
	paddleSpeed: number;
    keysAffected?: boolean;
}

export interface GeneralData {
	time: number;
	speed: number;
	paddleMargin: number;
	controlGame: NodeJS.Timeout | null;
}

export interface PaddleCollision {
	offset: number;
	maxBounceAngle: number;
	newVelX: number;
}

export interface BallData {
	ball: HTMLElement;
	velX: number;
	velY: number;
	angle: number;
	ballCenter: number;
}

export interface AIData {
	timeToRefresh: number;
	targetY: number;
	timeToReach: number;
	errorRate: number;
	activate: boolean;
	controlAI: NodeJS.Timeout | null;
}

export interface OnrizeData {
	ballRelativeLeft: number;
	ballRelativeTop: number;
	player1RelativeTop: number;
	player2RelativeTop: number;
	newSpeed: number;
}

export function init(generalData: GeneralData, ballData: BallData, player1: Player, player2: Player, width: number): void {
	resetBall(generalData, ballData, player1, player2, width);
}

export function play(generalData: GeneralData, ballData: BallData, AIData: AIData, player1: Player, player2: Player, paddleCollisionData: PaddleCollision, width: number, height: number): void {
	movePaddle(player1, player2, generalData, AIData, height);
	checkLost(generalData, ballData, AIData, player1, player2, width);
}

export function stop(generalData: GeneralData, AIData: AIData, ballData: BallData): void {
	if (generalData.controlGame) 
		clearInterval(generalData.controlGame);
	if (AIData.activate && AIData.controlAI) 
		clearInterval(AIData.controlAI);
	ballData.ball.style.display = "none";
}

export function resetBall(generalData: GeneralData, ballData: BallData, player1: Player, player2: Player, width: number): void {
	generalData.speed = 0.01;
	ballData.ball.style.left = "50%";
	ballData.ball.style.top = Math.floor(Math.random() * 100) + "%";
	ballData.angle = (Math.random() * Math.PI / 2) - Math.PI / 4;

	ballData.velX = width * generalData.speed * Math.cos(ballData.angle)
	if ((player1.counter + player2.counter) % 2 === 0)
		ballData.velX *= -1;
	ballData.velY = width * generalData.speed * Math.sin(ballData.angle);
}

export function checkLost(generalData: GeneralData, ballData: BallData, AIData: AIData, player1: Player, player2: Player, width: number): void {
	if (ballData.ball.offsetLeft >= width) {
		updateScore(player1.paddle, player1, player2);
		player1.counter < 10 ? init(generalData, ballData, player1, player2, width) : stop(generalData, AIData, ballData);
	}
	if (ballData.ball.offsetLeft <= 0) {
		updateScore(player2.paddle, player1, player2);
		player2.counter < 10 ? init(generalData, ballData, player1, player2, width) : stop(generalData, AIData, ballData);
	}
}

export function updateScore(paddle: HTMLElement, player1: Player, player2: Player): void {
	if (paddle === player1.paddle && player1.counter < 10) {
		player1.counter++;
		document.getElementById('counter1')!.innerHTML = player1.counter.toString();
	} else if (paddle === player2.paddle && player2.counter < 10){
		player2.counter++;
		document.getElementById('counter2')!.innerHTML = player2.counter.toString();
	}
}

export function moveBall(ballData: BallData, player1: Player, player2: Player, paddleCollisionData: PaddleCollision, generalData: GeneralData, width: number, height: number): void {
	checkState(player1, player2, ballData, paddleCollisionData, generalData, width, height);

	ballData.ball.style.left = `${ballData.ball.offsetLeft + ballData.velX}px`;
	ballData.ball.style.top = `${ballData.ball.offsetTop + ballData.velY}px`;

	if (ballData.ball.offsetTop <= 0) {
		ballData.ball.style.top = `0px`;
		ballData.velY *= -1;
	} else if (ballData.ball.offsetTop + ballData.ball.clientHeight >= height) {
		ballData.ball.style.top = `${height - ballData.ball.clientHeight}px`;
		ballData.velY *= -1;
	}
}

export function checkState(player1: Player, player2: Player, ballData: BallData, paddleCollisionData: PaddleCollision, generalData: GeneralData, width: number, height: number): void {
	if (collidePlayer(player1.paddle, ballData)) 
		handlePaddleCollision(player1, player1, player1.paddle, ballData, paddleCollisionData, generalData, width, height);
	else if (collidePlayer(player2.paddle, ballData))
		handlePaddleCollision(player2, player1, player2.paddle, ballData, paddleCollisionData, generalData, width, height);
}

export function collidePlayer(paddle: HTMLElement, ballData: BallData): boolean {
	if (((ballData.ball.offsetLeft + ballData.ball.clientWidth) >= paddle.offsetLeft) &&
		(ballData.ball.offsetLeft <= (paddle.offsetLeft + paddle.clientWidth)) &&
		((ballData.ball.offsetTop + ballData.ball.clientHeight) >= paddle.offsetTop) &&
		(ballData.ball.offsetTop <= (paddle.offsetTop + paddle.clientHeight)))
		return true;
	return false;
}

export function setPaddleCollision(player: Player, paddle: HTMLElement, ballData: BallData, paddleCollisionData: PaddleCollision, generalData: GeneralData, width: number): void {
	player.paddleCenter = paddle.offsetTop + paddle.clientHeight / 2;
	ballData.ballCenter = ballData.ball.offsetTop + ballData.ball.clientHeight / 2;

	paddleCollisionData.offset = (ballData.ballCenter - player.paddleCenter) / (paddle.clientHeight / 2);
	paddleCollisionData.maxBounceAngle = Math.PI / 4;

	generalData.speed = 0.02;
	ballData.angle = paddleCollisionData.offset * paddleCollisionData.maxBounceAngle;
	paddleCollisionData.newVelX = width * generalData.speed * Math.cos(ballData.angle);
}

export function handlePaddleCollision(player: Player, player1:Player, paddle: HTMLElement, ballData: BallData, paddleCollisionData: PaddleCollision, generalData: GeneralData, width: number, height: number): void {
	setPaddleCollision(player, paddle, ballData, paddleCollisionData, generalData, width);

	if (Math.abs(paddleCollisionData.newVelX) < 2)
		paddleCollisionData.newVelX = paddleCollisionData.newVelX > 0 ? 2 : -2

	ballData.velX = ballData.velX > 0 ? paddleCollisionData.newVelX * -1 : paddleCollisionData.newVelX * 1;
	ballData.velY = height * generalData.speed * Math.sin(ballData.angle);
	ballData.ball.style.left = paddle === player1.paddle ? `${paddle.offsetLeft + paddle.clientWidth}px` : `${paddle.offsetLeft - ballData.ball.clientWidth}px`;
}

export function movePaddle(player1: Player, player2: Player, generalData: GeneralData, AIData: AIData, height: number): void {
	if (player1.keyPress) {
		if (player1.keyCode === "up" && player1.paddle.offsetTop >= generalData.paddleMargin)
			player1.paddle.style.top = `${player1.paddle.offsetTop - height * player1.paddleSpeed}px`;
		if (player1.keyCode === "down" && (player1.paddle.offsetTop + player1.paddle.clientHeight) <= height - generalData.paddleMargin)
			player1.paddle.style.top = `${player1.paddle.offsetTop + height * player1.paddleSpeed}px`;
	}
	if (player2.keyPress) {
		if (AIData.activate) {
			if ((AIData.targetY >= player2.paddle.offsetTop) && (AIData.targetY <= (player2.paddle.offsetTop + player2.paddle.clientHeight)))
				player2.keyPress = false;
		}
		if (player2.keyCode === "up" && player2.paddle.offsetTop >= generalData.paddleMargin)
			player2.paddle.style.top = `${player2.paddle.offsetTop - height * player2.paddleSpeed}px`;
		if (player2.keyCode === "down" && (player2.paddle.offsetTop + player2.paddle.clientHeight) <= height - generalData.paddleMargin)
			player2.paddle.style.top = `${player2.paddle.offsetTop + height * player2.paddleSpeed}px`;
	}
}

export function setAI(AIData: AIData, player2: Player, ballData: BallData, height: number): void {
	AIData.timeToReach = (player2.paddle.offsetLeft - ballData.ball.offsetLeft) / ballData.velX;
	AIData.targetY = ballData.ball.offsetTop + ballData.velY * AIData.timeToReach;
	AIData.errorRate = player2.paddleCenter < AIData.targetY ? Math.random() * height - player2.paddleCenter : Math.random() * player2.paddleCenter - 0;
	player2.paddleCenter = player2.paddle.offsetTop + player2.paddle.clientHeight / 2; 
}

export async function createSocketPongConnection(): Promise<boolean> {
return new Promise((resolve, reject) => {
		if (socketPong && socketPong.readyState !== WebSocket.CLOSED)
			socketPong.close();
		try{
			socketPong = new WebSocket(`wss://${window.location.hostname}:8443/ws/pong`)
			if (!socketPong)
				return false;
			socketPong.onopen = () => {
				let id = getClientID();
				console.log("WebSocketPong connection established, sending id:", id);
				if (id === -1){
					console.error("Invalid ID, cannot connect to back")
					return ;
				}
				else{
					if (!socketPong)
						return ;
					socketPong.send(JSON.stringify({
						userId: id,
						action: "identify"
					}));
					console.log("ID succesfully sent");
				}
			};
			socketPong.onmessage = (event) => {
				try{
					const data = JSON.parse(event.data);
					if (data.type === "connection" && data.status === "success"){
						setupGameHandler();
						resolve(true);
					}
				}
				catch(err){
					reject(err);
				}
			};
			socketPong.onerror = (error) => {
				console.error("WebSocket error:", error);
			};
			socketPong.onclose = () => {
				console.log("WebSocketPong connection closed");
				socketPong = null;
			};
		}
		catch(err){
			console.error("Error creating WebSocketPong:", err);
			reject(err);
		}
	})
}

function setupGameHandler(){
	if (!socketPong)
		return ;
	socketPong.onmessage = (event) =>{
		try{
			const data = JSON.parse(event.data);
			if (data.type === "start_game"){
				current_game = {
					gameId: data.game_id,
					role: data.role,
					opponent_id: data.opponent_id,
					isPlaying: false
				};
				
			}
			else if (data.type === "game_started"){

			}
		}
		catch(err){

		}
	};
}