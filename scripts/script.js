'use strict'
new p5()

// VARIABLES

let canvas
let game = document.getElementById('game')
let menu = document.getElementById('menu')
let screen = 'menu'
let prev_screen = 'menu'

const change_screen = s => {
	screen = s
	// canvas creating after
	if ((canvas && s == 'game') || (canvas && prev_screen == 'game')) canvas.classList.toggle('hidden')
	if (s == 'game' || prev_screen == 'game') game.classList.toggle('hidden')
	if (s == 'menu' || prev_screen == 'menu') menu.classList.toggle('hidden')
}

menu.querySelector('#start_game').addEventListener('click', () => change_screen('game'))

const display_size = 600
// block width
let bw = 50

let items

let init_items = {
	treasures: [
	],
	poisons: [
		new Poison(2, 2, 2),
		new Poison(5, 8, 0),
		new Poison(8, 9, 5)
	],
	portals: [],
	traps: [
		new Trap(8, 7, 15),
		new Trap(9, 5, 15),
		new Trap(9, 6, 15),
		new Trap(1, 1, 15)
	]
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
let visited = []

// player
let p

// IMPORTANT FUNCTIONS

const rand = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min

// ! OPTIMIZE that (later)
function drawLabyrinth() {
	lab.forEach((rowEl, row) => {
		rowEl.forEach((tile, col) => {

			noStroke()
			fill(visited[row][col] ? 30 : 20)
			rect(col * bw, row * bw, bw, bw)
			stroke(200)


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
			const check_side = (side, i) => {
				return tile[i] == side && vis[row][col].includes(side)
			}

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

function reset() {

	items = Object.assign({}, init_items)

	vis = vis.map(e => e.map(i => i = ''))

	visited = vis.map(e => e.map(i => i = ''))

	p = new Player(8, 8, 0.2, lab)

	// making visited tile player on
	visited[p.x][p.y] = 1

}

function setup() {
	createCanvas(display_size, display_size)

	canvas = document.querySelector('canvas')
	canvas.classList.toggle('hidden')

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
		for (let j = 0; j < l; j++) {
			vis[i][j] = ''
		}
	}

	reset()
}

function draw() {
	background('darkgrey')


	drawLabyrinth()

	// if player is out of labyrinth
	let out = p.x < 1 || p.x > 10 || p.y < 1 || p.y > 10

	stroke(255)
	textSize(32)

	if (out && !p.treasure) {
		p.message('You need to finnd treasure before leaving!')
	} else if (out && p.treasure.real) {
		// show end screen
	} else if (out && !p.treasure.real) {
		p.message('Youre treasure is not real! Go find real one!')
	}

	p.always_draw()
	p.update()


	// updating items
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
	if (screen == 'game') {
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
}

