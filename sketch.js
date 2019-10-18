const displaySize = 600

// block width
let bw = 50

// player
let p = {
	// current position
	x: 8,
	y: 8,
	// next position (to animate)
	nx: 8,
	ny: 8,
	// animation speed
	as: 0.2,
	// color
	col: '120,120,120',
	// width gap
	wg: 20,
	// carrying treasure
	ct: false,

	update() {
		if (this.nx != this.x) this.x += this.as * (this.nx - this.x)

		if (this.ny != this.y) this.y += this.as * (this.ny - this.y)

		if (abs(this.x - this.nx) < this.as / 10) this.x = round(this.x)

		if (abs(this.y - this.ny) < this.as / 10) this.y = round(this.y)
	},

	draw() {
		stroke('#136f7d')
		fill(this.col)
		strokeWeight(1)
		rect(this.x * bw + this.wg / 2,
			this.y * bw + this.wg / 2,
			bw - this.wg, bw - this.wg)
	}
}

class Treasure {
	constructor(_fake, _x, _y, _wg) {
		this.x = _x || 10
		this.y = _y || 1
		this.wg = _wg || 30
		this.fake = _fake || false
		this.visible = false
	}

	draw() {
		if (this.visible) {
			push()
			fill('#f7dc60')
			stroke('#d19513')
			rect(this.x * bw + this.wg / 2, this.y * bw + this.wg / 2, bw - this.wg, bw - this.wg)
			pop()
		}
	}

	update() {
		if (abs(p.x - this.x) < 2 && abs(p.y - this.y) < 2) {
			this.visible = true
		} else {
			this.visible = false
		}
		if (p.x == this.x && p.y == this.y) p.ct = true

		if (p.ct) {
			this.x = p.x
			this.y = p.y
		}
	}
}

let score = 0,
	prevScore = 0,
	tSize = 16,
	tAnim = 0.1,
	treasures = []

// labyrinth [hardcoded]
let lab = [
	['nw', 'ns', 'ns', 'ns', 'ns', 'ns', 'ns', 'ns', 'ns', 'ns', 'ns', 'ne'],
	['we', 'nws', 'ns', 'ne', 'wn', 'ns', 'ns', 'n', 'ns', 'nes', 'wne', 'ew'],
	['w', 'sn', 'en', 'ew', 'ew', 'wn', 'ne', 'ws', 'ns', 'ns', 'e', 'ew'],
	['we', 'wsn', 's', 'e', 'we', 'we', 'ws', 'n', 'nse', 'nwe', 'we', 'ew'],
	['we', 'wne', 'nws', 'e', 'w', 'se', 'new', 'ws', 'ne', 'ew', 'ew', 'ew'],
	['we', 'ws', 'ne', 'we', 'ew', 'nw', 'se', 'nws', '0', 's', 'e', 'ew'],
	['we', 'nwe', 'w', '0', 'se', 'ws', 'n', 'ns', 's', 'nse', 'wse', 'ew'],
	['we', 'we', 'swe', 'ws', 'ne', 'nw', 's', 'sne', 'new', 'nws', 'ne', 'ew'],
	['we', 'ws', 'ns', 'ns', 'se', 'ws', 'n', 'ne', 'ws', 'n', 'e', 'ew'],
	['we', 'nws', 'ns', 'n', 'n', 'ne', 'we', 'ws', 'ne', 'we', 'wes', 'ew'],
	['we', 'nws', 'ns', 'es', 'wes', 'ws', 's', 'nes', 'ws', 's', 'nse', 'ew'],
	['ws', 'sn', 'sn', 'sn', 'sn', 'sn', 'sn', 'sn', 'sn', 'sn', 'sn', 'se']
],
	vis = [] // visible sides


function setup() {
	createCanvas(displaySize, displaySize)
	let rt = new Treasure(true, 1, 6)
	treasures.push(rt)

	// init visible sides
	for (let i = 0, l = lab.length; i < l; i++) {
		vis.push([])
		for (let j = 0; j < l; j++)
			vis[i][j] = ''
	}

}

function draw() {
	strokeWeight(2)
	background('#c3dfe3')

	drawLabyrinth()

	//draw aund update score
	push()
	fill(20)
	noStroke()
	textSize(16)
	text('Score:', 10, 20)
	textSize(tSize)
	text(score, 60, 20)
	if (prevScore != score) {
		tSize = 20
	}
	if (tSize > 16) {
		tSize -= tAnim
		prevScore = score
	} else {
		tSize = 16
	}
	pop()

	let out = p.x < 1 || p.x > 10 || p.y < 1 || p.y > 10
	stroke(255)
	fill(20)
	textSize(32)
	if (out && p.ct) {
		text('YEY', 270, 300)
		text('Score: ' + score, 235, 350)
		noLoop()
	} else if (out && !p.ct) {
		text('Go back for treasure!', 150, 300)
	}

	p.update()
	p.draw()

	treasures.forEach(e => {
		e.draw()
		e.update()
	})

}

function drawLabyrinth() {
	lab.forEach((rowEl, row) => {
		rowEl.forEach((b, col) => {

			if (row == 0 || row == 11 || col == 0 || col == 11) {
				push()
				noStroke()
				fill('#45c77f')
				rect(col * bw + 1, row * bw + 1, bw - 2, bw - 2)
				pop()
			}

			// push()
			// fill(200)
			// strokeWeight(1)
			// rect(col * bw + 10, row * bw + 10, bw - 20, bw - 20)
			// fill(0, 102, 153)
			// noStroke()
			// text(row + ' ' + col, col*bw+15, row*bw+30)
			// pop()


			if (b == '0') return

			let x = col * bw,
				y = row * bw

			checkers = (side, i) => (b[i] == side && vis[row][col].includes(side))

			for (let i = 0, l = b.length; i < l; i++) {

				if (checkers('n', i)) {
					line(x, y, x + bw, y)

				} else if (checkers('e', i)) {
					line(x + bw, y, x + bw, y + bw)

				} else if (checkers('s', i)) {
					line(x, y + bw, x + bw, y + bw)

				} else if (checkers('w', i)) {
					line(x, y, x, y + bw)

				}
			}
			//end of for
		})
	})
}

useBtn = (side, dir) => {

	const gotSide = lab[p.ny] && lab[p.ny][p.nx] && lab[p.ny][p.nx].includes(side)

	//make side visible
	if (gotSide && !vis[p.ny][p.nx].includes(side)) {
		vis[p.ny][p.nx] += side
		score++
	}


	if (!gotSide && abs(dir == 'x' ? p.y - p.ny : p.x - p.nx) < p.wg / bw) {
		let d = dir == 'x' ? 'nx' : 'ny'
		let s = (side == 'w' || side == 'n') ? -1 : 1

		p[d] = p[d] + s
		score++
	}
}

function keyPressed() {
	switch (keyCode) {
		case LEFT_ARROW:
			useBtn('w', 'x')
			break

		case RIGHT_ARROW:
			useBtn('e', 'x')
			break

		case UP_ARROW:
			useBtn('n', 'y')
			break

		case DOWN_ARROW:
			useBtn('s', 'y')
			break
	}
}