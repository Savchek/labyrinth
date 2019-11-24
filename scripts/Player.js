class Player extends Entity {
	constructor(x, y, animation_speed) {
		super(x, y, 'player')
		this.nx = x
		this.ny = y
		this.as = animation_speed

		this.treasure

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

	move(side) {
		let cur_cell = lab[this.nx][this.ny]
		let next_cell

		let sides = ['top', 'right', 'bottom', 'left']
		let side_index = sides.indexOf(side)
		// get opposite side
		let op_side_index = side_index < 2 ? side_index + 2 : side_index - 2

		let step = (side == 'right' || side == 'bottom') ? 1 : -1
		let dir

		if (side == 'left' || side == 'right') {
			dir = 'nx'
		} else {
			dir = 'ny'
		}

		next_cell = lab[this.nx + (dir == 'nx' ? step : 0)][this.ny + (dir == 'ny' ? step : 0)]

		// if wall exist
		if (cur_cell.walls[side_index]) {

			// if wall not visible
			if (!cur_cell.visible[side_index]) {

				// make wall visible
				cur_cell.visible[side_index] = 1
				next_cell.visible[op_side_index] = 1
			}

		} else {
			// if wall not exist
			this[dir] += step
			lab[this.nx][this.ny].visited = true
			this.add_score()
		}
	}

	draw_score() {
		push()
		stroke(255)
		textSize(16)
		text('Очки:', 10, 20)
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