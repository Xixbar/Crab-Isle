import Phaser from 'phaser'

import Preloader from './scenes/Preloader'
import Game from './scenes/Game'
import GameUI from './scenes/GameUI'

export default new Phaser.Game({
	type: Phaser.AUTO,
	width: 854,
	height: 480,
	physics: {
		default: 'arcade',
		arcade: {
			gravity: { y: 0},
			debug: false
		}
	},
	scene: [Preloader, Game, GameUI],
	scale: {
		zoom: 1.5
	}
})