import { Vroom, Entity } from '../vroom/vroom.js'

const shuttle = new Entity({
	layer: 2,
	physics: {
		enabled: true,
		entityType: Entity.DYNAMIC
	},
	pos: {
		x: 20,
		y: 20
	},
	dim: {
		width: 20,
		height: 20
	},
	mass: 1,
	restitution: 0,
	onCreated() {
	},
	init() {
		this.color = 'white'
		this.vlavla = 0.1
		this.launched = false
		this.collisionTarget = null
		this.lastInteraction = Date.now()
		this.interactionCooldown = 200
	},
	onCollision(target) {
		this.collisionTarget = target
	},
	update() {
		// Y
		if(Vroom.isKeyPressed(89)) {
			if(this.collisionTarget) {
				// Launch
				if(!this.launched && !this.interactionCooldownActive() && this.collisionTarget.canShuttleLaunch()) {
					this.launch()
					
					if(this.collisionTarget.onShuttleLaunch) {
						this.collisionTarget.onShuttleLaunch()
					}
				}

				// Dock
				if(this.launched && !this.interactionCooldownActive() && this.collisionTarget.canShuttleDock()) {
					this.dock()

					if(this.collisionTarget.onShuttleDock) {
						this.collisionTarget.onShuttleDock()
					}
				}
			}
		}

		// N
		if(Vroom.isKeyPressed(78)) {
			if(!this.launched && this.collisionTarget.canShuttleDock() && !this.interactionCooldownActive()) {
				this.dock()

				if(this.collisionTarget.onShuttleDock) {
					this.collisionTarget.onShuttleDock()
				}
			}
		}

		// Handle shuttle not launched
		if(!this.launched) {
			return
		}
		// A
		if(Vroom.isKeyPressed(65)) {
			this.vel.x -= this.vlavla
		}

		// D
		if(Vroom.isKeyPressed(68)) {
			this.vel.x += this.vlavla
		}

		// W
		if(Vroom.isKeyPressed(87)) {
			this.vel.y -= this.vlavla
		}

		// S
		if(Vroom.isKeyPressed(83)) {
			this.vel.y += this.vlavla
		}
	},
	render(ctx) {
		// Calculate relative pos and dim
		let relativePos = Vroom.util.getCameraRelativePos(this.pos)
		let relativeDim = Vroom.util.getCameraRelativeDim(this.dim)

		if(this.launched) {
			// Set color
			ctx.fillStyle = this.color
			ctx.strokeStyle = this.color

			// Draw shuttle
			ctx.beginPath()
			ctx.lineWidth = '4px'
			ctx.rect(relativePos.x + 0.5, relativePos.y + 0.5, relativeDim.width, relativeDim.height)
			ctx.stroke()

			// Docking prompt
			if(this.collisionTarget && this.collisionTarget.canShuttleDock()) {
				ctx.strokeStyle = 'white'
				ctx.beginPath()
				ctx.rect(relativePos.x + 0.5, relativePos.y + 0.5 - 28, 160, 20)
				ctx.stroke()

				ctx.fillStyle = 'white'
				ctx.font = '12px monospace'
				ctx.fillText('Initiate docking? (y)', relativePos.x + 5, relativePos.y - 15)
			}
		}

		// Launch prompt
		if(!this.launched && this.collisionTarget) {
			let targetRelativePos = Vroom.util.getCameraRelativePos(this.collisionTarget.pos)

			if(!this.interactionCooldownActive() && this.collisionTarget.canShuttleLaunch()) {
				ctx.strokeStyle = 'white'
				ctx.beginPath()
				ctx.rect(targetRelativePos.x + 0.5, targetRelativePos.y + 0.5 - 28, 159, 20)
				ctx.stroke()

				ctx.fillStyle = 'white'
				ctx.font = '12px monospace'
				ctx.fillText('Launch shuttle? (y/n)', targetRelativePos.x + 5, targetRelativePos.y - 15)
			}
		}

		// Debug info
		if(Vroom.state.debug.enabled && Vroom.state.debug.overlay) {
			ctx.fillStyle = 'white'
			ctx.font = '12px monospace'

			Vroom.util.multilineText(`launched: ${this.launched}`, { x: relativePos.x + 50, y: relativePos.y + (16 * 2) }, 16)
		}
	},
	afterRender() {
		// Reset state
		this.collisionTarget = null
	}
})

// Check if interaction cooldown is active
shuttle.interactionCooldownActive = function() {
	return Date.now() - this.lastInteraction < this.interactionCooldown
}

// Activate shuttle with correct satte
shuttle.activate = function() {
	this.docked = true
	this.lastInteraction = Date.now()
}

// Launch shuttle
shuttle.launch = function() {
	this.launched = true
	this.pos.x = this.collisionTarget.pos.x + this.collisionTarget.halfDim.width - this.halfDim.width
	this.pos.y = this.collisionTarget.pos.y + this.collisionTarget.halfDim.height - this.halfDim.height
	this.vel.y = 0
	this.vel.x = 2
	this.lastInteraction = Date.now()
}

// Dock shuttle
shuttle.dock = function() {
	this.launched = false
	this.vel.x = 0
	this.vel.y = 0
	this.pos.x = this.collisionTarget.pos.x + this.collisionTarget.halfDim.width - this.halfDim.width
	this.pos.y = this.collisionTarget.pos.y + this.collisionTarget.halfDim.height - this.halfDim.height
	this.lastInteraction = Date.now()
}

// Init call
shuttle.init()

export { shuttle }