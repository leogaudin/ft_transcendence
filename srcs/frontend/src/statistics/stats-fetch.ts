import { sendRequest } from "../login-page/login-fetch.js";
import { ChartStats, Historical } from "../types.js"

export function initStatsFetch() {
	pongCharts();
	pongHistorical();
}

async function pongCharts() {
	const winsLossesChart = document.getElementById('winsLossesChart') as HTMLCanvasElement;
	const gameModesChart = document.getElementById('gameModesChart') as HTMLCanvasElement;
	const gamesPlayedChart = document.getElementById('gamesPlayedChart') as HTMLCanvasElement;
	if (!winsLossesChart || !gameModesChart || !gamesPlayedChart) { return ; }

	try {
		const response = await sendRequest('GET', '/matches/general/pong') as ChartStats;
		if (!response)
			throw new Error('Problem while fetching general stats');
		// @ts-ignore
		new Chart(winsLossesChart, {
			type: 'doughnut',
			data: {
				labels: ['Wins', 'Losses'],
				datasets: [
					{
						cutout: '35%',
						data: [response.wins, response.losses],
						borderColor: ['#FEE0EF', '#D087AB'],
						backgroundColor: ['#FEE0EF', '#D087AB'],
					},
				]
			},
			options: {
				plugins: {
					legend: {
						labels: {
							font: { family: 'Perfect DOS VGA', },
							color: '#FEE0EF',
						},
						position: 'left',
					},
					tooltip: {
						titleFont: () => ({ family: 'Perfect DOS VGA' }),
						bodyFont: () => ({ family: 'Perfect DOS VGA', size: 20 }),
						backgroundColor: '#522b66c7',
						displayColors: false,
						bodyAlign: 'center'
					}
				}
			}
		});

		// @ts-ignore
		new Chart(gameModesChart, {
				type: 'doughnut',
				data: {
					labels: ['Classic', 'Caos'],
					datasets: [
						{
							cutout: '35%',
							data: [response.standard_games, response.custom_games],
							borderColor: ['#522B66', '#54184D'],
							backgroundColor: ['#522B66', '#54184D'],
						},
					]
				},
				options: {
				plugins: {
					legend: {
						labels: {
							font: { family: 'Perfect DOS VGA', },
							color: '#FEE0EF',
						},
						position: 'left',
					},
					tooltip: {
						titleFont: () => ({ family: 'Perfect DOS VGA' }),
						bodyFont: () => ({ family: 'Perfect DOS VGA', size: 20 }),
						backgroundColor: '#522b66c7',
						displayColors: false,
						bodyAlign: 'center'
					}
				}
			}
		});
	
		const resultsArray = response.last_ten_games.map((match: any) => { return match.score }); 
		// @ts-ignore
		new Chart(gamesPlayedChart, {
				type: 'line',
				data: {
					labels: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'],
					datasets: [
						{
							label: 'Score in last 10 games',
							data: resultsArray,
							borderColor: ['#FEE0EF'],
							backgroundColor: ['#D087AB'],
						},
					]
				},
				options: {
					scales: {
						x: {
							grid: {
								color: '#54184D'
							},
							ticks: {
								color: '#FEE0EF',
								font: { family: 'Perfect DOS VGA' }
							}	
						},
						y: {
							min: 0,
							suggestedMax: 10,
							grid: {
								color: '#54184D'
							},
							ticks: {
								color: '#FEE0EF',
								font: { family: 'Perfect DOS VGA' }
							}	
						}
					},
				plugins: {
					legend: {
						labels: {
							font: { family: 'Perfect DOS VGA' },
							color: '#FEE0EF',
						},
					},
					tooltip: {
						enabled: false,
					}
				}
			}
		});
	}
	catch (error) {
		console.error(error);
	}
}

async function pongHistorical() {
	const historicalDiv = document.getElementById("historical-div");
	if (!historicalDiv) { return ; }

	try {
		const response = await sendRequest('GET', '/matches/history/pong') as Historical[];
		if (!response)
			throw new Error('Problem while fetching Pong historical');

		response.forEach((match) => {
			const section = document.createElement("section");
			section.setAttribute("id", `match-id-${match.match_id}`);
			section.classList.add('friend-class', 'friend-card');
			match.is_win ? section.classList.add('stats-won-card') : section.classList.add('stats-lost-card');
			section.innerHTML = `
						<div class="flex items-center gap-4">
							<img id="friend-avatar" class="card-avatar rounded-full m-1.5" src="${match.rival_avatar}" alt="Avatar">
						</div>
						<div id="friend-status" class="flex flex-col justify-between items-end px-4 w-full">
							<p>${match.custom_mode} - ${match.user_score}-${match.rival_score}</p>
							<h3 class="self-start">${match.rival_username}</h3>
							<p class="opacity-50 text-sm">${match.played_at.substring(0, 10)}</p>
						</div>
					`;
			historicalDiv.appendChild(section);
		})
	}
	catch (error) {
		console.error(error);
	}
}