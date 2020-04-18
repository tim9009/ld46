import { Vroom } from './vroom/vroom.js'

// Entities
import { mothership } from './entities/mothership.js'
import { shuttle } from './entities/shuttle.js'
// import { entityNameThree } from './example_entity_three.js'

const state = require('./state.js')

// Set initial state and start engine
export default function start() {
	// Reset size of canvas
	Vroom.updateSize()

	// Create and activate camera
	state.spaceCamera = Vroom.createCamera({
		pos: {
			x: 0,
			y: 0
		},
		lerpPercentage: 6
	})

	Vroom.activateCamera(state.spaceCamera)
	state.spaceCamera.follow(mothership._id)

	// Set image smooting
	let imageSmoothing = true
	Vroom.state.ctx.mozImageSmoothingEnabled = imageSmoothing
	Vroom.state.ctx.webkitImageSmoothingEnabled = imageSmoothing
	Vroom.state.ctx.msImageSmoothingEnabled = imageSmoothing
	Vroom.state.ctx.imageSmoothingEnabled = imageSmoothing

	state.started = true

	// Register entities
	Vroom.registerEntity(mothership)
	Vroom.registerEntity(shuttle)
	// Vroom.registerEntity(entityNameThree)

	// Vroooom vrooom!
	Vroom.run()

	// Set focus on window to make the game work when played in an iFrame
	window.focus()
}

// Wait for things to load.
//setTimeout(start, 1000)