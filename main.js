(() => {
	let container = document.getElementById('container');
	const finalArr = [];

	// Creating 60s timer after the submit button is activated to reload page after timer hits 0s
	// Timer checking every sec if all pairs are found and if they do - shows new page
	// with Replay button
	const createTimer = () => {
		let timeLeft = 60;
		const timerWindow = document.createElement('div');
		timerWindow.setAttribute('id', 'card')
		timerWindow.classList.add('container-sm');
		container.append(timerWindow)
		timerWindow.textContent = timeLeft;

		const timer = setInterval(() => {
			if (timeLeft <= 0) {
				clearInterval(timer)
				document.getElementById('card-container').style['display'] = 'none';
				replayPageLose();
			} else if (document.querySelectorAll('.new-card.success').length === finalArr.length) {
				clearInterval(timer)
				setTimeout(() => {
					// document.getElementById('card-container').style['display'] = 'none';
					replayPageWin();
				}, 500)
			}
			timerWindow.textContent = timeLeft;
			timeLeft -= 1;
		}, 1000)
	}

	// Creating input to set number of pairs that will be in the game
	let startingGameValue;

	const createInput = () => {
		const header = document.createElement('h1')
		header.textContent = 'Find a Pair'
		header.classList.add('h1')

		const form = document.createElement('form');
		form.classList.add('mb-3');

		const setNumberOfPairs = document.createElement('input');
		setNumberOfPairs.classList.add('form-control');
		setNumberOfPairs.placeholder = 'Type even number 2-10'

		const startButton = document.createElement('button');
		startButton.classList.add('btn', 'btn-primary');
		startButton.textContent = 'Start';

		startButton.disabled = true;

		setNumberOfPairs.addEventListener('input', () => {
			if (setNumberOfPairs.value.length === 0) {
				startButton.disabled = true;
			} else {
				startButton.disabled = false;
			}
		});

		form.classList.add('input-group', 'mb-3');
		container.append(header);
		container.append(form);
		form.append(setNumberOfPairs);
		form.append(startButton);

		form.addEventListener('submit', (e) => {
			e.preventDefault();

			if (parseInt(setNumberOfPairs.value) < 2 || parseInt(setNumberOfPairs.value) > 10 || isNaN(parseInt(setNumberOfPairs.value))) {
				startingGameValue = 4;
			} else {
				startingGameValue = Number(setNumberOfPairs.value);
			}

			// Adding conditions to apply different CSS just to make field look good regardless of the number of pairs
			switch(startingGameValue) {
				case 3:
					document.getElementById('card-container').classList.add('container-md-3');
					break;
				case 5:
				case 7:
					document.getElementById('card-container').classList.add('container-md-5');
					break;
				case 9:
					document.getElementById('card-container').classList.add('container-md-9');
					break;
				default:
					break;
			}

			setNumberOfPairs.value = ''
			form.style['display'] = 'none';
			header.style['display'] = 'none';
			createTimer()
			createNewGame()
		})

		return {
			form,
			setNumberOfPairs,
			startButton
		}
	}
	createInput();

	// Function that takes starting game value from user-input and generates pairs of cards accordingly to a given number
	// after that array of pairs is shuffled and printed on the page
	const createNewGame = () => {
		let newPair;
		const arrOfPairs = [];
		while (arrOfPairs.length < startingGameValue * 2) {
			newPair = Math.round(Math.random() * (startingGameValue - 1) + 1);
			if (arrOfPairs.indexOf(newPair) === -1) {
				arrOfPairs.push(newPair)
				arrOfPairs.push(newPair)
			}
		}

		// Taking array of pairs and returns shuffled array
		function shuffle(array) {
			let indexHolder = array.map((item, index) => index);
			return array.map((item, index, array) => {
				const random_index = Math.floor(Math.random() * indexHolder.length);
				const indexHolder_value = indexHolder[random_index];
				indexHolder.splice(random_index, 1);
				return array[indexHolder_value];
			})
		}

		const shuffledArray = shuffle(arrOfPairs);

		const cardContainer = document.getElementById('card-container');

		let firstCard = null;
		let secondCard = null;

		// Printing shuffled array and assiging to every array element Open\Success conditions
		shuffledArray.map((e) => {
			class Card {
				_open = false;
				_success = false;
				constructor(container, number, action) {
					this.newCard = document.createElement('div');
					this.newCard.classList.add('new-card');
					this.newCard.textContent = number;
					this.number = number;

					this.newCard.addEventListener('click', () => {
						if (this.open === false && this.success === false) {
							this.open = true;
							action(this)
						}
					});
					container.append(this.newCard);
				}
				
				// Checking current element Open\Success values to figure if we need to change them or not
				set open(value) {
					this._open = value;
					value ? this.newCard.classList.add(`opened-card-${e}`) : this.newCard.classList.remove(`opened-card-${e}`);
				}
				get open() {
					return this._open;
				}
				set success(value) {
					this._success = value;
					value ? this.newCard.classList.add('success') : this.newCard.classList.remove('success');
				}
				get success() {
					return this._open;
				}
			}

			// Function that checks cards conditions and flips them depends on their state
			const flip = (card) => {
				if (firstCard !== null && secondCard !== null) {
					if (firstCard.number !== secondCard.number) {
						firstCard.open = false;
						secondCard.open = false;
						firstCard = null;
						secondCard = null;
					}
				}

				if (firstCard === null) {
					firstCard = card;
				} else {
					if (secondCard === null) {
						secondCard = card;
					}
				}

				if (firstCard !== null && secondCard !== null) {
					if (firstCard.number === secondCard.number) {
						firstCard.success = true;
						secondCard.success = true;
						firstCard = null;
						secondCard = null;
					}
				}
			}
			finalArr.push(new Card(cardContainer, e, flip))
		})
	}

	const replayPageWin = () => {
		const header = document.createElement('h1');
		header.classList.add('h1');
		header.textContent = 'Congrats! Wanna play again?';

		const replayButton = document.createElement('button');
		replayButton.classList.add('btn', 'btn-primary');
		replayButton.textContent = "Let's Go";

		replayButton.addEventListener('click', () => {
			location.reload();
		})

		document.getElementById('card-container').append(header);
		document.getElementById('card-container').append(replayButton);
	}

	const replayPageLose = () => {
		const header = document.createElement('h1');
		header.classList.add('h1');
		header.textContent = `You get nothing! You Lose! Good day Sir!`;

		const replayButton = document.createElement('button');
		replayButton.classList.add('btn', 'btn-primary');
		replayButton.textContent = "One more time";

		replayButton.addEventListener('click', () => {
			location.reload();
		})

		container.append(header);
		container.append(replayButton);
	}
})();