import Level from '../levels/Level';
import {Vec2} from '../core/math';
import {ActorInterface} from '../types';

const playerXSpeed = 7;
const gravity = 30;
const jumpSpeed = 17;

export class Player implements ActorInterface {
  type = 'player';

  speed: Vec2;
  size: Vec2;
  pos: Vec2;

  /**
   * Player Actor
   * @param {Vec2} pos
   */
  constructor(pos: Vec2) {
    // This properly aligns the bottom of the player
    // to the square below (adjusts for player height)
    this.pos = pos.plus(new Vec2(0, -0.5));
    this.size = new Vec2(0.8, 1.5);
    this.speed = new Vec2(0, 0);
  }

  /**
   * move by X axis
   * @param {number} step
   * @param {Level} level
   * @param keys
   */
  moveX(step: number, level: Level, keys: any) {
    this.speed.x = 0;
    if (keys['left']) this.speed.x -= playerXSpeed;
    if (keys['right']) this.speed.x += playerXSpeed;

    let motion = new Vec2(this.speed.x * step, 0);
    let newPos = this.pos.plus(motion);
    let obstacle = level.obstacleAt(newPos, this.size);
    if (obstacle)
      level.playerTouched(obstacle);
    else
      this.pos = newPos;
  }

  /**
   * move by Y axis
   * @param {number} step
   * @param {Level} level
   * @param keys
   */
  moveY(step: number, level: Level, keys: any) {
    this.speed.y += step * gravity;
    let motion = new Vec2(0, this.speed.y * step);
    let newPos = this.pos.plus(motion);
    let obstacle = level.obstacleAt(newPos, this.size);
    if (obstacle) {
      level.playerTouched(obstacle);
      if (keys['up'] && this.speed.y > 0)
        this.speed.y = -jumpSpeed;
      else
        this.speed.y = 0;
    } else {
      this.pos = newPos;
    }
  }

  /**
   * Player Action
   * @param {number} step
   * @param {Level} level
   * @param keys
   */
  act(step: number, level: Level, keys: any) {
    this.moveX(step, level, keys);
    this.moveY(step, level, keys);

    let otherActor = level.actorAt(this);
    if (otherActor)
      level.playerTouched(otherActor.type, otherActor);

    // Losing animation
    if (level.status === 'lost') {
      this.pos.y += step;
      this.size.y -= step;
    }
  }
}
