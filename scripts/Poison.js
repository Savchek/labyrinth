class Poison extends Entity {
	constructor(x, y, multiplier) {
		super(x, y, multiplier < 0 ? 'poison' : 'poison')
		// multiplier 0 means antidote
		this.m = multiplier
		this.fading = false
		this.fade_increment = -10
		this.fade_value = 255
		this.deleted = false
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

	fade_out() {
		if (frameCount - this.fade_start > 60) {
			this.deleted = true
		}

		push()
		tint(255, this.fade_value);
		this.fade_value += this.fade_increment
		this.always_draw()
		pop()
	}

	update(player) {
		if (!player || this.deleted) {
			return 0
		}

		if (this.fading) this.fade_out()


		if (this.nearby(player, 0) && !this.fading) {
			this.fading = true
			this.trigger_effect(player)
		}
	}
}