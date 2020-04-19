import { Vroom } from './vroom/vroom.js'

// Entities
import { shuttle } from './entities/shuttle.js'
import { person } from './entities/person.js'
import { space } from './entities/space.js'
import { ground } from './entities/ground.js'

const state = require('./state.js')

// Set initial state and start engine
export default function start() {
	// Reset size of canvas
	Vroom.updateSize()

	// Create cameras
	state.spaceCamera = Vroom.createCamera({
		pos: {
			x: 0,
			y: 0
		},
		lerpPercentage: 6
	})
	state.spaceCamera.follow(shuttle._id)

	state.groundCamera = Vroom.createCamera({
		pos: {
			x: 0,
			y: 0
		},
		lerpPercentage: 6
	})
	state.groundCamera.follow(person._id)

	// Activate camera
	Vroom.activateCamera(state.spaceCamera)

	// Set image smooting
	let imageSmoothing = true
	Vroom.state.ctx.mozImageSmoothingEnabled = imageSmoothing
	Vroom.state.ctx.webkitImageSmoothingEnabled = imageSmoothing
	Vroom.state.ctx.msImageSmoothingEnabled = imageSmoothing
	Vroom.state.ctx.imageSmoothingEnabled = imageSmoothing

	// Vroooom vrooom!
	Vroom.run()

	state.started = true

	// Register entities
	Vroom.registerEntity(space)
	Vroom.registerEntity(ground)

	space.newScene()
	space.activate()

	// Set focus on window to make the game work when played in an iFrame
	window.focus()
}

// Wait for things to load.
//setTimeout(start, 1000)