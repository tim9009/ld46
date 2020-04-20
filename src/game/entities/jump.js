import { Vroom, Entity } from '../vroom/vroom.js'

import { space } from './space.js'
import { mothership } from './mothership.js'

import store from '@/store'

// const state = require('../state.js')

const jump = new Entity({
	layer: 1,
	physics: {
		enabled: false	
	},
	init() {
		console.log('Jump running init')
		this.active = false
		this.speed = 2000
		this.starCount = 200
		this.stars = []
		this.debrisCount = 40
		this.debris = []
	},
	update(secondsPassed) {
		if(!this.active) {
			return
		}

		// Loop through stars
		for(let star in this.stars) {
			if (this.stars[star].pos.x < -(Vroom.state.canvas.getBoundingClientRect().width / 2)) {
				this.stars[star].pos.x = Vroom.state.canvas.getBoundingClientRect().width / 2
				this.stars[star].pos.y = Math.floor(Math.random() * (Vroom.state.canvas.getBoundingClientRect().height + 600)) - ((Vroom.state.canvas.getBoundingClientRect().height / 2) + 300)
			}

			this.stars[star].pos.x -= this.speed * secondsPassed
		}
	},
	render(ctx) {
		if(!this.active) {
			return
		}

		ctx.fillStyle = 'white'
		
		for (let star in this.stars) {
			// Handle star is outside viewport
			if (!Vroom.util.isPosInCameraView(this.stars[star].pos)) {
				continue
			}

			let relativePos = Vroom.util.getCameraRelativePos(this.stars[star].pos)

			ctx.beginPath()
			ctx.arc(relativePos.x, relativePos.y, this.stars[star].r, 0, 2 * Math.PI)
			ctx.fill()
		}
	}
})

// On game restart
jump.restart = function() {
	this.deactivate()
	this.init()
}

jump.activate = function() {
	this.active = true
	Vroom.state.physics.gravity.y = 0
	Vroom.state.physics.friction.x = 0.5
	Vroom.state.physics.friction.y = 0.5

	Vroom.registerEntity(mothership)

	Vroom.activateCamera(store.state.jumpCamera)
	Vroom.state.activeCamera.calculateTargetPos()
	Vroom.state.activeCamera.jumpToTargetPos()

	// Create initial stars
	this.stars = []
	
	for(let i = 0; i < this.starCount; i++) {
		this.stars.push({
			pos: {
				x: Math.floor(Math.random() * Vroom.state.canvas.getBoundingClientRect().width) - (Vroom.state.canvas.getBoundingClientRect().width / 2),
				y: Math.floor(Math.random() * (Vroom.state.canvas.getBoundingClientRect().height + 600)) - ((Vroom.state.canvas.getBoundingClientRect().height / 2) + 300)
			},
			r: Math.floor(Math.random() * 2) + 1
		})
	}

	// Create initial debris
	this.debris = []
	
	for(let i = 0; i < this.debrisCount; i++) {
		let size = Math.floor(Math.random() * 10) + 2

		this.debris.push( new Entity({
			physics: {
				enabled: true,
				entityType: Entity.KINEMATIC,
				collisionType: Entity.NONE
			},
			pos: {
				x: Math.floor(Math.random() * Vroom.state.canvas.getBoundingClientRect().width) - (Vroom.state.canvas.getBoundingClientRect().width / 2),
				y: Math.floor(Math.random() * (Vroom.state.canvas.getBoundingClientRect().height + 600)) - ((Vroom.state.canvas.getBoundingClientRect().height / 2) + 300)
			},
			dim: {
				width: size,
				height: size
			},
			onCollision(target) {
				if(target._id == mothership._id) {
					store.state.resources.mothershipStructure -= this.dim.width
					jump.deleteDebris(this._id)
				}
			},
			update(secondsPassed) {
				if (this.pos.x < -(Vroom.state.canvas.getBoundingClientRect().width / 2)) {
					this.pos.x = Vroom.state.canvas.getBoundingClientRect().width / 2
					this.pos.y = Math.floor(Math.random() * (Vroom.state.canvas.getBoundingClientRect().height + 600)) - ((Vroom.state.canvas.getBoundingClientRect().height / 2) + 300)
				}

				this.pos.x -= 450 * secondsPassed
			},
			render(ctx) {
				let relativePos = Vroom.util.getCameraRelativePos(this.pos)
				let relativeDim = Vroom.util.getCameraRelativeDim(this.dim)

				ctx.strokeStyle = 'red'

				ctx.beginPath()
				ctx.lineWidth = '4px'
				ctx.rect(relativePos.x + 0.5, relativePos.y + 0.5, relativeDim.width, relativeDim.height)
				ctx.stroke()
			}
		}))
	}

	// Register debris
	for(let debris in this.debris) {
		Vroom.registerEntity(this.debris[debris])
	}

	window.setTimeout(function() {
		jump.deactivate()
		space.newScene()
		space.activate()
	}, 30000)
}

jump.deactivate = function() {
	this.active = false
	Vroom.deregisterEntity(mothership._id)

	// Deregister debris
	for(let debris in this.debris) {
		Vroom.deregisterEntity(this.debris[debris]._id)
	}
}

jump.deleteDebris = function(id) {
	for(let debris in this.debris) {
		if(this.debris[debris]._id == id) {
			Vroom.deregisterEntity(id)
			delete this.debris[debris]
			break
		}
	}
}

// Init call
jump.init()

export { jump }