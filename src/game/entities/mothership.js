import { Vroom, Entity } from '../vroom/vroom.js'

import { shuttle } from './shuttle.js'

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
		this.shuttleDocked = true
		this.lastLaunch = Date.now()
		this.dockingCooldown = 1000
		this.inContactWithShuttle = true
	},
	onCollision(target) {
		if(target._id == shuttle._id) {
			this.inContactWithShuttle = true
		}
	},
	update() {
		this.color = (!this.shuttleDocked && this.inContactWithShuttle && this.canShuttleDock()) ? 'green' : 'white'

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

mothership.canShuttleLaunch = function() {
	return this.shuttleDocked && Date.now() - this.lastLaunch > this.dockingCooldown
}

mothership.canShuttleDock = function() {
	return !this.shuttleDocked && Date.now() - this.lastLaunch > this.dockingCooldown
}

// Shuttle launch event
mothership.onShuttleLaunch = function() {
	this.shuttleDocked = false
	this.lastLaunch = Date.now()
}

// Shuttle dock event
mothership.onShuttleDock = function() {
	this.shuttleDocked = true
}

// Init call
mothership.init()

export { mothership }