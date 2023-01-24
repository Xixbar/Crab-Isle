import Phaser from 'phaser'

const crearAnimacionCangrejo = (anims: Phaser.Animations.AnimationManager) => {
	anims.create({
		key: 'cangrejo-detenido',
		frames: anims.generateFrameNames('cangrejo', {start: 1, end: 3, prefix: 'cangrejo-detenido-', suffix: '.png'}),
		repeat: -1,
		frameRate: 6
	})

	anims.create({
		key: 'cangrejo-moviendose',
		frames: anims.generateFrameNames('cangrejo', {start: 1, end: 4, prefix: 'cangrejo-moviendose-', suffix: '.png'}),
		repeat: -1,
		frameRate: 8
	})
}

export {
	crearAnimacionCangrejo
}



