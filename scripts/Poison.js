class Poison extends Entity {
	constructor(x, y, multiplier) {
		super(x, y, multiplier == 0 ? 'cure' : 'poison')
		// multiplier 0 means antidote
		this.m = multiplier
	}

	trigger_effect(player) {
		// if "m" is 0 - that's antidote

		let message = 'You\'ve been '
		message += this.m > 0 ? ('poisoned.' + (player.score_multiplier > 1 ? ' Again...' : '')) : 'cured.'

		// if player.score_multiplier exists
		player.score_multiplier = this.m > 0 ? player.score_multiplier + this.m : 1
		// showing message
		this.message(message)
	}
}