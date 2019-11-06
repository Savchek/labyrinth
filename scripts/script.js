'use strict'
new p5()

// VARIABLES
const moode = document.getElementById('hardmode')

const display_size = 600
// block width
let bw = 50

// game shit
let score = 0, previous_score = 0,
	tSize = 16,
	tAnim = 0.1

let items

let init_items = {
	treasures: [
	],
	poisons: [
		new Poison(9, 8, 2),
		new Poison(6, 8, 0),
		new Poison(8, 9, 5)
	],
	portals: [],
	traps: []
}

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
]

//! optimize!
// visible sides of labyrinth
let vis = []

// floor icons (3)
// let floor_tiles = Array(3).fill(0)
// let floor_indexes = []

// player
let p

// IMPORTANT FUNCTIONS

const rand = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min

// ! OPTIMIZE that (later)
function drawLabyrinth() {
	stroke(0)

	lab.forEach((rowEl, row) => {
		rowEl.forEach((tile, col) => {

			// draw tile image
			//image(floor_tiles[floor_indexes[row][col]], col * bw, row * bw, bw, bw)

			// push()
			// fill(255)
			// strokeWeight(1)
			// stroke(0)
			// rect(col * bw, row * bw, bw, bw)
			// fill(0, 102, 153)
			// noStroke()
			// textSize(9)
			// text(row + ' ' + col, col * bw + 15, row * bw + 30)
			// pop()


			// if tile have no walls
			if (tile == '0') return
			// calculate tile position
			let x = col * bw,
				y = row * bw

			//							tile contains wall AND this wall is visible
			const check_side = (side, i) => (tile[i] == side && vis[row][col].includes(side))

			for (let i = 0, l = tile.length; i < l; i++) {

				if (check_side('n', i)) {
					line(x, y, x + bw, y)

				} else if (check_side('e', i)) {
					line(x + bw, y, x + bw, y + bw)

				} else if (check_side('s', i)) {
					line(x, y + bw, x + bw, y + bw)

				} else if (check_side('w', i)) {
					line(x, y, x, y + bw)

				}
			}
			//end of for

		})
	})
}

function update_score() {

	// make html element

	// if(score != prev_score)
	push()
	fill(20)
	noStroke()
	textSize(16)
	text('Score:', 10, 20)
	textSize(tSize)
	text(p.score, 60, 20)
	if (previous_score != p.score) {
		tSize = 20
	}
	if (tSize > 16) {
		tSize -= tAnim
		previous_score = p.score
	} else {
		tSize = 16
	}
	pop()
}

function reset() {
	score = 0
	previous_score = 0

	items = Object.assign({}, init_items)

	// reset visible sides
	vis = vis.map(e => e.map(i => i = ''))

	p = new Player(8, 8, 0.2, lab)

}

// function preload() {
//load floor tilec icons
// floor_tiles = floor_tiles.map((e, i) => loadImage(`./icons/floor${i + 1}.png`))
// }

function setup() {
	createCanvas(display_size, display_size)

	// giving each tile on board random icon
	// let flen = floor_tiles.length - 1
	// lab.forEach(e => {
	// 	let t = []
	// 	e.forEach(() => t.push(rand(0, flen)))
	// 	floor_indexes.push(t)
	// })

	// init visible sides array
	for (let i = 0, l = lab.length; i < l; i++) {
		vis.push([])
		for (let j = 0; j < l; j++)
			vis[i][j] = ''
	}

	reset()
}

function draw() {
	background('white')

	// if not hardmode (bullshit)
	if (!moode.checked) drawLabyrinth()

	update_score()

	// if player is out of labyrinth
	let out = p.x < 1 || p.x > 10 || p.y < 1 || p.y > 10

	stroke(255)
	fill(20)
	textSize(32)

	if (out && !p.treasure) {
		p.message('You need to finnd treasure before leaving!')
	} else if (out && p.treasure.real) {
		// show end screen
	} else if (out && !p.treasure.real) {
		p.message('Youre treasure is not real! Go find real one!')
	}

	p.update()
	p.always_draw()


	Object.keys(items).forEach(o => {
		if (items[o].length > 0)
			items[o].forEach(e => {
				e.update(p)
			})
	})


	// treasures.forEach(e => {
	// 	e.draw()
	// 	e.update()
	// })


}

const useBtn = (a, b) => p.move(a, b)

function keyPressed() {
	switch (keyCode) {
		case LEFT_ARROW:
			p.move('w', 'x')
			break

		case RIGHT_ARROW:
			p.move('e', 'x')
			break

		case UP_ARROW:
			p.move('n', 'y')
			break

		case DOWN_ARROW:
			p.move('s', 'y')
			break
	}
}

