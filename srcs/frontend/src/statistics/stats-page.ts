// import { Chart } from "chart.js";

export function initStatsEvents() {
	const ctx = document.getElementById('myChart');
	
	new Chart(ctx, {
		type: 'doughnut',
		data: {
			labels: ['Wins', 'Losses'],
			datasets: [
				{
					cutout: '35%',
					data: [1, 2],
					borderColor: ['#FEE0EF', '#54184D'],
					backgroundColor: ['#FEE0EF', '#54184D'],
				},
			]
		},
		options: {
        plugins: {
            legend: {
                labels: {
                    font: { family: 'Perfect DOS VGA', },
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

	const ctx2 = document.getElementById('myChartTwo');
	
	new Chart(ctx2, {
			type: 'doughnut',
			data: {
				labels: ['Classic', 'Caos'],
				datasets: [
					{
						cutout: '35%',
						data: [1, 2],
						borderColor: ['#FEE0EF', '#54184D'],
						backgroundColor: ['#FEE0EF', '#54184D'],
					},
				]
			},
			options: {
			plugins: {
				legend: {
					labels: {
						font: { family: 'Perfect DOS VGA', },
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

	const ctx3 = document.getElementById('myChartThree');
	
	new Chart(ctx3, {
			type: 'line',
			data: {
				labels: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'],
				datasets: [
					{
						label: 'Score in last 10 games',
						data: [1, 2, 2, 4, 6, 2, 9, 6, 3, 5],
						color: '#FEE0EF',
						borderColor: ['#54184D'],
						backgroundColor: ['#FEE0EF'],
					},
				]
			},
			options: {
				scales: {
					x: {
						ticks: {
							font: { family: 'Perfect DOS VGA' }
						}	
					},
					y: {
						ticks: { 
							font: { family: 'Perfect DOS VGA' }
						}	
					}
				},
			plugins: {
				legend: {
					labels: {
						font: { family: 'Perfect DOS VGA' },
					},
				},
				tooltip: {
					enabled: false,
				}
			}
		}
	});
}
