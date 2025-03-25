export function pong(): void{
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

	type GeneralDataType = {
		time: number;
		speed: number;
		paddleSpeed: number;
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
		activate: boolean;
		controlAI: NodeJS.Timeout | null;
	}

	const generalData: GeneralDataType = {
		time: 30,
		speed: 25,
		paddleSpeed: 20,
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
		activate: false,
		controlAI: null
	}

	const gameElement = document.getElementById('game');
	if (!gameElement) throw new Error("HTML 'game' element not found.");

	const width = gameElement.clientWidth - generalData.speed;
	const height = gameElement.clientHeight - generalData.speed;
	const player1 = new Player(document.getElementById('paddleLeft') as HTMLElement);
	const player2 = new Player(document.getElementById('paddleRight') as HTMLElement);

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
		generalData.speed = 10;
		ballData.ball.style.left = "50%";
		ballData.ball.style.top = Math.floor(Math.random() * 100) + "%";
		ballData.angle = (Math.random() * Math.PI / 2) - Math.PI / 4;

		ballData.velX = generalData.speed * Math.cos(ballData.angle)
		if ((player1.counter + player2.counter) % 2 === 0)
			ballData.velX *= -1;
		ballData.velY = generalData.speed * Math.sin(ballData.angle);
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
		if (paddle === player1.paddle){
			if ((ballData.ball.offsetLeft <= (paddle.clientWidth + paddle.offsetLeft)) &&
				(ballData.ball.offsetTop >= paddle.offsetTop) && 
				(ballData.ball.offsetTop <= (paddle.offsetTop + paddle.clientHeight)))
				return true;
		}
		else if (paddle === player2.paddle){
			if (((ballData.ball.offsetLeft + ballData.ball.clientWidth) >= paddle.offsetLeft) &&
				(ballData.ball.offsetTop >= paddle.offsetTop) && 
				(ballData.ball.offsetTop <= (paddle.offsetTop + paddle.clientHeight)))
				return true;
		}
		return false;
	}

	function setPaddleCollision(player: Player, paddle: HTMLElement): void {
        player.paddleCenter = paddle.offsetTop + paddle.clientHeight / 2;
        ballData.ballCenter = ballData.ball.offsetTop + ballData.ball.clientHeight / 2;
        generalData.speed = 25;

        paddleCollisionData.offset = (ballData.ballCenter - player.paddleCenter) / (paddle.clientHeight / 2);
        paddleCollisionData.maxBounceAngle = Math.PI / 4;

        ballData.angle = paddleCollisionData.offset * paddleCollisionData.maxBounceAngle;
        generalData.speed == Math.max(10, Math.sqrt(ballData.velX ** 2 + ballData.velY ** 2));
        paddleCollisionData.newVelX = generalData.speed * Math.cos(ballData.angle);
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
        ballData.velY = generalData.speed * Math.sin(ballData.angle);
        
        if (paddle === player1.paddle)
            ballData.ball.style.left = (paddle.offsetLeft + paddle.clientWidth) + "px"
        else if (paddle === player2.paddle)
            ballData.ball.style.left = (paddle.offsetLeft - ballData.ball.clientWidth) + "px";
    }

	function movePaddle(): void {
		if (player1.keyPress) {
			if (player1.keyCode === "up" && player1.paddle.offsetTop >= 15)
				player1.paddle.style.top = `${player1.paddle.offsetTop - generalData.paddleSpeed}px`;
			if (player1.keyCode === "down" && (player1.paddle.offsetTop + player1.paddle.clientHeight) <= height)
				player1.paddle.style.top = `${player1.paddle.offsetTop + generalData.paddleSpeed}px`;
		}
		if (player2.keyPress) {
			if (AIData.activate) {
				if ((AIData.targetY >= player2.paddle.offsetTop) && (AIData.targetY <= (player2.paddle.offsetTop + player2.paddle.clientHeight)))
					player2.keyPress = false;
			}
			if (player2.keyCode === "up" && player2.paddle.offsetTop >= 15)
				player2.paddle.style.top = `${player2.paddle.offsetTop - generalData.paddleSpeed}px`;
			if (player2.keyCode === "down" && (player2.paddle.offsetTop + player2.paddle.clientHeight) <= height)
				player2.paddle.style.top = `${player2.paddle.offsetTop + generalData.paddleSpeed}px`;
		}
	}

	function setAI(): void {
        AIData.timeToReach = (player2.paddle.offsetLeft - ballData.ball.offsetLeft) / ballData.velX;
        AIData.targetY = ballData.ball.offsetTop + ballData.velY * AIData.timeToReach;
        player2.paddleCenter = player2.paddle.offsetTop + player2.paddle.clientHeight / 2;  
    }

	function moveAI(): void {
		setAI();

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

	start();
}