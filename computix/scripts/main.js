document.addEventListener('DOMContentLoaded', function() {

	var cells = document.querySelectorAll('.cell');
	for(var i = cells.length-1; i >= 0; i--) {
		cells[i].innerHTML = Math.round(Math.random()*9)+1;

		// when click on a cell
		cells[i].addEventListener('click', function() {
			var chosenCell = this;
			// test if chosen cell is playable and not disabled
			if(this.classList.contains("playable") && !this.classList.contains('disabled')) {
				// set cell to unplayable and disabled
				lockBoard();
				this.classList.add('disabled');
				// if score calculation delegated to computer
				if(game.setup.scoreCalc=='comp') {
					// add score to current player score
					game.status['score'+game.status.player]+=eval(this.innerHTML);
					// get index of chosen cell
					changePlayer();
					game.status.cellsIndex = this.dataset[game.status.allowedCells];
					setPlayable(game.status.allowedCells, game.status.cellsIndex); // activate cells to play
					refreshDisplay();
				// if score calcultation is required from players
				} else if(game.setup.scoreCalc=='player') {
					showScoreCalcPannel(eval(this.innerHTML));
					

					// calculate expected result
					var newScore = game.status['score'+game.status.player] + eval(this.innerHTML);
					
					// set the validation button clickable
					document.querySelector('div#score'+game.status.player+' button.scoreIncreaser').addEventListener('click', function() {
						var inputedScore = this.parentNode.querySelector('input').value;
						// wrong score written
						if(inputedScore != newScore) {
							this.parentNode.querySelector('input').classList.add('wrong');
						// correct score written
						} else {
							this.parentNode.querySelector('input').classList.remove('wrong');
							game.status['score'+game.status.player] = newScore;
							changePlayer();
							// get index of chosen cell
							game.status.cellsIndex = chosenCell.dataset[game.status.allowedCells];
							setPlayable(game.status.allowedCells, game.status.cellsIndex); // activate cells to play
							refreshDisplay();
						}
					});
				}
			}
		});
	}
});

function lockBoard() {
	var cells = document.querySelectorAll('.cell');
	for(var i = cells.length-1; i >= 0; i--) {
		cells[i].classList.remove('playable');
	}
}

// set cells playable if match : type is 'line' or 'row', value is line or row index
function setPlayable(type, value) {
	var cells = document.querySelectorAll('.cell');
	for(var i = cells.length-1; i >= 0; i--) {
		if(cells[i].dataset[type] == value) {
			cells[i].classList.add('playable');
		} else {
			cells[i].classList.remove('playable');
		}
	}
}

// switch between line and row and between player 1 and 2
function changePlayer() {
	(game.status.allowedCells=='line')?game.status.allowedCells='row':game.status.allowedCells='line';
	(game.status.player==1)?game.status.player=2:game.status.player=1;
}

// display the pannel if calculation is required from the players
function showScoreCalcPannel(cellValue) {
	var scoreIncreaser = document.querySelector('div#score'+game.status.player+' div.scoreIncreaser');
	scoreIncreaser.querySelector('span.cellValue').innerHTML = cellValue;
	scoreIncreaser.style.display = 'block';
}

function refreshDisplay() {
	// score display
	document.querySelector('span#score1').innerHTML = game.status.score1;
	document.querySelector('span#score2').innerHTML = game.status.score2;

	var notPlayingPlayer = (game.status.player==1)?2:1;
	// shrink score display for the player who it is not the turn to play
	document.querySelector('div#score'+notPlayingPlayer).classList.remove('active');
	// expand current player score display
	document.querySelector('div#score'+game.status.player).classList.add('active');
	// center the board
	document.querySelector('div#board').classList.remove('toP'+notPlayingPlayer);
	// rotate the board to current player
	document.querySelector('div#board').classList.add('toP'+game.status.player);

	// hide all score calculator
	if(game.setup.scoreCalc == 'player') {
		document.querySelector('div#score1 div.scoreIncreaser').style.display = 'none';
		document.querySelector('div#score2 div.scoreIncreaser').style.display = 'none';
	}
}