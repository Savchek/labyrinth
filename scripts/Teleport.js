class Teleport extends Entity {
	constructor(x, y, tx, ty) {
		super(x, y, `teleport${rand(1, 3)}`)
		this.text_color = '#1500ff'
		this.tx = tx
		this.ty = ty
	}

	trigger_effect(player) {
		let phrases = ['Телепорт?', 'Где я?', 'Ненавижу порталы!']
		setTimeout(() => {
			player.x = this.tx
			player.y = this.ty
			player.nx = this.tx
			player.ny = this.ty
			visited[this.ty][this.tx] = 1
			player.message(phrases[rand(0, 2)], this.text_color)
		}, 300)
	}

}