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
	mothership.activate()

	// Register encounters
	for(let encouter in this.encounters) {
		Vroom.registerEntity(this.encounters[encouter])
	}

	Vroom.activateCamera(store.state.spaceCamera)
	Vroom.state.activeCamera.calculateTargetPos()
	Vroom.state.activeCamera.jumpToTargetPos()
}

space.deactivate = function() {
	this.active = false
	Vroom.deregisterEntity(mothership._id)
	Vroom.deregisterEntity(shuttle._id)
	
	// Deegister encounters
	for(let encouter in this.encounters) {
		Vroom.deregisterEntity(this.encounters[encouter]._id)
	}
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

	let encounterCount = Math.floor(Math.random() * 5) + 2

	let fuelChance = 0.8
	let totalFuel = 0

	for(let i = 0; i < encounterCount; i++) {
		let itemCount = Math.floor(Math.random() * 5) + 1
		let items = []

		// Generate list of items
		for(let ii = 0; ii < itemCount; ii++) {
			let type = (Math.random() >= fuelChance) ? 'fuel' : ((Math.random() >= 0.4) ? 'scrap' : 'oxygen' )
			let ammount = (Math.floor(Math.random() * 3)) + 1
			
			if(type == 'fuel') {
				totalFuel += ammount
				fuelChance += (0.25 * ammount)
			}

			// Add fuel if no fuel has been added
			if(totalFuel < store.state.fuelRequirement && i == encounterCount - 1 && ii == itemCount - 1) {
				type = 'fuel'
				ammount = store.state.fuelRequirement - totalFuel
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
space.init()

export { space }