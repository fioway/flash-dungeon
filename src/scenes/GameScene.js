import Phaser from 'phaser';
import { track } from '../analytics/track.js';

// Placeholder scene: a square you can move with arrow keys / WASD or by
// touching/clicking where you want it to go. Replace with real gameplay.
export class GameScene extends Phaser.Scene {
  constructor() {
    super('GameScene');
  }

  create() {
    this.add
      .text(8, 8, 'It works. Move with arrows/WASD or tap.', {
        fontFamily: 'monospace',
        fontSize: '10px',
        color: '#cfd6e6',
      })
      .setDepth(10);

    // Stand-in for a sprite. Swap for this.physics.add.sprite('player') later.
    this.player = this.add.rectangle(240, 135, 16, 16, 0x6cc4ff);
    this.physics.add.existing(this.player);
    this.player.body.setCollideWorldBounds(true);

    this.cursors = this.input.keyboard.createCursorKeys();
    this.wasd = this.input.keyboard.addKeys('W,A,S,D');
    this.target = null;

    // Pointer / touch: move toward where the player taps.
    this.input.on('pointerdown', (pointer) => {
      this.target = new Phaser.Math.Vector2(pointer.worldX, pointer.worldY);
    });

    track('level_start', { level: 1 });
  }

  update() {
    const speed = 90;
    const body = this.player.body;
    body.setVelocity(0);

    const left = this.cursors.left.isDown || this.wasd.A.isDown;
    const right = this.cursors.right.isDown || this.wasd.D.isDown;
    const up = this.cursors.up.isDown || this.wasd.W.isDown;
    const down = this.cursors.down.isDown || this.wasd.S.isDown;

    if (left || right || up || down) {
      this.target = null; // keyboard overrides touch target
      body.setVelocity((right - left) * speed, (down - up) * speed);
    } else if (this.target) {
      const dist = Phaser.Math.Distance.Between(
        this.player.x,
        this.player.y,
        this.target.x,
        this.target.y,
      );
      if (dist < 3) {
        this.target = null;
      } else {
        this.physics.moveTo(this.player, this.target.x, this.target.y, speed);
      }
    }

    body.velocity.limit(speed);
  }
}
