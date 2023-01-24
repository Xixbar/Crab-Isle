import Phaser from 'phaser'

const crearAnimacionJugador = (anims: Phaser.Animations.AnimationManager) => {
	anims.create({
		key: 'jugador-detenido-adelante',
		frames: [{key: 'jugador', frame: 'moviendose-adelante-1.png'}]
	})

	anims.create({
		key: 'jugador-detenido-atras',
		frames: [{key: 'jugador', frame: 'moviendose-atras-1.png'}]
	})

	anims.create({
		key: 'jugador-detenido-izquierda',
		frames: [{key: 'jugador', frame: 'moviendose-izquierda-2.png'}]
	})
	
	anims.create({
		key: 'jugador-detenido-derecha',
		frames: [{key: 'jugador', frame: 'moviendose-derecha-2.png'}]
	})
	
	anims.create({
		key: 'jugador-moviendose-adelante',
		frames: anims.generateFrameNames('jugador', {start: 1, end: 8, prefix: 'moviendose-adelante-', suffix: '.png'}),
		repeat: -1,
		frameRate: 12
	})

	anims.create({
		key: 'jugador-moviendose-atras',
		frames: anims.generateFrameNames('jugador', {start: 1, end: 8, prefix: 'moviendose-atras-', suffix: '.png'}),
		repeat: -1,
		frameRate: 12
	})

	anims.create({
		key: 'jugador-moviendose-izquierda',
		frames: anims.generateFrameNames('jugador', {start: 1, end: 8, prefix: 'moviendose-izquierda-', suffix: '.png'}),
		repeat: -1,
		frameRate: 12
	})

	anims.create({
		key: 'jugador-moviendose-derecha',
		frames: anims.generateFrameNames('jugador', {start: 1, end: 8, prefix: 'moviendose-derecha-', suffix: '.png'}),
		repeat: -1,
		frameRate: 12
	})
}

export {
	crearAnimacionJugador
}