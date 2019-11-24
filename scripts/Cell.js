class Cell {
	constructor(x, y) {
		this.x = x
		this.y = y
		this.walls = new Array(4).fill(true)
		this.visible = new Array(4).fill(1)
		this.visited = false
		this.contain_item - false
		// for random generator
		this.gen_visited = false
	}

	draw_way() {
		push()
		noStroke()
		fill(this.visited ? 30 : 20)
		rect(this.x * bw, this.y * bw, bw, bw)
		pop()
	}

	draw() {
		push()
		strokeWeight(2)
		stroke(200)

		let x = this.x * bw
		let y = this.y * bw

		// top wall
		if (this.walls[0] && this.visible[0]) {
			line(x, y, x + bw, y)
		}

		// left wall
		if (this.walls[3] && this.visible[3]) {
			line(x, y, x, y + bw)
		}

		noFill()
		strokeWeight(5)
		stroke(50, 10, 100)
		rect(0, 0, display_size, display_size)

		pop()
	}

	check_neighbors() {
		let neighbors = []

		let top = lab[this.x][this.y - 1]
		let right = lab[this.x + 1] ? lab[this.x + 1][this.y] : 0
		let bottom = lab[this.x][this.y + 1]
		let left = lab[this.x - 1] ? lab[this.x - 1][this.y] : 0

		if (top && !top.gen_visited) {
			neighbors.push(top)
		}
		if (right && !right.gen_visited) {
			neighbors.push(right)
		}
		if (bottom && !bottom.gen_visited) {
			neighbors.push(bottom)
		}
		if (left && !left.gen_visited) {
			neighbors.push(left)
		}

		if (neighbors.length > 0) {
			return neighbors[rand(0, neighbors.length - 1)]
		} else {
			return 0
		}


	}
}