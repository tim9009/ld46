import { Vroom, Entity } from '../vroom/vroom.js'

import { mothership } from './mothership.js'
import { shuttle } from './shuttle.js'
import { Encounter } from './Encounter.js'

import store from '@/store'

// const state = require('../state.js')

const jump = new Entity({
	layer: 1,
	physics: {
		enabled: false	
	},
	init() {
		console.log('Jump running init')
		this.active = false
	},
	update() {
	},
	render() {
		if(!this.active) {
			return
		}
	}
})

// On game restart
jump.restart = function() {
	this.deactivate()
	this.init()
}

jump.activate = function() {
	this.active = true
	Vroom.state.physics.gravity.y = 0
	Vroom.state.physics.friction.x = 0.5
	Vroom.state.physics.friction.y = 0.5

	Vroom.registerEntity(mothership)

	Vroom.activateCamera(store.state.jumpCamera)
	Vroom.state.activeCamera.calculateTargetPos()
	Vroom.state.activeCamera.jumpToTargetPos()
}

jump.deactivate = function() {
	this.active = false
	Vroom.deregisterEntity(mothership._id)
	Vroom.deregisterEntity(shuttle._id)
	
	// Deegister encounters
	for(let encouter in this.encounters) {
		Vroom.deregisterEntity(this.encounters[encouter]._id)
	}
}

jump.newScene = function() {
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

	let encounterCount = Math.floor(Math.random() * 5) + 2

	for(let i = 0; i < encounterCount; i++) {
		let itemCount = Math.floor(Math.random() * 5) + 1
		let items = []

		let fuelChance = 0.8
		let totalFuel = 0

		// Generate list of items
		for(let ii = 0; ii < itemCount; ii++) {
			let type = (Math.random() >= fuelChance) ? 'fuel' : 'oxygen'
			let ammount = (Math.random() >= 0.5) ? 1 : 2
			
			if(type == 'fuel') {
				totalFuel++
				fuelChance += (0.025 * ammount)
			}

			// Add fuel if no fuel has been added
			if(totalFuel == 0 && ii == itemCount - 2) {
				type = 'fuel'
			}
			
			items.push({
				type,
				pos: {
					x: Math.floor(Math.random() * 700) + 150,
					y: -10
				},
				ammount
			})
		}

		console.log(items)

		// Add encounter
		this.encounters.push(new Encounter({
			type: 'location',
			pos: {
				x: (Math.floor(Math.random() * 800) + 100) * (Math.random() > 0.5 ? -1 : 1) ,
				y: (Math.floor(Math.random() * 600) + 100) * (Math.random() > 0.5 ? -1 : 1)
			},
			ground: {
				items
			}
		}))
	}
}

// Init call
jump.init()

export { jump }