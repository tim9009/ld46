import { Vroom } from './vroom/vroom.js'

import { space } from './entities/space.js'
import { ground } from './entities/ground.js'

const state = require('./state.js')

Vroom.mainUpdateLoopExtension = function() {
	if(Vroom.isKeyPressed(13) && !state.sceneTriggered) {
		state.sceneTriggered = true
		space.deactivate()
		ground.activate()
	}
}