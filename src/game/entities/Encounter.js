import { Vroom, Entity } from '../vroom/vroom.js'

// Constructor
class Encounter extends Entity {
	constructor(type) {
		super({
			physics: {
				enabled: true,
				entityType: Entity.KINETIC,
				physicsType: Entity.NONE
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

		this.type = type || 'location'
		this.scanned = false
		this.color = 'red'
		this.shuttleDocked = true
		this.lastLaunch = Date.now()
		this.dockingCooldown = 1000
	}

	update() {
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
		ctx.rect(relativePos.x, relativePos.y, relativeDim.width, relativeDim.height)
		ctx.stroke()

		// Handle encounter not scanned
		if(!this.scanned) {
			return
		}
	}

	canShuttleLaunch() {
		return this.type == 'location' && this.scanned && this.shuttleDocked && Date.now() - this.lastLaunch > this.dockingCooldown
	}

	canShuttleDock() {
	return this.type == 'location' && this.scanned && !this.shuttleDocked && Date.now() - this.lastLaunch > this.dockingCooldown
}
}

export { Encounter }