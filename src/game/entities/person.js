import { Vroom, Entity } from '../vroom/vroom.js'

import { ground } from './ground.js'
import { space } from './space.js'

const person = new Entity({
	layer: 2,
	physics: {
		enabled: true,
		entityType: Entity.DYNAMIC
	},
	pos: {
		x: 100,
		y: -20
	},
	dim: {
		width: 10,
		height: 20
	},
	mass: 5,
	restitution: 0,
	onCreated() {
	},
	init() {
		this.active = false
		this.color = 'blue'
		this.speed = 0.2
		this.maxSpeed = 4
		this.boarded = true
		this.inContactWithExit = false
		this.collisionTarget = null
		this.lastInteraction = Date.now()
		this.interactionCooldown = 200
		this.onGround = true
	},
	onCollision(target) {
		if(target.type == 'exit') {
			this.collisionTarget = target
			this.inContactWithExit = true
		}

		if(target.type == 'terrain') {
			this.onGround = true
		}
	},
	update() {
		// Y
		if(Vroom.isKeyPressed(89)) {
			// Board
			if(!this.boarded && this.inContactWithExit && !this.interactionCooldownActive()) {
				this.board()
			}

			// Leave
			if(this.boarded && !this.interactionCooldownActive()) {
				this.leave()
			}
		}

		// N
		if(Vroom.isKeyPressed(78)) {
			if(this.boarded && !this.interactionCooldownActive()) {
				this.board()
			}
		}

		// Handle person has boarded
		if(this.boarded) {
			return
		}

		// A
		if(Vroom.isKeyPressed(65)) {
			this.vel.x -= this.speed
		}

		// D
		if(Vroom.isKeyPressed(68)) {
			this.vel.x += this.speed
		}

		// SPACE
		if(Vroom.isKeyPressed(32)) {
			if(this.onGround) {
				this.vel.y = -15
				this.onGround = false
			}
		}

		// Limit speed
		if(this.vel.x > this.maxSpeed) {
			this.vel.x = this.maxSpeed
		}

		if(this.vel.x < -this.maxSpeed) {
			this.vel.x = -this.maxSpeed
		}
	},
	render(ctx) {
		// Calculate relative pos and dim
		let relativePos = Vroom.util.getCameraRelativePos(this.pos)
		let relativeDim = Vroom.util.getCameraRelativeDim(this.dim)

		if(!this.boarded) {
			// Set color
			ctx.fillStyle = this.color
			ctx.strokeStyle = this.color

			// Draw person
			ctx.beginPath()
			ctx.lineWidth = '4px'
			ctx.rect(relativePos.x + 0.5, relativePos.y + 0.5, relativeDim.width, relativeDim.height)
			ctx.stroke()
		}

		// Board prompt
		if(!this.boarded && this.collisionTarget && this.inContactWithExit) {
			let targetRelativePos = Vroom.util.getCameraRelativePos(this.collisionTarget.pos)

			if(!this.interactionCooldownActive()) {
				ctx.strokeStyle = 'white'
				ctx.beginPath()
				ctx.rect(targetRelativePos.x + 0.5, targetRelativePos.y + 0.5 - 28, 140, 20)
				ctx.stroke()

				ctx.fillStyle = 'white'
				ctx.font = '12px monospace'
				ctx.fillText('Board shuttle? (y)', targetRelativePos.x + 5, targetRelativePos.y - 15)
			}
		}

		// Leave prompt
		if(this.boarded && this.collisionTarget) {
			let targetRelativePos = Vroom.util.getCameraRelativePos(this.collisionTarget.pos)

			if(!this.interactionCooldownActive()) {
				ctx.strokeStyle = 'white'
				ctx.beginPath()
				ctx.rect(targetRelativePos.x + 0.5, targetRelativePos.y + 0.5 - 28, 151, 20)
				ctx.stroke()

				ctx.fillStyle = 'white'
				ctx.font = '12px monospace'
				ctx.fillText('Leave shuttle? (y/n)', targetRelativePos.x + 5, targetRelativePos.y - 15)
			}
		}
	},
	afterRender() {
		// Reset state
		this.collisionTarget = null
		this.inContactWithExit = false
	}
})

// Check if interaction cooldown is active
person.interactionCooldownActive = function() {
	return Date.now() - this.lastInteraction < this.interactionCooldown
}

// Activate person with correct sate
person.activate = function() {
	this.boarded = true
	this.lastInteraction = Date.now()
}

// Board shuttle
person.board = function() {
	this.boarded = true
	this.vel.x = 0
	this.vel.y = 0
	this.lastInteraction = Date.now()
	
	ground.deactivate()
	space.activate()
}

// Leave shuttle
person.leave = function() {
	this.boarded = false
	this.vel.x = 2
	this.vel.y = 0
	// this.pos.x = this.collisionTarget.pos.x + this.collisionTarget.halfDim.width - this.halfDim.width
	// this.pos.y = this.collisionTarget.pos.y + this.collisionTarget.halfDim.height - this.halfDim.height
	this.lastInteraction = Date.now()
}

// Init call
person.init()

export { person }