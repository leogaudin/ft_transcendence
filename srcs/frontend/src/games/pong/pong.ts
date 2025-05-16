<<<<<<< HEAD:srcs/frontend/src/games/game.ts
import { Games } from "../types.js";
import { getClientID } from "../messages/messages-page.js";

export let socket_game:  WebSocket | null;

export function createPongSocketConnection(){
 if (socket_game && socket_game.readyState !== WebSocket.CLOSED)
		socket_game.close();
	try{
		socket_game = new WebSocket(`wss://${window.location.hostname}:8443/ws/pong`)
		if (!socket_game)
			return ;
		socket_game.onopen = () => {
			let id = getClientID();
			console.log("WebSocketPong connection established, sending id:", id);
			if (id === -1){
				console.error("Invalid ID, cannot connect to back")
			}
			else{
				if (!socket_game)
					return ;
				socket_game.send(JSON.stringify({
					userId: id,
					action: "identify"
				}));
				console.log("ID succesfully sent");
			}
		};
		socket_game.onmessage = (event) => {
			try{
				const data = JSON.parse(event.data);
			}
			catch(err) {
				console.error("Error on message", err);
			}
		};
		socket_game.onerror = (error) => {
			console.error("WebSocket error:", error);
		};
		socket_game.onclose = () => {
			console.log("WebSocketPong connection closed");
			socket_game = null;
		};
	}
	catch(err){
		console.error("Error creating WebSocketPong:", err);
	}
}
=======
import { Games } from "../../types.js";
>>>>>>> 14f302966d9945cda8a05f383e56155eee1e3570:srcs/frontend/src/games/pong/pong.ts

