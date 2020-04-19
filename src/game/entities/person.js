import { Vroom, Entity } from '../vroom/vroom.js'

const person = new Entity({
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
		width: 10,
		height: 20
	},
	mass: 1,
	restitution: 0,
	onCreated() {
	},
	init() {
		this.active = false
		this.color = 'blue'
		this.vlavla = 0.1
	},
	onCollision(target) {
		this.collisionTarget = target
	},
	update() {
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
		// Calculate relative pos and dim
		let relativePos = Vroom.util.getCameraRelativePos(this.pos)
		let relativeDim = Vroom.util.getCameraRelativeDim(this.dim)

		// Set color
		ctx.fillStyle = this.color
		ctx.strokeStyle = this.color

		// Draw person
		ctx.beginPath()
		ctx.lineWidth = '4px'
		ctx.rect(relativePos.x, relativePos.y, relativeDim.width, relativeDim.height)
		ctx.stroke()

		// // Debug info
		// if(Vroom.state.debug.enabled && Vroom.state.debug.overlay) {
		// 	ctx.fillStyle = 'white'
		// 	ctx.font = '12px monospace'

		// 	Vroom.util.multilineText(`launched: ${this.launched}\ncollisionTarget: ${this.collisionTarget ? this.collisionTarget_id : this.collisionTarget}`, { x: relativePos.x + 50, y: relativePos.y - (16 * 2) }, 16)
		// }
	}
})

// Init call
person.init()

export { person }