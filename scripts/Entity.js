class Entity {
	constructor(x, y, icon) {
		this.x = x
		this.y = y
		this.icon = loadImage(`./icons/${icon ? icon : 'noicon'}.png`)
		this.fading = false
		this.fade_increment = -3
		this.fade_value = 255
		this.deleted = false

		// message
		this.m = null
		this.m_color = '#171717'
		this.m_timer = 0
		this.m_x = 0
		this.m_y = 0
		this.m_next_y = 0
		this.m_anim_speed = 0.05
	}
	set_icon(icon) {
		this.icon = loadImage(`./icons/${icon ? icon : 'noicon'}.png`)
	}
	interact(object) {
		return this.x == object.x && this.y == object.y
	}
	nearby(object, distance) {
		return abs(this.x - object.nx) <= distance && abs(this.y - object.ny) <= distance
	}

	can_see(object) {

		if (!object.lab_link) {
			console.error('Object does not contain link to a labyrinth!')
			return 0
		}

		let dir_x = object.x < this.x
		let dir_y = object.y < this.y

		for (let i = object.x; i <= this.x; dir_x ? i++ : i--) {
			for (let j = object.y; j <= this.y; dir_y ? j++ : j--) {
				// memorize map tile
				const tile = object.lab_link[i][j]

				// wall checking is for object

				// check if in one line
				if (object.y == this.y) {
					if (dir_x) {
						// check right wall
						if (tile.includes('e')) return 0
					} else {
						// check left wall
						if (tile.includes('w')) return 0
					}
				}
				if (object.x == this.x) {
					if (dir_y) {
						// check bottom wall
						if (tile.includes('s')) return 0
					} else {
						// check top wall
						if (tile.includes('n')) return 0
					}
				}

				//checking diagonal walls
				if (dir_y) {
					if (dir_x) {
						// check bot right walls
						if (tile.includes('s') && tile.includes('e')) return 0
					} else {
						// check bot left walls
						if (tile.includes('s') && tile.includes('w')) return 0
					}
				} else {
					if (dir_x) {
						// check top right walls
						if (tile.includes('n') && tile.includes('e')) return 0
					} else {
						// check top left walls
						if (tile.includes('n') && tile.includes('w')) return 0
					}
				}
			}
		}
		// if on fov of sight is no walls - this can see object
		return true
	}

	message(text, c, x, y) {
		this.m = text
		this.m_color = c || '#171717'
		this.m_timer = 120
		this.m_x = x ? x * bw : this.x * bw + bw / 2
		this.m_y = y ? y * bw : this.y * bw - bw / 10
		this.m_next_y = y ? y - bw / 2 : this.y * bw - bw / 2

		let half_text_len = text.length / 2 * 8

		if (this.m_x < half_text_len) {
			this.m_x += half_text_len
		} else if (this.m_x > display_size - half_text_len) {
			this.m_x -= half_text_len
		}

		if (this.m_y <= bw) {
			this.m_y += bw + bw / 2
			this.m_next_y += bw + bw / 2
		}
	}
	always_draw() {
		image(this.icon, this.x * bw, this.y * bw, bw, bw)
	}
	fade_out() {
		if (this.fade_value <= 0) {
			this.deleted = true
		}

		push()
		tint(255, this.fade_value);
		this.fade_value += this.fade_increment
		this.always_draw()
		pop()
	}

	update_message() {
		if (this.m_timer > 0) {
			// draw
			push()
			textAlign(CENTER, CENTER)
			fill(this.m_color)
			stroke(150)
			textSize(20)
			text(this.m, this.m_x, this.m_y)
			pop()
			// update values
			this.m_y += this.m_anim_speed * (this.m_next_y - this.m_y)
			this.m_timer--
		}
	}

	update(player) {
		this.update_message()

		if (!player || this.deleted) {
			return 0
		}

		if (this.fading) this.fade_out()


		if (this.nearby(player, 0) && !this.fading) {
			this.fading = true
			this.trigger_effect(player)
		}
	}
}