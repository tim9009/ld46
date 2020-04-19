import { Vroom } from './vroom/vroom.js'

// Entities
import { mothership } from './entities/mothership.js'
import { shuttle } from './entities/shuttle.js'
import { person } from './entities/person.js'
import { space } from './entities/space.js'
import { ground } from './entities/ground.js'

import store from '@/store'

// const state = require('./state.js')

// Set initial store.state and start engine
export default function start() {
	let restarting = Vroom.state.running
	// Reset size of canvas
	Vroom.updateSize()

	// Create cameras
	store.state.spaceCamera = Vroom.createCamera({
		pos: {
			x: 0,
			y: 0
		},
		lerpPercentage: 6
	})
	store.state.spaceCamera.follow(shuttle._id)

	store.state.groundCamera = Vroom.createCamera({
		pos: {
			x: 0,
			y: 0
		},
		lerpPercentage: 6
	})
	store.state.groundCamera.follow(person._id)

	// Activate camera
	Vroom.activateCamera(store.state.spaceCamera)

	// Start engine if first time starting
	if(!restarting) {
		// Set image smooting
		let imageSmoothing = false
		Vroom.state.ctx.mozImageSmoothingEnabled = imageSmoothing
		Vroom.state.ctx.webkitImageSmoothingEnabled = imageSmoothing
		Vroom.state.ctx.msImageSmoothingEnabled = imageSmoothing
		Vroom.state.ctx.imageSmoothingEnabled = imageSmoothing

		// Vroooom vrooom!
		Vroom.run()
	}

	// Set initial store.state
	store.state.gameWon = false
	store.state.gameLost = false
	store.state.resources.oxygen = 90
	store.state.resources.fuel = 1
	store.state.currentLocation = 1
	store.state.fuelRequirement = 1
	store.state.finalLocaiton = 4

	// Restart entities if restarting
	if(restarting) {
		console.log('RESTARTING!')
		space.restart()
		ground.restart()
		mothership.restart()
		shuttle.restart()
		person.restart()
	}

	// Make sure no entities are already registered
	Vroom.deregisterEntity(space._id)
	Vroom.deregisterEntity(ground._id)

	// Register scene entities
	Vroom.registerEntity(space)
	Vroom.registerEntity(ground)

	// Activate space scene
	space.newScene()
	space.activate()

	// Set focus on window to make the game work when played in an iFrame
	window.focus()
}

// Wait for things to load.
//setTimeout(start, 1000)