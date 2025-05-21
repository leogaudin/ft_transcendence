import {
	Player,
    columnMap,
    columnList,
    boardMap,
	pauseGame,
	returnToGames,
	init as initEngine,
	clearGame as clearGameEngine,
	insertDivWinner as insertDivWinnerEngine,
	insertDivDraw as insertDivDrawEngine,
	checkDraw as checkDrawEngine,
	checkWin as checkWinEngine,
	enableClicks as enableClicksEngine,
	disableClicks as disableClicksEngine,
	placeToken as placeTokenEngine,
	isColumnPlayable as isColumnPlayableEngine,
	detectWinOpportunities as detectWinOpportunitiesEngine,
} from './gameEngine.js';

import { Games } from "../../types.js";

export function classicMode(data: Games): void {
	class PlayerClass implements Player {
		color: string;
		turn: boolean = false;
		winner: boolean = false;
		num: number;
		AI: boolean;

		constructor(AI: boolean, num: number, color: string) {
			this.AI = AI;
			this.num = num;
			this.color = color;
		}
	}

	const player1 = new PlayerClass(false, 1, "red");
	const player2 = new PlayerClass(data.gameMode === "ai" ? true : false, 2, "yellow");

	function init(): void {
		initEngine(player1, boardMap, columnMap, columnList);
	}

	function start(): void {
		clearGame();
		init();
		enableClicks();
		columnList.forEach((column: HTMLElement) => {
			column.addEventListener("click", () => handleColumnClick(column));
		});
	}

	function clearGame(): void {
		clearGameEngine(player1, player2, columnList, columnMap, boardMap);
	}

	function enableClicks(): void {
		enableClicksEngine(columnList);
	}

	function disableClicks(): void {
		disableClicksEngine(columnList);
	}

	async function handleColumnClick(column: HTMLElement): Promise<void> {
		if (player1.winner || player2.winner) {
			clearGame();
			return;
		}

		await placeToken(column);
		if (checkWin(false)) {
			insertDivWinner();
			disableClicks();
		} else if (checkDraw()) {
			insertDivDraw();
			disableClicks();
		} else {
			if (player2.turn && player2.AI) {
				disableClicks();
				console.log("AI is thinking...");
				await aiToken();
				console.log("AI token placed");
			}
		}
	}

	function insertDivWinner(): void {
		insertDivWinnerEngine(player1, player2, columnList);
	}

	function insertDivDraw(): void {
		insertDivDrawEngine(columnList);
	}

	async function placeToken(column: HTMLElement): Promise<void> {
		await placeTokenEngine(column, player1, player2, columnMap, boardMap, columnList, "classic");
	}

	function checkDraw(): boolean {
		return checkDrawEngine(boardMap, columnList);
	}

	function checkWin(checking: boolean): boolean {
		return checkWinEngine(boardMap, columnList, player1, player2, checking);
	}

	async function aiToken(): Promise<void> {
		const winColumns = detectWinOpportunities(player2);
		if (winColumns.length > 0) {
			enableClicks();
			await winColumns[0].click();
			return;
		}

		const threatColumns = detectWinOpportunities(player1);
		if (threatColumns.length > 0) {
			enableClicks();
			await threatColumns[0].click();
			return;
		}

		let columnToUse: HTMLElement | null = Math.random() < 0.2
			? columnList[Math.floor(Math.random() * columnList.length)]
			: null;

		if (!columnToUse){
			const boardState = {
				boardMap: Object.fromEntries(
					Array.from(boardMap.entries()).map(([key, value]) => [key, [...value]])
				),
				columnIds: columnList.map(col => col.id),
				player1: { num: player1.num },
				player2: { num: player2.num }
        	};

			const worker = new Worker(new URL('./aiWorker.js', import.meta.url));
			
			const bestColumnId = await new Promise<string>((resolve) => {
				worker.onmessage = (e) => resolve(e.data);
				worker.postMessage({ 
					boardState,
					depth: 5
				});
			});

			worker.terminate();
			columnToUse = columnList.find(col => col.id === bestColumnId) || null;
		}

		if (columnToUse && !isColumnPlayable(columnToUse)) {
			columnToUse = columnList.find((column) => isColumnPlayable(column)) || null;
		}

		enableClicks();
		if (columnToUse)
			await columnToUse.click();
	}

	function isColumnPlayable(column: HTMLElement): boolean {
		return isColumnPlayableEngine(column, boardMap);
	}

	function detectWinOpportunities(player: Player): HTMLElement[] {
		return detectWinOpportunitiesEngine(boardMap, columnList, player, player1, player2);
	}

	document.getElementById('pauseGame')?.addEventListener('click', async () => {
		await pauseGame(columnList);
	})

	document.getElementById('exitGame')?.addEventListener('click', async () => {
		await returnToGames(columnList);
	})

	start();
}