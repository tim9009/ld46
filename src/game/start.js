import { Vroom } from './vroom/vroom.js'

// Entities
import { mothership } from './entities/mothership.js'
import { shuttle } from './entities/shuttle.js'
import { person } from './entities/person.js'
import { space } from './entities/space.js'
import { ground } from './entities/ground.js'
import { jump } from './entities/jump.js'

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

	store.state.jumpCamera = Vroom.createCamera({
		pos: {
			x: 0,
			y: 0
		},
		lerpPercentage: 6
	})
	store.state.jumpCamera.follow(mothership._id)

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
	store.state.resources.fuel = 0
	store.state.resources.scrap = 5
	store.state.resources.mothershipStructure = 100
	store.state.currentLocation = 1
	store.state.fuelRequirement = 1
	store.state.finalLocaiton = 5

	// Restart entities if restarting
	if(restarting) {
		console.log('RESTARTING!')
		space.restart()
		ground.restart()
		jump.restart()
		mothership.restart()
		shuttle.restart()
		person.restart()
	}

	// Make sure no entities are already registered
	Vroom.deregisterEntity(space._id)
	Vroom.deregisterEntity(ground._id)
	Vroom.deregisterEntity(jump._id)

	// Register scene entities
	Vroom.registerEntity(space)
	Vroom.registerEntity(ground)
	Vroom.registerEntity(jump)

	// Activate space scene
	space.newScene()
	space.activate()

	// Set focus on window to make the game work when played in an iFrame
	window.focus()
}

// Wait for things to load.
//setTimeout(start, 1000)