class Exit extends Entity {
	constructor(x, y) {
		super(x, y, 'exit')
	}

	update(p) {
		if (this.nearby(p, 0)) {
			this.always_draw()
			if (!p.treasure) {
				p.message('Чтобы выйти нужно найти сокровище!', '#fff')
			} else if (p.treasure == 'real') {
				p.message('Ура!', '#fff')
				setTimeout(() => change_screen('end_screen'), 1000)
			}
		}
	}
}