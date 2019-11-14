class Treasure extends Entity {
	constructor(x, y) {
		super(x, y, `treasure${rand(1, 3)}`)
		this.text_color = '#d6be1e'
	}

	trigger_effect(player) {
		player.treasure = 'real'
		player.as = 0.1
		player.set_icon('playercarrying')
		this.message('You found a treasure', this.text_color)
	}

}