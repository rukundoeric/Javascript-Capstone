import Phaser from 'phaser';
import Player from '../Entities/Player';

class SceneMain extends Phaser.Scene {
  constructor() {
    super({ key: 'SceneMain' });
  }


  preload() {
    this.load.spritesheet('sprPlayer', 'assets/benito.png', {
      frameWidth: 32,
      frameHeight: 32,
    });
    this.load.image('sprLaserPlayer', 'assets/sprLaserPlayer.png');
  }

  create() {
    this.player = new Player(
      this,
      this.game.config.width * 0.5,
      this.game.config.height * 0.5,
      'sprPlayer',
    );

    this.player.setScale(2);

    this.anims.create({
      key: 'left',
      frames: this.anims.generateFrameNumbers('sprPlayer', { start: 12, end: 15 }),
      frameRate: 10,
      repeat: -1,
    });

    this.anims.create({
      key: 'up',
      frames: this.anims.generateFrameNumbers('sprPlayer', { start: 8, end: 11 }),
      frameRate: 10,
      repeat: -1,
    });


    this.keySpace = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    this.playerLasers = this.add.group();
  }

  update() {
    this.player.update();
    const cursors = this.input.keyboard.createCursorKeys();

    if (cursors.up.isDown) {
      this.player.moveUp();
      this.player.anims.play('up', true);
    } else if (cursors.down.isDown) {
      this.player.moveDown();
      this.player.anims.play('up', true);
    }

    if (cursors.left.isDown) {
      this.player.moveLeft();
      this.player.anims.play('left', true);
      this.player.flipX = false;
    } else if (cursors.right.isDown) {
      this.player.moveRight();
      this.player.anims.play('left', true);
      this.player.flipX = true;
    }

    if (this.keySpace.isDown) {
      this.player.setData('isShooting', true);
      this.player.anims.play('up', true);
    } else {
      this.player.setData('timerShootTick', this.player.getData('timerShootDelay') - 1);
      this.player.setData('isShooting', false);
    }

    for (let i = 0; i < this.playerLasers.getChildren().length; i += 1) {
      const laser = this.playerLasers.getChildren()[i];
      laser.update();

      if (laser.x < -laser.displayWidth
        || laser.x > this.game.config.width + laser.displayWidth
        || laser.y < -laser.displayHeight * 4
        || laser.y > this.game.config.height + laser.displayHeight) {
        if (laser) {
          laser.destroy();
        }
      }
    }
  }
}

export default SceneMain;
