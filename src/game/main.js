import { Vroom } from './vroom/vroom.js'

import start from './start.js'

import store from '@/store'

Vroom.mainUpdateLoopExtension = function(secondsPassed) {
	// If the game has not been won or lost
	if(!store.state.gameLost && !store.state.gameWon) {
		// Use oxygen
		if(store.state.resources.oxygen > 0) {
			store.state.resources.oxygen -= 0.5 * secondsPassed
		}

		// Limit oxygen to 0
		if(store.state.resources.oxygen < 0) {
			store.state.resources.oxygen = 0
		}

		// Check for loss condition
		if(store.state.resources.oxygen == 0) {
			store.state.gameLost = true
		}

		// Check for win codition
		if(store.state.currentLocation >= store.state.finalLocaiton) {
			store.state.gameWon = true
		}
	}

	// BACKSPACE
	if(Vroom.isKeyPressed(8)) {
		store.state.resources.oxygen = 0
	}

	if(store.state.gameLost || store.state.gameWon) {
		// ENTER
		if(Vroom.isKeyPressed(13)) {
			start()
		}
	}
}