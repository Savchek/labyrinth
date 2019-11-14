class Player extends Entity {
	constructor(x, y, animation_speed) {
		super(x, y, 'player')
		this.nx = x
		this.ny = y
		this.as = animation_speed

		this.treasure = undefined

		// score stuff
		this.score = 0
		this.score_multiplier = 1
		this.previous_score = 0
		this.text_size = 16
		this.text_anim = 0.1
		this.text_color = '#171717'
	}

	add_score() {
		this.score += this.score_multiplier
		let score_str = this.score + ''
		this.message('+' + this.score_multiplier, this.text_color, bw + bw / 2 + score_str.length * 10, -bw + 15)
	}

	move(side, axis) {
		// defining what way player goes
		let direction = axis == 'x' ? 'nx' : 'ny'
		let step = (side == 'w' || side == 'n') ? -1 : 1

		let alt_side = side == 'w' ? 'e' : side == 'e' ? 'w' : side == 'n' ? 's' : 'n'

		// if player trying to move out of labyrinth
		if (this[direction] + step > lab.length - 1 || this[direction] + step < 0) return 0

		// predict move
		this[direction] = this[direction] + step

		if (lab[this.ny][this.nx].includes(alt_side)) {

			if (!vis[this.ny][this.nx].includes(alt_side)) {
				vis[this.ny][this.nx] += alt_side
			}

			// denying move
			this[direction] = round(this[axis])
		} else {
			visited[this.ny][this.nx] = 1
			this.add_score()
		}

	}

	draw_score() {
		push()
		stroke(255)
		textSize(16)
		text('Score:', 10, 20)
		textSize(this.text_size)
		fill(this.text_color)
		text(this.score, 60, 20)
		if (this.previous_score != this.score) {
			this.text_size = 20
		}
		if (this.text_size > 16) {
			this.text_size -= this.text_anim
			this.previous_score = this.score
		} else {
			this.text_size = 16
		}
		pop()
	}

	update() {
		// if next position is not current - add to position
		if (this.nx != this.x) this.x += this.as * (this.nx - this.x)
		if (this.ny != this.y) this.y += this.as * (this.ny - this.y)

		// normalize position numbers ( becouse some gap always left)
		if (abs(this.x - this.nx) < 0.01) this.x = round(this.x)
		if (abs(this.y - this.ny) < 0.01) this.y = round(this.y)

		this.draw_score()
		this.update_message()
	}
}