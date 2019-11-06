class Trap extends Entity {
	constructor(x, y, points) {
		super(x, y, 'trap')
		this.points = points
	}

	trigger_effect(player) {
		player.score += this.points
		this.message('Great! You stepped in trap!')
	}

}