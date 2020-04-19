import { Vroom, Entity } from '../vroom/vroom.js'

import { person } from './person.js'

const state = require('../state.js')

const ground = new Entity({
	layer: 1,
	init() {
		this.active = false
	},
	update() {
		if(!this.active) {
			return
		}
	},
	render() {
		if(!this.active) {
			return
		}
	}
})

ground.activate = function() {
	this.active = true
	Vroom.registerEntity(person)
	Vroom.activateCamera(state.groundCamera)
}

ground.deactivate = function() {
	this.active = false
	Vroom.deregisterEntity(person._id)
}

ground.newScene = function() {
	
}

// Init call
ground.init()

export { ground }