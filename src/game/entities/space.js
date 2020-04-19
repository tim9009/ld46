import { Vroom, Entity } from '../vroom/vroom.js'

import { mothership } from './mothership.js'
import { shuttle } from './shuttle.js'
import { Encounter } from './Encounter.js'

import store from '@/store'

// const state = require('../state.js')

const space = new Entity({
	layer: 1,
	physics: {
		enabled: false	
	},
	init() {
		console.log('Space running init')
		this.active = false
		this.starCount = 50000
		this.stars = []
		this.encounters = []
	},
	update() {
		if(!this.active) {
			return
		}
	},
	render(ctx) {
		if(!this.active) {
			return
		}

		ctx.fillStyle = 'white'
		
		for (let star in this.stars) {
			// Handle star is outside viewport
			if (!Vroom.util.isPosInCameraView(this.stars[star].pos)) {
				continue
			}

			let relativePos = Vroom.util.getCameraRelativePos(this.stars[star].pos)

			ctx.beginPath()
			ctx.arc(relativePos.x, relativePos.y, this.stars[star].r, 0, 2 * Math.PI)
			ctx.fill()
		}

		// Show resources
		// ctx.fillText(`Fuel: ${state.resources.fuel.toFixed(1)} Oxygen: ${state.resources.oxygen.toFixed(1)}`, 10, 10)
	}
})

// On game restart
space.restart = function() {
	this.deactivate()
	this.init()
}

space.activate = function() {
	this.active = true
	Vroom.state.physics.gravity.y = 0
	Vroom.state.physics.friction.x = 0.5
	Vroom.state.physics.friction.y = 0.5

	Vroom.registerEntity(mothership)
	Vroom.registerEntity(shuttle)
	shuttle.activate()
	Vroom.registerEntity(this.encounters[0])

	Vroom.activateCamera(store.state.spaceCamera)
	Vroom.state.activeCamera.calculateTargetPos()
	Vroom.state.activeCamera.jumpToTargetPos()
}

space.deactivate = function() {
	this.active = false
	Vroom.deregisterEntity(mothership._id)
	Vroom.deregisterEntity(shuttle._id)
	Vroom.deregisterEntity(this.encounters[0]._id)
}

space.newScene = function() {
	this.stars = []
	
	for(let i = 0; i < this.starCount; i++) {
		this.stars.push({
			pos: {
				x: Math.floor(Math.random() * 50000) - 25000,
				y: Math.floor(Math.random() * 50000) - 25000
			},
			r: Math.floor(Math.random() * 2) + 1
		})
	}

	this.encounters = []

	this.encounters.push(new Encounter({
		type: 'location',
		ground: {
			items: [
				{
					type: 'fuel',
					pos: {
						x: 400,
						y: -10
					}
				}
			]
		}
	}))
}

// Init call
space.init()

export { space }