export function pong(data: Games): void{
	if (data.gameMode === "remote")
		createPongSocketConnection();
	const gameElement = document.getElementById('game');
	if (!gameElement){
		throw new Error("HTML 'game' element not found.");
	}
	let width = gameElement.clientWidth;
	let height = gameElement.clientHeight;

	class Player {
		keyPress: boolean;
		keyCode: string | null;
		paddle: HTMLElement;
		paddleCenter: number;
		counter: number;

		constructor(paddle: HTMLElement) {
			this.keyPress = false;
			this.keyCode = null;
			this.paddle = paddle;
			this.paddleCenter = 0;
			this.counter = 0;
		}
	}

	const player1 = new Player(document.getElementById('paddleLeft') as HTMLElement);
	const player2 = new Player(document.getElementById('paddleRight') as HTMLElement);

	type GeneralDataType = {
		time: number;
		speed: number;
		paddleSpeed: number;
		paddleMargin: number;
		controlGame: NodeJS.Timeout | null;
	}

	type PaddleCollisionDataType = {
		offset: number;
		maxBounceAngle: number;
		newVelX: number;
	}

	type BallDataType = {
		ball: HTMLElement;
		velX: number;
		velY: number;
		angle: number;
		ballCenter: number;
	}

	type AIDataType = {
		timeToRefresh: number;
		targetY: number;
		timeToReach: number;
		errorRate: number;
		activate: boolean;
		controlAI: NodeJS.Timeout | null;
	}

	type OnrizeDataType = {
		ballRelativeLeft: number;
		ballRelativeTop: number;
		player1RelativeTop: number;
		player2RelativeTop: number;
		newSpeed: number;
	}

	const generalData: GeneralDataType = {
		time: 30,
		speed: 0.02,
		paddleSpeed: 0.04,
		paddleMargin: height * 0.03,
		controlGame: null
	}

	const paddleCollisionData: PaddleCollisionDataType = {
		offset: 0,
		maxBounceAngle: 0,
		newVelX: 0
	}

	const ballData: BallDataType = {
		ball: document.getElementById('ball') as HTMLElement,
		velX: 0,
		velY: 0,
		angle: 0,
		ballCenter: 0
	}

	const AIData: AIDataType = {
		timeToRefresh: 1000,
		targetY: 0,
		timeToReach: 0,
		errorRate: 0,
		activate: data.gameMode === "ai" ? true : false,
		controlAI: null
	}

	const onresizeData: OnrizeDataType = {
		ballRelativeLeft: 0,
		ballRelativeTop: 0,
		player1RelativeTop: 0,
		player2RelativeTop: 0,
		newSpeed: 0
	}

	function start(): void {
		const savedState = localStorage.getItem("gameState");
		if (savedState)
			loadGameState();
		else
			init();
		generalData.controlGame = setInterval(play, generalData.time);
		if (AIData.activate) 
			AIData.controlAI = setInterval(moveAI, AIData.timeToRefresh);
	}

	function init(): void {
		resetBall();
	}

	function play(): void {
		moveBall();
		movePaddle();
		checkLost();
		saveGameState();
	}

	function stop(): void {
		saveGameState();
		if (generalData.controlGame) 
			clearInterval(generalData.controlGame);
		if (AIData.activate && AIData.controlAI) 
			clearInterval(AIData.controlAI);
		ballData.ball.style.display = "none";
	}

	function resetBall(): void {
		generalData.speed = 0.01;
		ballData.ball.style.left = "50%";
		ballData.ball.style.top = Math.floor(Math.random() * 100) + "%";
		ballData.angle = (Math.random() * Math.PI / 2) - Math.PI / 4;

		ballData.velX = width * generalData.speed * Math.cos(ballData.angle)
		if ((player1.counter + player2.counter) % 2 === 0)
			ballData.velX *= -1;
		ballData.velY = width * generalData.speed * Math.sin(ballData.angle);
	}

	function checkLost(): void {
		if (ballData.ball.offsetLeft >= width) {
			updateScore(player1.paddle);
			player1.counter < 10 ? init() : stop();
		}
		if (ballData.ball.offsetLeft <= 0) {
			updateScore(player2.paddle);
			player2.counter < 10 ? init() : stop();
		}
	}

	function updateScore(paddle: HTMLElement): void {
		if (paddle === player1.paddle) {
			player1.counter++;
			document.getElementById('counter1')!.innerHTML = player1.counter.toString();
		} else {
			player2.counter++;
			document.getElementById('counter2')!.innerHTML = player2.counter.toString();
		}
	}

	function moveBall(): void {
		checkState();

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

	function checkState(): void {
		if (collidePlayer(player1.paddle)) 
			handlePaddleCollision(player1, player1.paddle);
		else if (collidePlayer(player2.paddle))
			handlePaddleCollision(player2, player2.paddle);
	}

	function collidePlayer(paddle: HTMLElement): boolean {
		if (((ballData.ball.offsetLeft + ballData.ball.clientWidth) >= paddle.offsetLeft) &&
			(ballData.ball.offsetLeft <= (paddle.offsetLeft + paddle.clientWidth)) &&
			((ballData.ball.offsetTop + ballData.ball.clientHeight) >= paddle.offsetTop) &&
			(ballData.ball.offsetTop <= (paddle.offsetTop + paddle.clientHeight)))
			return true;
		return false;
	}

	function setPaddleCollision(player: Player, paddle: HTMLElement): void {
        player.paddleCenter = paddle.offsetTop + paddle.clientHeight / 2;
        ballData.ballCenter = ballData.ball.offsetTop + ballData.ball.clientHeight / 2;

        paddleCollisionData.offset = (ballData.ballCenter - player.paddleCenter) / (paddle.clientHeight / 2);
        paddleCollisionData.maxBounceAngle = Math.PI / 4;

		generalData.speed = 0.02;
        ballData.angle = paddleCollisionData.offset * paddleCollisionData.maxBounceAngle;
        paddleCollisionData.newVelX = width * generalData.speed * Math.cos(ballData.angle);
    }

	function handlePaddleCollision(player: Player, paddle: HTMLElement): void {
		setPaddleCollision(player, paddle);

        if (Math.abs(paddleCollisionData.newVelX) < 2)
			paddleCollisionData.newVelX = paddleCollisionData.newVelX > 0 ? 2 : -2

		ballData.velX = ballData.velX > 0 ? paddleCollisionData.newVelX * -1 : paddleCollisionData.newVelX * 1;
        ballData.velY = height * generalData.speed * Math.sin(ballData.angle);
		ballData.ball.style.left = paddle === player1.paddle ? `${paddle.offsetLeft + paddle.clientWidth}px` : `${paddle.offsetLeft - ballData.ball.clientWidth}px`;
    }

	function movePaddle(): void {
		if (player1.keyPress) {
			if (player1.keyCode === "up" && player1.paddle.offsetTop >= generalData.paddleMargin)
				player1.paddle.style.top = `${player1.paddle.offsetTop - height * generalData.paddleSpeed}px`;
			if (player1.keyCode === "down" && (player1.paddle.offsetTop + player1.paddle.clientHeight) <= height - generalData.paddleMargin)
				player1.paddle.style.top = `${player1.paddle.offsetTop + height * generalData.paddleSpeed}px`;
		}
		if (player2.keyPress) {
			if (AIData.activate) {
				if ((AIData.targetY >= player2.paddle.offsetTop) && (AIData.targetY <= (player2.paddle.offsetTop + player2.paddle.clientHeight)))
					player2.keyPress = false;
			}
			if (player2.keyCode === "up" && player2.paddle.offsetTop >= generalData.paddleMargin)
				player2.paddle.style.top = `${player2.paddle.offsetTop - height * generalData.paddleSpeed}px`;
			if (player2.keyCode === "down" && (player2.paddle.offsetTop + player2.paddle.clientHeight) <= height - generalData.paddleMargin)
				player2.paddle.style.top = `${player2.paddle.offsetTop + height * generalData.paddleSpeed}px`;
		}
	}

	function setAI(): void {
        AIData.timeToReach = (player2.paddle.offsetLeft - ballData.ball.offsetLeft) / ballData.velX;
        AIData.targetY = ballData.ball.offsetTop + ballData.velY * AIData.timeToReach;
		AIData.errorRate = player2.paddleCenter < AIData.targetY ? Math.random() * height - player2.paddleCenter : Math.random() * player2.paddleCenter - 0;
        player2.paddleCenter = player2.paddle.offsetTop + player2.paddle.clientHeight / 2; 
    }

	function moveAI(): void {
		let random = Math.random();
		setAI();

		AIData.targetY = random < 0.03 ? AIData.errorRate : AIData.targetY; // Tasa de error

		while (AIData.targetY < 0 || AIData.targetY > height)
			AIData.targetY = AIData.targetY < 0 ? AIData.targetY * -1 : 2 * height - AIData.targetY;

		if (player2.paddleCenter < AIData.targetY) {
			player2.keyCode = "down";
			player2.keyPress = true;
		} else if (player2.paddleCenter > AIData.targetY) {
			player2.keyCode = "up";
			player2.keyPress = true;
		}
	}

	document.onkeydown = function(e: KeyboardEvent): void {
		const key = e.key.toLowerCase();
		if (key === "w") {
			player1.keyPress = true; 
			player1.keyCode = "up";
		}
		if (key === "s") {
			player1.keyPress = true; 
			player1.keyCode = "down";
		}
		if (key === "arrowup" && !AIData.activate) {
			player2.keyPress = true; 
			player2.keyCode = "up";
		}
		if (key === "arrowdown" && !AIData.activate) {
			player2.keyPress = true; 
			player2.keyCode = "down";
		}
	}

	document.onkeyup = function(e: KeyboardEvent): void {
		const key = e.key.toLowerCase();
		if (key === "w" || key === "s") 
			player1.keyPress = false;
		if (key === "arrowup" || key === "arrowdown") 
			player2.keyPress = false;
	}

	function setOnresize(): void {
		onresizeData.ballRelativeLeft = ballData.ball.offsetLeft / width;
		onresizeData.ballRelativeTop = ballData.ball.offsetTop / height;
		onresizeData.player1RelativeTop = player1.paddle.offsetTop / height;
		onresizeData.player2RelativeTop = player2.paddle.offsetTop / height;

		if (gameElement){
			width = gameElement.clientWidth;
			height = gameElement.clientHeight;
		}
		generalData.paddleMargin = height * 0.03;

		onresizeData.newSpeed = 0.01;
	}

	window.onresize = function (): void {
		setOnresize();

		ballData.velX = Math.sign(ballData.velX) * width * onresizeData.newSpeed;
		ballData.velY = Math.sign(ballData.velY) * height * onresizeData.newSpeed;
	
		ballData.ball.style.left = `${onresizeData.ballRelativeLeft * width}px`;
		ballData.ball.style.top = `${onresizeData.ballRelativeTop * height}px`;

		player1.paddle.style.top = `${onresizeData.player1RelativeTop * height}px`;
		player2.paddle.style.top = `${onresizeData.player2RelativeTop * height}px`;
	
		if (ballData.ball.offsetLeft < 0) {
			updateScore(player2.paddle);
			resetBall();
			return;
		} else if (ballData.ball.offsetLeft + ballData.ball.clientWidth > width) {
			updateScore(player1.paddle);
			resetBall();
			return;
		}
	
		if (ballData.ball.offsetTop < 0) {
			ballData.ball.style.top = `0px`;
			ballData.velY = Math.abs(ballData.velY);
		} else if (ballData.ball.offsetTop + ballData.ball.clientHeight > height) {
			ballData.ball.style.top = `${height - ballData.ball.clientHeight}px`;
			ballData.velY = -Math.abs(ballData.velY);
		}
	}
	function saveGameState() {
		const gameState = {
				player1: {
						counter: player1.counter,
						paddleTop: player1.paddle.offsetTop
				},
				player2: {
						counter: player2.counter,
						paddleTop: player2.paddle.offsetTop
				},
				ball: {
						posX: ballData.ball.offsetLeft,
						posY: ballData.ball.offsetTop,
						velX: ballData.velX,
						velY: ballData.velY,
						angle: ballData.angle
				},
				generalData: {
						time: generalData.time,
						speed: generalData.speed,
						paddleSpeed: generalData.paddleSpeed
				},
				AIData: {
						activate: AIData.activate,
						targetY: AIData.targetY
				}
		};
		localStorage.setItem('gameState', JSON.stringify(gameState));
}

function loadGameState() {
		const savedState = localStorage.getItem('gameState');

		if (savedState) {
				const gameState = JSON.parse(savedState);

				player1.counter = gameState.player1.counter;
				player2.counter = gameState.player2.counter;

				player1.paddle.style.top = `${gameState.player1.paddleTop}px`;
				player2.paddle.style.top = `${gameState.player2.paddleTop}px`;

				ballData.ball.style.left = `${gameState.ball.posX}px`;
				ballData.ball.style.top = `${gameState.ball.posY}px`;
				ballData.velX = gameState.ball.velX;
				ballData.velY = gameState.ball.velY;
				ballData.angle = gameState.ball.angle;


				generalData.time = gameState.generalData.time;
				generalData.speed = gameState.generalData.speed;
				generalData.paddleSpeed = gameState.generalData.paddleSpeed;

				AIData.activate = gameState.AIData.activate;
				AIData.targetY = gameState.AIData.targetY;

				document.getElementById('counter1')!.innerText = player1.counter.toString();
				document.getElementById('counter2')!.innerText = player2.counter.toString();
		}
}

const initialize = () => {
	if (document.readyState === 'complete') {
			setOnresize();
			start();
	} else {
			window.addEventListener('load', () => {
					setOnresize();
					start();
			});
	}
};

function clearGameState(){
	localStorage.removeItem('gameState');
	player1.counter = 0;
	player2.counter = 0;
	document.getElementById('counter1')!.innerText = '0';
	document.getElementById('counter2')!.innerText = '0';
}

window.addEventListener('beforeunload', () => {
	saveGameState();
});

document.addEventListener('DOMContentLoaded', function() {
		start();
		loadGameState();
		setOnresize();
});

window.addEventListener("popstate", () => {
	if (socket_game)
		socket_game.close();
	stop();
	clearGameState();
});

	setOnresize();
	initialize();
}