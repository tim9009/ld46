import { Vroom, Entity } from '../vroom/vroom.js'

import { space } from './space.js'
import { jump } from './jump.js'
import { shuttle } from './shuttle.js'

import store from '@/store'

const mothership = new Entity({
	layer: 2,
	physics: {
		enabled: true,
		entityType: Entity.KINETIC,
		collisionType: Entity.NONE
	},
	pos: {
		x: 0,
		y: 0
	},
	dim: {
		width: 60,
		height: 60
	},
	mass: 1,
	restitution: 0,
	onCreated() {
	},
	init() {
		console.log('Mothership running init')
		this.active = false
		this.color = 'white'
		this.speed = 0.05
		this.shuttleDocked = true
		this.lastInteraction = Date.now()
		this.interactionCooldown = 1000
		this.inContactWithShuttle = true
	},
	onCollision(target) {
		if(target._id == shuttle._id) {
			this.inContactWithShuttle = true
		}
	},
	update() {
		this.color = (!this.shuttleDocked && this.inContactWithShuttle && this.canShuttleDock()) ? 'green' : 'white'

		// F
		if(Vroom.isKeyPressed(70)) {
			// Check if can fix damage
			if(this.shuttleDocked && store.state.resources.scrap > 0 && store.state.resources.mothershipStructure < 100 && !this.interactionCooldownActive()) {
				store.state.resources.mothershipStructure += store.state.resources.scrap
				store.state.resources.scrap = 0
			}
		}

		if(space.active) {
			// J
			if(Vroom.isKeyPressed(74)) {
				// Check if jump is avaiable
				if(store.state.resources.fuel >= store.state.fuelRequirement && this.shuttleDocked && !this.interactionCooldownActive()) {
					this.jump()
				}
			}
		}

		if(jump.active) {
			// W
			if(Vroom.isKeyPressed(87)) {
				this.vel.y -= this.speed
			}

			// S
			if(Vroom.isKeyPressed(83)) {
				this.vel.y += this.speed
			}

			// Limit movement
			if(this.pos.y > 600) {
				this.pos.y = 600
				this.vel.y = 0
			}
			if(this.pos.y < -600) {
				this.pos.y = -600
				this.vel.y = 0
			}
		}

		// Reset state
		this.inContactWithShuttle = false
	},
	render(ctx) {
		if(!Vroom.util.isEntityInCameraView(this)) {
			return
		}

		// Calculate relative pos and dim
		let relativePos = Vroom.util.getCameraRelativePos(this.pos)
		let relativeDim = Vroom.util.getCameraRelativeDim(this.dim)

		ctx.strokeStyle = this.color

		// Draw mothership
		ctx.beginPath()
		ctx.lineWidth = '4px'
		ctx.rect(relativePos.x + 0.5, relativePos.y + 0.5, relativeDim.width, relativeDim.height)
		ctx.stroke()

		ctx.fillText('Starship F1', relativePos.x - 90, relativePos.y + 32)

		// Fix prompt
		if(this.shuttleDocked && store.state.resources.scrap > 0 && store.state.resources.mothershipStructure < 100 && !this.interactionCooldownActive()) {
			let fixPromptBoxOffset = 56
			let fixPromptTextOffset = 42

			if(jump.active) {
				fixPromptBoxOffset = 28
				fixPromptTextOffset = 14
			}

			ctx.strokeStyle = 'white'
			ctx.beginPath()
			ctx.rect(relativePos.x + 0.5, relativePos.y + 0.5 - fixPromptBoxOffset, 202, 20)
			ctx.stroke()

			ctx.fillStyle = 'white'
			ctx.font = '12px monospace'
			ctx.fillText('Fix damage using scrap? (f)', relativePos.x + 5, relativePos.y - fixPromptTextOffset)
		}

		// Debug info
		if(Vroom.state.debug.enabled && Vroom.state.debug.overlay) {
			ctx.fillStyle = 'white'
			ctx.font = '12px monospace'
			Vroom.util.multilineText(`shuttleDocked: ${this.shuttleDocked}\ncanShuttleLaunch: ${this.canShuttleLaunch()}\ncanShuttleDock: ${this.canShuttleDock()}`, { x: relativePos.x - 200, y: relativePos.y - (16 * 2) }, 16)
		}
	}
})

// On game restart
mothership.restart = function() {
	this.init()
	this.pos.x = 0
	this.pos.y = 0
	this.vel.x = 0
	this.vel.y = 0
}


mothership.activate = function() {
	this.pos.x = 0
	this.pos.y = 0
	this.vel.x = 0
	this.vel.y = 0
}

// Check if interaction cooldown is active
mothership.interactionCooldownActive = function() {
	return Date.now() - this.lastInteraction < this.interactionCooldown
}

mothership.canShuttleLaunch = function() {
	return this.shuttleDocked && !this.interactionCooldownActive()
}

mothership.canShuttleDock = function() {
	return !this.shuttleDocked && !this.interactionCooldownActive()
}

// Shuttle launch event
mothership.onShuttleLaunch = function() {
	this.shuttleDocked = false
	this.lastInteraction = Date.now()
	store.state.shuttleDockedToMothership = false
}

// Shuttle dock event
mothership.onShuttleDock = function() {
	this.shuttleDocked = true
	store.state.shuttleDockedToMothership = true
}

// Jump to next location
mothership.jump = function() {
	console.log('Jump!')
	this.lastInteraction = Date.now()
	store.state.resources.fuel -= store.state.fuelRequirement
	store.state.fuelRequirement++
	store.state.currentLocation += 1
	space.deactivate()
	jump.activate()
}

// Init call
mothership.init()

export { mothership }