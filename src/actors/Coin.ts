import {Vec2} from '../core/math';
import {ActorInterface} from '../types';

const wobbleSpeed: number = 8;
const wobbleDist: number = 0.07;

/**
 * Coin Actor
 * @class Coin
 * @implements ActorInterface
 */
export class Coin implements ActorInterface {
  type = 'coin';
  pos: Vec2;
  basePos: Vec2;
  size: Vec2;
  wobble: number;

  /**
   * Coin Constructor
   * @param {Vec2} pos
   */
  constructor(pos: Vec2) {
    this.basePos = this.pos = pos.plus(new Vec2(0.2, 0.1));
    this.size = new Vec2(0.6, 0.6);
    this.wobble = Math.random() * Math.PI * 2;
  }

  /**
   * Coin Action
   * @param {number} step
   */
  act(step: number) {
    this.wobble += step * wobbleSpeed;
    let wobblePos = Math.sin(this.wobble) * wobbleDist;
    this.pos = this.basePos.plus(new Vec2(0, wobblePos));
  }
}