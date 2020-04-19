import { Vroom, Entity } from '../vroom/vroom.js'

import { ground } from './ground.js'
import { person } from './person.js'

import store from '@/store'

// const state = require('../state.js')

// Constructor
class Item extends Entity {
	constructor(options) {
		options = options || {}
		super({
			physics: {
				enabled: true,
				entityType: Entity.KINETIC,
				collisionType: Entity.NONE
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

		this.type = options.type || 'fuel'
		this.ammount = options.ammount || 1
		

		switch(this.type) {
			case 'exit':
				this.color = 'white'
				break

			case 'fuel':
				this.color = 'green'
				break

			case 'oxygen':
				this.color = 'blue'
				break

			default:
				this.color = 'white'
		}

	}

	onCollision(target) {
		// On collision with player character
		if(target._id == person._id) {
			switch(this.type) {
				case 'exit':
					return

				case 'fuel':
					store.state.resources.fuel += this.ammount
					break

				case 'oxygen':
					store.state.resources.oxygen += this.ammount
					break
			}

			ground.deleteItem(this._id)
		}
	}

	render(ctx) {
		if(!Vroom.util.isEntityInCameraView(this)) {
			return
		}

		let relativePos = Vroom.util.getCameraRelativePos(this.pos)

		ctx.strokeStyle = this.color
		ctx.fillStyle = this.color
		ctx.lineWidth = '4px'

		switch(this.type) {
			case 'exit':
				ctx.beginPath()
				ctx.lineWidth = '4px'
				ctx.rect(relativePos.x + 0.5, relativePos.y + 0.5, this.dim.width, this.dim.height)
				ctx.stroke()
				break

			default:
				ctx.beginPath()
				ctx.arc(relativePos.x, relativePos.y, this.ammount + 1, 0, 2 * Math.PI)
				ctx.fill()
				break
		}
	}
}

export { Item }