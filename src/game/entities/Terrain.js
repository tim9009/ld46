import { Vroom, Entity } from '../vroom/vroom.js'

// Constructor
class Terrain extends Entity {
	constructor(options) {
		options = options || {}
		super({
			physics: {
				enabled: true,
				entityType: Entity.STATIC,
				collisionType: Entity.INELASTIC
			},
			pos: {
				x: (options.pos && options.pos.x) ? options.pos.x : 0,
				y: (options.pos && options.pos.y) ? options.pos.y : 0
			},
			dim: {
				width: (options.dim && options.dim.width) ? options.dim.width : 0,
				height: (options.dim && options.dim.height) ? options.dim.height : 0
			}
		})

		this.color = 'white'
	}

	render(ctx) {
		if(!Vroom.util.isEntityInCameraView(this)) {
			return
		}

		let relativePos = Vroom.util.getCameraRelativePos(this.pos)
		let relativeDim = Vroom.util.getCameraRelativeDim(this.dim)

		ctx.fillStyle = this.color

		ctx.fillRect(relativePos.x, relativePos.y, relativeDim.width, relativeDim.height)
	}
}

export { Terrain }