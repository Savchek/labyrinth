class Trap extends Entity {
	constructor(x, y, points) {
		super(x, y, 'trap')
		this.points = points
		this.text_color = '#e31212'
	}

	trigger_effect(player) {
		let phrases = ['Попался в ловушку', 'Ловушка!', 'Ай! Больно в ноге!']
		player.score += this.points
		// previous player text color
		let prev_p_text_col = player.text_color
		player.text_color = this.text_color
		setTimeout(() => player.text_color = prev_p_text_col, 500)
		this.message(phrases[rand(0, 2)] + ' +' + this.points, this.text_color)
	}

}