import { Vroom, Entity } from '../vroom/vroom.js'

const shuttle = new Entity({
	physics: {
		enabled: true,
		entityType: Entity.DYNAMIC
	},
	pos: {
		x: 0,
		y: 0
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
		this.interactionCooldown = 1000
	},
	onCollision(target) {
		this.collisionTarget = target
	},
	update() {
		// Y
		if(Vroom.isKeyPressed(89)) {
			if(this.collisionTarget) {
				// Launch
				if(!shuttle.launched && !this.interactionCooldownActive() && this.collisionTarget.canShuttleLaunch()) {
					this.launch()
					
					if(this.collisionTarget.onShuttleLaunch) {
						this.collisionTarget.onShuttleLaunch()
					}
				}

				// Dock
				if(shuttle.launched && !this.interactionCooldownActive() && this.collisionTarget.canShuttleDock()) {
					this.dock()

					if(this.collisionTarget.onShuttleDock) {
						this.collisionTarget.onShuttleDock()
					}
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

		// Reset state
		this.collisionTarget = null
	},
	render(ctx) {
		// Handle shuttle not launched
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
			ctx.rect(relativePos.x, relativePos.y, relativeDim.width, relativeDim.height)
			ctx.stroke()
		}

		// Debug info
		if(Vroom.state.debug.enabled && Vroom.state.debug.overlay) {
			ctx.fillStyle = 'white'
			ctx.font = '12px monospace'

			Vroom.util.multilineText(`launched: ${this.launched}\ncollisionTarget: ${this.collisionTarget ? this.collisionTarget_id : this.collisionTarget}`, { x: relativePos.x + 50, y: relativePos.y - (16 * 2) }, 16)
		}
	}
})

// Check if interaction cooldown is active
shuttle.interactionCooldownActive = function() {
	return Date.now() - this.lastInteraction < this.interactionCooldown
}

// Launch shuttle
shuttle.launch = function() {
	this.launched = true
	this.pos.x = this.collisionTarget.pos.x + this.collisionTarget.halfDim.width - this.halfDim.width
	this.pos.y = this.collisionTarget.pos.y + this.collisionTarget.halfDim.height - this.halfDim.height
	this.vel.y = 0
	this.vel.x = 2
	this.lastInteraction = Date.now()

	// Make camera follow shuttle
	Vroom.state.activeCamera.follow(this._id)
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