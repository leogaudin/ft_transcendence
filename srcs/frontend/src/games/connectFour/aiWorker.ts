interface BoardState {
    boardMap: { [key: string]: number[] };
    columnIds: string[];
    player1: { num: number };
    player2: { num: number };
}

self.onmessage = (e: MessageEvent) => {
    const { boardState, depth } = e.data;
    const result = findBestMove(boardState, depth);
    self.postMessage(result);
};

function findBestMove(boardState: BoardState, depth: number): string {
    let bestScore = -Infinity;
    let bestColumnId = '';

    for (const columnId of boardState.columnIds) {
        const columnData = boardState.boardMap[columnId];
        if (!isColumnPlayable(columnData)) continue;

        const row = columnData.findIndex(cell => cell === 0);
        if (row === -1) continue;

        columnData[row] = boardState.player2.num;
        const potential = evaluateColumnPotential(boardState, columnId, boardState.player2.num);
        const score = minmax(depth, false, -Infinity, Infinity, boardState) + potential;
        columnData[row] = 0;

        if (score > bestScore) {
            bestScore = score;
            bestColumnId = columnId;
        }
    }

    return bestColumnId || boardState.columnIds[0];
}

function minmax(depth: number, isMax: boolean, alpha: number, beta: number, boardState: BoardState): number {
    if (checkDraw(boardState)) return 0;
    if (depth === 0) return evaluateBoard(boardState);

    if (isMax) {
        let maxEval = -Infinity;
        for (const columnId of boardState.columnIds) {
            const columnData = boardState.boardMap[columnId];
            if (!isColumnPlayable(columnData)) continue;

            const row = columnData.findIndex(cell => cell === 0);
            if (row === -1) continue;

            columnData[row] = boardState.player2.num;
            const evaluation = minmax(depth - 1, false, alpha, beta, boardState);
            columnData[row] = 0;

            maxEval = Math.max(maxEval, evaluation);
            alpha = Math.max(alpha, evaluation);
            if (beta <= alpha) break;
        }
        return maxEval;
    } else {
        let minEval = Infinity;
        for (const columnId of boardState.columnIds) {
            const columnData = boardState.boardMap[columnId];
            if (!isColumnPlayable(columnData)) continue;

            const row = columnData.findIndex(cell => cell === 0);
            if (row === -1) continue;

            columnData[row] = boardState.player1.num;
            const evaluation = minmax(depth - 1, true, alpha, beta, boardState);
            columnData[row] = 0;

            minEval = Math.min(minEval, evaluation);
            beta = Math.min(beta, evaluation);
            if (beta <= alpha) break;
        }
        return minEval;
    }
}

function isColumnPlayable(columnData: number[]): boolean {
    return columnData.some(cell => cell === 0);
}

function checkDraw(boardState: BoardState): boolean {
    return Object.values(boardState.boardMap).every(column => 
        !column.some(cell => cell === 0)
    );
}

function evaluateBoard(boardState: BoardState): number {
    let score = 0;
    
    score += evaluateLines(boardState, 1, 0);
    score += evaluateLines(boardState, 0, 1);
    score += evaluateLines(boardState, 1, 1);
    score += evaluateLines(boardState, 1, -1);
    
    return score;
}

function evaluateLines(boardState: BoardState, deltaX: number, deltaY: number): number {
    let score = 0;
    const columnCount = boardState.columnIds.length;

    for (let startCol = 0; startCol < columnCount - 3 * Math.abs(deltaX); startCol++) {
        for (let startRow = 0; startRow < 6 - 3 * Math.abs(deltaY); startRow++) {
            if (deltaY === -1 && startRow < 3) continue;
            score += evaluateWindow(boardState, startCol, startRow, deltaX, deltaY);
        }
    }
    return score;
}

function evaluateWindow(boardState: BoardState, col: number, row: number, deltaX: number, deltaY: number): number {
    const window: number[] = [];
    
    for (let i = 0; i < 4; i++) {
        const currentCol = col + i * deltaX;
        const currentRow = row + i * deltaY;
        
        if (currentCol >= 0 && currentCol < boardState.columnIds.length && 
            currentRow >= 0 && currentRow < 6) {
            const columnId = boardState.columnIds[currentCol];
            const cellValue = boardState.boardMap[columnId][currentRow];
            window.push(cellValue);
        }
    }

    if (window.length !== 4) return 0;
    
    const ai = window.filter(cell => cell === boardState.player2.num).length;
    const human = window.filter(cell => cell === boardState.player1.num).length;
    const empty = window.filter(cell => cell === 0).length;
    
    if (ai === 4) return 100;
    if (human === 4) return -100;
    if (ai === 3 && empty === 1) return 10;
    if (human === 3 && empty === 1) return -10;
    if (ai === 2 && empty === 2) return 2;
    if (human === 2 && empty === 2) return -2;
    
    return 0;
}

function evaluateColumnPotential(boardState: BoardState, columnId: string, playerNum: number): number {
    let potential = 0;
    const columnData = boardState.boardMap[columnId];
    
    let verticalCount = 0;
    for (let i = 0; i < columnData.length; i++) {
        if (columnData[i] === playerNum) verticalCount++;
        else if (columnData[i] === 0) continue;
        else verticalCount = 0;
    }
    if (verticalCount >= 4) potential += 100;
    
    const col = boardState.columnIds.indexOf(columnId);
    for (let row = 0; row < columnData.length; row++) {
        if (columnData[row] === 0 || columnData[row] === playerNum) {
            potential += calculatePositionPotential(boardState, col, row, playerNum);
        }
    }
    
    return potential;
}

function calculatePositionPotential(boardState: BoardState, col: number, row: number, playerNum: number): number {
    let potential = 0;
    const directions = [
        {x: 1, y: 0},
        {x: 1, y: 1},
        {x: 1, y: -1}
    ];
    
    for (const {x, y} of directions) {
        let space = 0;
        let count = 0;
        
        for (let i = -3; i <= 3; i++) {
            const newCol = col + i * x;
            const newRow = row + i * y;
            
            if (newCol >= 0 && newCol < boardState.columnIds.length && 
                newRow >= 0 && newRow < 6) {
                const columnId = boardState.columnIds[newCol];
                const value = boardState.boardMap[columnId][newRow];
                if (value === 0) space++;
                else if (value === playerNum) count++;
                else {
                    space = 0;
                    count = 0;
                }
            }
        }
        if (space + count >= 4) potential += count * 2;
    }
    return potential;
}