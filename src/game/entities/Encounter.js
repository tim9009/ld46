import { Vroom, Entity } from '../vroom/vroom.js'

import { space } from './space.js'
import { ground } from './ground.js'
import { shuttle } from './shuttle.js'

// Constructor
class Encounter extends Entity {
	constructor(options) {
		options = options || {}
		super({
			physics: {
				enabled: true,
				entityType: Entity.KINETIC,
				collisionType: Entity.NONE
			},
			pos: {
				x: 400,
				y: -100
			},
			dim: {
				width: 30,
				height: 30
			}
		})

		this.type = options.type || 'location'
		this.ground = {
			items: (options.ground && options.ground.items) ? options.ground.items : []
		}
		this.scanned = false
		this.color = 'red'
		this.shuttleDocked = false
		this.lastInteraction = Date.now()
		this.interactionCooldown = 1000
		this.inContactWithShuttle = false
	}

	onCollision(target) {
		if(target._id == shuttle._id) {
			this.inContactWithShuttle = true
		}
	}

	update() {
		this.color = this.inContactWithShuttle ? 'green' : 'red'

		// Reset state
		this.inContactWithShuttle = false
	}

	render(ctx) {
		if(!Vroom.util.isEntityInCameraView(this)) {
			return
		}

		let relativePos = Vroom.util.getCameraRelativePos(this.pos)
		let relativeDim = Vroom.util.getCameraRelativeDim(this.dim)

		ctx.strokeStyle = this.color
		ctx.lineWidth = '4px'

		ctx.beginPath()
		ctx.rect(relativePos.x + 0.5, relativePos.y + 0.5, relativeDim.width, relativeDim.height)
		ctx.stroke()

		// Handle encounter not scanned
		if(!this.scanned) {
			return
		}
	}

	canShuttleDock() {
		return this.type == 'location' && !this.scanned && Date.now() - this.lastInteraction > this.interactionCooldown
	}

	canShuttleLaunch() {
		return this.type == 'location' && !this.scanned && this.shuttleDocked && Date.now() - this.lastInteraction > this.interactionCooldown
	}

	onShuttleDock() {
		this.shuttleDocked = true
		this.lastInteraction = Date.now()
		space.deactivate()
		ground.setScene(this.ground)
		ground.activate()
	}

	onShuttleLaunch() {
		this.lastInteraction = Date.now()
		this.shuttleDocked = false
	}
}

export { Encounter }