'use strict'

new p5()

let canvas
let game = document.getElementById('game')
let menu = document.getElementById('menu')
let end_screen = document.getElementById('end_screen')
let rules = document.getElementById('rules')
let screen = 'menu'

const change_screen = s => {
	screen = s
	if (s == 'end_screen') end_screen.querySelector('.score').innerText = 'Ты набрал ' + p.score + ' очков'
	if (s == 'game') reset()
	game.style.display = s == 'game' ? 'block' : 'none'
	canvas.style.display = s == 'game' ? 'block' : 'none'
	menu.style.display = s == 'menu' ? 'flex' : 'none'
	end_screen.style.display = s == 'end_screen' ? 'flex' : 'none'
	rules.style.display = s == 'rules' ? 'flex' : 'none'
}

document.querySelectorAll('.mbtn').forEach(e => e.addEventListener('click', () => change_screen(e.dataset.screen)))

const display_size = 600

// block width
let bw = 50
let tiles_count = display_size / bw

let lab = new Array(tiles_count).fill(new Array(tiles_count).fill(0))

// player
let p

let items

// for random generator
let current
let stack = []

function rand(min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min
}

function reset() {

	p = new Player(8, 8, 0.2)

	items = {
		exit: [new Exit(rand(0, tiles_count - 1), rand(0, tiles_count - 1))],
		treasures: [
			new Treasure(8, 9)
		],
		poisons: [
			new Poison(9, 3, 3),
			new Poison(10, 4, 2),
			new Poison(6, 5, 0),
			new Poison(8, 1, 0)
		],
		teleports: [
			new Teleport(9, 1, 10, 8),
			new Teleport(10, 1, 10, 9),
			new Teleport(1, 3, 10, 10),
			new Teleport(1, 10, 9, 10),
		],
		traps: [
			new Trap(9, 10, rand(10, 20)),
			new Trap(6, 8, rand(10, 20)),
			new Trap(6, 6, rand(10, 20))
		]
	}

	lab = lab.map((c, i) => c.map((cc, j) => new Cell(i, j)))

	// for random generator
	current = lab[0][0]
	generate_labyrinth()

	// making visited tile player on
	lab[p.x][p.y].visited = true
}

function setup() {
	createCanvas(display_size, display_size)
	canvas = document.querySelector('canvas')
	canvas.style.display = 'none'
}

function draw() {
	background('darkgrey')

	if (screen == 'game') {
		// draw labyrinth
		// becouse of overlaping need to first draw all way
		lab.forEach(e => e.forEach(i => i.draw_way()))

		lab.forEach(e => e.forEach(i => i.draw()))

		stroke(255)
		textSize(32)

		p.always_draw()
		p.update()

		// updating items
		Object.keys(items).forEach(o => {
			if (items[o].length > 0)
				items[o].forEach(e => {
					e.update(p)
				})
		})
	}
}

function generate_labyrinth() {

	current.gen_visited = true

	let next = current.check_neighbors()
	if (next) {
		next.gen_visited = true
		stack.push(current)
		remove_walls(current, next)
		current = next

	} else if (stack.length > 0) {
		current = stack.pop()
	}

	if (stack.length > 0) {
		generate_labyrinth()
	} else {
		labyrinth_polysh()
	}
}

function labyrinth_polysh() {
	for (let i = 0; i < tiles_count; i++) {
		lab[i][0].walls[0] = true
		lab[tiles_count - 1][i].walls[1] = true
		lab[i][tiles_count - 1].walls[2] = true
		lab[0][i].walls[3] = true
	}
}

function remove_walls(a, b) {
	let x = a.x - b.x
	if (x == 1) {
		a.walls[3] = false
		b.walls[1] = false
	} else if (x == -1) {
		a.walls[1] = false
		b.walls[3] = false
	}

	let y = a.y - b.y
	if (y == 1) {
		a.walls[0] = false
		b.walls[2] = false
	} else if (y == -1) {
		a.walls[2] = false
		b.walls[0] = false
	}
}

const useBtn = a => p.move(a)

function keyPressed() {
	if (screen == 'game') {
		switch (keyCode) {
			case LEFT_ARROW:
				p.move('left')
				break

			case RIGHT_ARROW:
				p.move('right')
				break

			case UP_ARROW:
				p.move('top')
				break

			case DOWN_ARROW:
				p.move('bottom')
				break
		}
	}
}


