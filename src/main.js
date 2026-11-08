import Phaser from 'phaser';
import { GameScene } from './scenes/GameScene.js';
import { track } from './analytics/track.js';

const config = {
  type: Phaser.AUTO,
  parent: 'game',
  backgroundColor: '#1d2230',
  pixelArt: true, // crisp nearest-neighbor scaling for pixel sprites
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: 480,
    height: 270,
  },
  physics: {
    default: 'arcade',
    arcade: { debug: false },
  },
  scene: [GameScene],
};

track('session_start', {
  device: /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent) ? 'mobile' : 'desktop',
});

new Phaser.Game(config);
