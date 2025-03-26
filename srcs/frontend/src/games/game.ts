export function pong(): void{
	const gameElement = document.getElementById('game');
	if (!gameElement) throw new Error("HTML 'game' element not found.");

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
		activate: true,
		controlAI: null
	}

	const onresizeData: OnrizeDataType = {
		ballRelativeLeft: 0,
		ballRelativeTop: 0,
		player1RelativeTop: 0,
		player2RelativeTop: 0,
		newSpeed: 0
	}

	setOnresize();

	function start(): void {
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
	}

	function stop(): void {
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

        if (Math.abs(paddleCollisionData.newVelX) < 2){
            if (paddleCollisionData.newVelX > 0)
                paddleCollisionData.newVelX = 2;
            else
            	paddleCollisionData.newVelX = -2;
        }

        if (ballData.velX > 0)
            ballData.velX = paddleCollisionData.newVelX * -1;
        else
            ballData.velX = paddleCollisionData.newVelX * 1;
        ballData.velY = height * generalData.speed * Math.sin(ballData.angle);
        
        if (paddle === player1.paddle)
            ballData.ball.style.left = `${paddle.offsetLeft + paddle.clientWidth}px`;
        else if (paddle === player2.paddle)
            ballData.ball.style.left = `${paddle.offsetLeft - ballData.ball.clientWidth}px`;
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
		/* AIData.errorRate = Math.random() * height */
		if (player2.paddleCenter < AIData.targetY)  // Recien añadido, parece ir bien
			AIData.errorRate = Math.random() * height - player2.paddleCenter
		else if (player2.paddleCenter > AIData.targetY)  // Recien añadido, parece ir bien
			AIData.errorRate = Math.random() * player2.paddleCenter - 0
        player2.paddleCenter = player2.paddle.offsetTop + player2.paddle.clientHeight / 2; 
    }

	function moveAI(): void {
		let random = Math.random();
		setAI();

		if (random < 0.03)  // Según internet las IAs suelen tener un 3% de tasa de error. SI falla, pero a lo mejor hay que aumentar
			AIData.targetY = AIData.errorRate
		while (AIData.targetY < 0 || AIData.targetY > height) {
			if (AIData.targetY < 0) {
				AIData.targetY *= -1;
			} else if (AIData.targetY > height) {
				AIData.targetY = 2 * height - AIData.targetY;
			}
		}

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

	start();
}