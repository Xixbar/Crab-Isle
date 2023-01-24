import Phaser from 'phaser'

import { sceneEvents } from '../events/EventsCenter'

declare global
{
	namespace Phaser.GameObjects
	{
		interface GameObjectFactory
		{
			jugador(x: number, y: number, texture: string, frame?: string | number): Jugador
		}
	}
}

enum HealthState
{
	IDLE,
	DAMAGE,
	DEAD
}

export default class Jugador extends Phaser.Physics.Arcade.Sprite
{
	private healthState = HealthState.IDLE
	private damageTime = 0

	private _health = 3
	private _coins = 0

	public knives!: Phaser.Physics.Arcade.Group

	get health()
	{
		return this._health
	}

	constructor(scene: Phaser.Scene, x: number, y: number, texture: string, frame?: string | number)
	{
		super(scene, x, y, texture, frame)

		this.anims.play('jugador-moviendose-adelante')
	}

	setKnives(knives: Phaser.Physics.Arcade.Group): void
	{
		this.knives = knives
	}

	handleDamage(dir: Phaser.Math.Vector2)
	{
		if (this._health <= 0)
		{
			return
		}

		if (this.healthState === HealthState.DAMAGE)
		{
			return
		}

		--this._health

		if (this._health <= 0)
		{
			this.healthState = HealthState.DEAD
			this.anims.play('jugador-moviendose-adelante')
			this.anims.stop()
			this.setVelocity(0, 0)
			this.setTint(0xff0000)
		}
		else
		{
			this.setVelocity(dir.x, dir.y)

			this.setTint(0xff0000)

			this.healthState = HealthState.DAMAGE
			this.damageTime = 0
		}
	}

	private throwKnife()
	{
		if (!this.knives)
		{
			return
		}

		const knife = this.knives.get(this.x, this.y, 'knife') as Phaser.Physics.Arcade.Image
		if (!knife)
		{
			return
		}

		const parts = this.anims.currentAnim.key.split('-')
		const direction = parts[2]

		const vec = new Phaser.Math.Vector2(0, 0)

		switch (direction)
		{
			case 'atras':
				vec.y = -1
				break
			case 'adelante':
				vec.y = 1
				break
			case 'derecha':
				vec.x = 1
				break
			case 'izquierda':
				vec.x = -1
				break
		}

		const angle = vec.angle()

		knife.setActive(true)
		knife.setVisible(true)

		knife.setRotation(angle)

		knife.x += vec.x * 16
		knife.y += vec.y * 16

		knife.setVelocity(vec.x * 300, vec.y * 300)
	}


	preUpdate(t: number, dt: number)
	{
		super.preUpdate(t, dt)

		switch (this.healthState)
		{
			case HealthState.IDLE:
				break

			case HealthState.DAMAGE:
				this.damageTime += dt
				if (this.damageTime >= 250)
				{
					this.healthState = HealthState.IDLE
					this.setTint(0xffffff)
					this.damageTime = 0
				}
				break
		}
	}

	update(cursors: Phaser.Types.Input.Keyboard.CursorKeys)
	{
		if (this.healthState === HealthState.DAMAGE
			|| this.healthState === HealthState.DEAD
		)
		{
			return
		}

		if (!cursors)
		{
			return
		}

		if (Phaser.Input.Keyboard.JustDown(cursors.space!))
		{
			this.throwKnife()
			return
		}

		const speed = 100

		const leftDown = cursors.left?.isDown
		const rightDown = cursors.right?.isDown
		const upDown = cursors.up?.isDown
		const downDown = cursors.down?.isDown

		if (leftDown)
		{
			this.anims.play('jugador-moviendose-izquierda', true)
			this.setVelocity(-speed, 0)
		}
		else if (rightDown)
		{
			this.anims.play('jugador-moviendose-derecha', true)
			this.setVelocity(speed, 0)
		}
		else if (upDown)
		{
			this.anims.play('jugador-moviendose-atras', true)
			this.setVelocity(0, -speed)
		}
		else if (downDown)
		{
			this.anims.play('jugador-moviendose-adelante', true)
			this.setVelocity(0, speed)
		}
		else
		{
			const parts = this.anims.currentAnim.key.split('-')
			parts[1] = 'detenido'
			this.anims.play(parts.join('-'))
			this.setVelocity(0, 0)
		}
	}
}

Phaser.GameObjects.GameObjectFactory.register('jugador', function (this: Phaser.GameObjects.GameObjectFactory, x: number, y: number, texture: string, frame?: string | number) {
	var sprite = new Jugador(this.scene, x, y, texture, frame)

	this.displayList.add(sprite)
	this.updateList.add(sprite)

	this.scene.physics.world.enableBody(sprite, Phaser.Physics.Arcade.DYNAMIC_BODY)

	sprite.body.setSize(sprite.width * 0.5, sprite.height * 0.9)
	sprite.setScale(sprite.width * 0.009, sprite.height * 0.009)

	return sprite
})