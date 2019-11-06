class Entity {
	constructor(x, y, icon) {
		this.x = x
		this.y = y
		this.icon = loadImage(`./icons/${icon ? icon : 'noicon'}.png`)
	}
	interact(object) {
		return this.x == object.x && this.y == object.y
	}
	nearby(object, distance) {
		return abs(this.x - ceil(object.x)) <= distance && abs(this.y - ceil(object.y)) <= distance
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

	message(text) {
		console.log(text)
	}
	always_draw() {
		image(this.icon, this.x * bw, this.y * bw, bw, bw)
	}
}