class Trap extends Entity {
	constructor(x, y, points) {
		super(x, y, 'trap')
		this.points = points
		this.text_color = '#e31212'
	}

	trigger_effect(player) {
		player.score += this.points
		// previous player text color
		let prev_p_text_col = player.text_color
		player.text_color = this.text_color
		setTimeout(() => player.text_color = prev_p_text_col, 500)
		this.message('Great! You stepped in trap!', this.text_color)
	}

}