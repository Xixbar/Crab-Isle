import Phaser from 'phaser'
import Preloader from './Preloader'
import { debugDraw } from '../utils/debug'

import { crearAnimacionCangrejo } from '../anims/AnimacionEnemigos'
import { crearAnimacionJugador } from '../anims/AnimacionJugador'

import Cangrejo from '../enemies/Cangrejo'

import '../characters/Jugador'
import Jugador from '../characters/Jugador'

import { sceneEvents } from '../events/EventsCenter'

export default class Game extends Phaser.Scene
{
	private cursors!: Phaser.Types.Input.Keyboard.CursorKeys
	private jugador!: Jugador

	private cangrejos!: Phaser.Physics.Arcade.Group

	private jugadorCangrejoCollider?: Phaser.Physics.Arcade.Collider

	private knives!: Phaser.Physics.Arcade.Group

	constructor()
	{
		super({ key: 'game' })
	}

	preload()
	{
		this.cursors = this.input.keyboard.createCursorKeys()
	}

	create()
	{
		this.scene.run('game-ui')

		crearAnimacionJugador(this.anims)
		crearAnimacionCangrejo(this.anims)

		const map = this.make.tilemap({ key: 'isla'})
		const tileset = map.addTilesetImage('isla', 'tiles', 16, 16)

		map.createLayer('fondo', tileset)
		map.createLayer('decoracion', tileset)
		map.createLayer('sendero', tileset)

		const wallsLayer = map.createLayer('bordes', tileset)
		const treeLayer = map.createLayer('arboles', tileset)

		wallsLayer.setCollisionByProperty({colision: true})
		treeLayer.setCollisionByProperty({colision: true})

		this.knives = this.physics.add.group({
			classType: Phaser.Physics.Arcade.Image,
		})

		this.jugador = this.add.jugador(650, 650, 'jugador')
		this.jugador.setKnives(this.knives)

		this.cameras.main.startFollow(this.jugador, true) //la camara sigue al jugador

		this.cangrejos = this.physics.add.group({
			classType: Cangrejo,
			createCallback: (go) => {
				const cangreGo = go as Cangrejo
				cangreGo.body.onCollide = true
			}
		})

		this.cangrejos.get(700, 700, 'cangrejo')
		this.cangrejos.get(1000, 700, 'cangrejo')
		this.cangrejos.get(700, 1000, 'cangrejo')
		this.cangrejos.get(1200, 1000, 'cangrejo')
		this.cangrejos.get(1400, 1400, 'cangrejo')
		this.cangrejos.get(1600, 700, 'cangrejo')
		this.cangrejos.get(1800, 900, 'cangrejo')

		this.physics.add.collider(this.jugador, wallsLayer)
		this.physics.add.collider(this.jugador, treeLayer)
		this.physics.add.collider(this.cangrejos, wallsLayer)
		this.physics.add.collider(this.cangrejos, treeLayer)

		this.physics.add.collider(this.knives, this.cangrejos, this.handleKnifeCangrejoCollision, undefined, this)

		this.jugadorCangrejoCollider = this.physics.add.collider(this.cangrejos, this.jugador, this.handleJugadorCangrejoCollision, undefined, this)
		
	}

	private handleKnifeCangrejoCollision(obj1: Phaser.GameObjects.GameObject, obj2: Phaser.GameObjects.GameObject)
	{
		this.knives.killAndHide(obj1)
		this.cangrejos.killAndHide(obj2)
	}

	private handleJugadorCangrejoCollision(obj1: Phaser.GameObjects.GameObject, obj2: Phaser.GameObjects.GameObject)
	{
		const cangrejo = obj2 as Cangrejo
		
		const dx = this.jugador.x - cangrejo.x
		const dy = this.jugador.y - cangrejo.y

		const dir = new Phaser.Math.Vector2(dx, dy).normalize().scale(200)

		this.jugador.handleDamage(dir)

		sceneEvents.emit('player-health-changed', this.jugador.health)

		if (this.jugador.health <= 0)
		{
			this.jugadorCangrejoCollider?.destroy()
		}
	}

	update(t: number, dt: number)
	{
		if (this.jugador)
		{
			this.jugador.update(this.cursors)
		}
	}
}