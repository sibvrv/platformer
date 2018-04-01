import {Vec2} from '../core/math';
import Level from '../levels/Level';
import {ActorInterface} from '../types';

/**
 * Lava Actor
 * @class Lava
 * @implements ActorInterface
 */
export class Lava implements ActorInterface {
  type = 'lava';
  pos: Vec2;
  size: Vec2;
  speed: Vec2;
  repeatPos: Vec2;

  /**
   * Lava Constructor
   * @param {Vec2} pos
   * @param {string} ch
   */
  constructor(pos: Vec2, ch: string) {
    this.pos = pos;
    this.size = new Vec2(1, 1);
    if (ch === '=') {
      // I'm guessing that speed will be added to this.pos
      // in a moving method added later
      this.speed = new Vec2(2, 0);
    } else if (ch === '|') {
      this.speed = new Vec2(0, 2);
    } else if (ch === 'v') {
      this.speed = new Vec2(0, 3);
      this.repeatPos = pos;
    }
  }

  /**
   * Lava Action
   * @param {number} step
   * @param {Level} level
   */
  act(step: number, level: Level) {
    let newPos = this.pos.plus(this.speed.times(step));
    if (!level.obstacleAt(newPos, this.size))
      this.pos = newPos;
    else if (this.repeatPos)
      this.pos = this.repeatPos;
    else
      this.speed = this.speed.times(-1);
  }
}
