class Poison extends Entity {
	constructor(x, y, multiplier) {
		super(x, y, multiplier < 0 ? 'poison' : 'cure')
		// multiplier 0 means antidote
		this.m = multiplier
	}

	update(player) {
		if (!player) {
			console.error('No player passed!')
			return 0
		}
		// if player is nearby and can see item - display it
		if (this.nearby(player, 1)) {
			this.always_draw()
		}

		// if player interacts with poison - apply effect and show message
		if (this.interact(player)) {
			// if "m" is 0 - that's antidote

			// if player.score_multiplier exists
			player.score_multiplier
				// applying effect
				? player.score_multiplier = this.m > 0 ? player.score_multiplier + this.m : 1
				// else
				: console.error('Something wrong with player! (doesn`t have score_multiplier)')

			// showing message
			this.message('You\'ve been ' + this.m > 0
				? 'poisoned.' + player.score_multiplier > 1
					? ' Again...' : ''
				: 'cured.')
		}
	}
}