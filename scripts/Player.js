class Player extends Entity {
	constructor(x, y, animation_speed, labyrinth_link) {
		super(x, y, 'player')
		this.as = animation_speed
		this.lab_link = labyrinth_link
		this.nx = x
		this.ny = y
		this.score = 0
		this.score_multiplier = 1
		this.treasure = undefined
	}

	add_score() {
		this.score += this.score_multiplier
	}

	move(side, axis) {

		// !CHECK THIS SHIT!
		const got_side = this.lab_link[this.ny][this.nx].includes(side)

		//make side visible

		// if wall exist and its not in vis array
		if (got_side && !vis[this.ny][this.nx].includes(side)) {
			// add side to vis array
			vis[this.ny][this.nx] += side
			this.add_score()

			// thats a moving condition?
		} else {

			let d = axis == 'x' ? 'nx' : 'ny'
			let s = (side == 'w' || side == 'n') ? -1 : 1

			this[d] = this[d] + s
			this.add_score()
		}
	}

	update() {
		// if next position is not current - add to position
		if (this.nx != this.x) this.x += this.as * (this.nx - this.x)
		if (this.ny != this.y) this.y += this.as * (this.ny - this.y)

		// normalize position numbers ( becouse some gap always left)
		if (abs(this.x - this.nx) < 0.01) this.x = round(this.x)
		if (abs(this.y - this.ny) < 0.01) this.y = round(this.y)
	}
}