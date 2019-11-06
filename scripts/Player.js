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
		this.bump = false
	}

	add_score() {
		this.score += this.score_multiplier
	}

	move(side, axis) {

		// defining what way player goes
		let direction = axis == 'x' ? 'nx' : 'ny'
		let step = (side == 'w' || side == 'n') ? -1 : 1

		let alt_side = side == 'w' ? 'e' : side == 'e' ? 'w' : side == 'n' ? 's' : 'n'

		// predict move
		this[direction] = this[direction] + step

		if (lab[this.ny][this.nx].includes(alt_side)) {

			if (!vis[this.ny][this.nx].includes(alt_side)) {
				vis[this.ny][this.nx] += alt_side
			}

			// denying move
			this[direction] = round(this[axis])
			this.message('Bump!')
		} else {
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