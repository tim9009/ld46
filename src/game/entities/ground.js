import { Vroom, Entity } from '../vroom/vroom.js'

import { person } from './person.js'
import { Item } from './Item.js'
import { Terrain } from './Terrain.js'

const state = require('../state.js')

const ground = new Entity({
	layer: 1,
	physics: {
		enabled: false	
	},
	init() {
		this.active = false
		this.items = []
		this.terrain = []
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
	Vroom.state.physics.gravity.y = 9.81
	Vroom.state.physics.friction.x = 2
	Vroom.state.physics.friction.y = 2

	// Register entities
	Vroom.registerEntity(person)
	person.activate()
	for(let item in this.items) {
		Vroom.registerEntity(this.items[item])
	}
	for(let element in this.terrain) {
		Vroom.registerEntity(this.terrain[element])
	}

	// Set camera
	Vroom.activateCamera(state.groundCamera)
	Vroom.state.activeCamera.calculateTargetPos()
	Vroom.state.activeCamera.jumpToTargetPos()
}

ground.deactivate = function() {
	this.active = false

	// Deregister entities
	Vroom.deregisterEntity(person._id)
	for(let item in this.items) {
		Vroom.deregisterEntity(this.items[item]._id)
	}
	for(let element in this.terrain) {
		Vroom.deregisterEntity(this.terrain[element]._id)
	}
}

ground.setScene = function(options) {
	options = options || {}

	// Reset state
	this.items = []

	// Standard items
	this.items.push(new Item({
		type: 'exit',
		pos: {
			x: 20,
			y: -80
		},
		dim: {
			width: 80,
			height: 80
		}
	}))

	// Items
	if(options.items && options.items.length) {
		for(let item in options.items) {
			this.items.push(new Item({
				type: options.items[item].type || null,
				ammount: options.ammount || null,
				pos: {
					x: (options.items[item].pos && options.items[item].pos.x) ? options.items[item].pos.x : 0,
					y: (options.items[item].pos && options.items[item].pos.y) ? options.items[item].pos.y : 0
				}
			}))
		}
	}

	// Standard terrain
	this.terrain = []
	let groundWidth = 1000
	let elementThickness = 2
	let wallHeight = 100

	// Ground
	this.terrain.push(new Terrain({
		pos: {
			x: 0,
			y: 0
		},
		dim: {
			width: groundWidth,
			height: elementThickness
		}
	}))

	// Left wall
	this.terrain.push(new Terrain({
		pos: {
			x: 0,
			y: -wallHeight
		},
		dim: {
			width: elementThickness,
			height: wallHeight
		}
	}))

	// Right wall
	this.terrain.push(new Terrain({
		pos: {
			x: groundWidth - elementThickness,
			y: -wallHeight
		},
		dim: {
			width: elementThickness,
			height: wallHeight
		}
	}))
}

// Init call
ground.init()

export { ground }