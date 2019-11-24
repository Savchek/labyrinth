class Treasure extends Entity {
	constructor(x, y) {
		super(x, y, `treasure${rand(1, 3)}`)
		this.text_color = '#d6be1e'
	}

	trigger_effect(player) {
		let phrases = ['Сокровище найдено', 'Опа чирик', 'В это я себе возьму']
		player.treasure = 'real'
		// slow player
		player.as = 0.1
		player.set_icon('playercarrying')
		this.message(phrases[rand(0, 2)], this.text_color)
	}

}