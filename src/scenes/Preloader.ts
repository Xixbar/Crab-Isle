import Phaser from 'phaser'

export default class Preloader extends Phaser.Scene
{
	constructor()
	{
		super('preloader')
	}

	preload()
	{
		this.load.tilemapTiledJSON('isla', 'tiles/mapaIsla.json')

		this.load.atlas('jugador', 'character/jugador.png', 'character/jugador.json')
		this.load.atlas('cangrejo', 'enemies/cangrejo.png', 'enemies/cangrejo.json')

		this.load.image('heart', 'ui/heart.png')
		this.load.image('heart-vacio', 'ui/heart_vacio.png')
		
		this.load.image('knife', 'weapons/knife.png')
		this.load.image('tiles', 'tiles/tilesetIsla.png')
	}

	create()
	{
		this.scene.start('game')
	}
}