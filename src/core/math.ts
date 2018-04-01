/**
 * Vector 2D
 */

export class Vec2 {
  /**
   * Vector 2D constructor
   * @param {number} x
   * @param {number} y
   */
  constructor(public x: number, public y: number) {
  }

  /**
   * Add vector
   * @param {Vec2} other
   * @returns {Vec2}
   */
  plus(other: Vec2) {
    return new Vec2(this.x + other.x, this.y + other.y);
  }

  /**
   * Scale vector
   * @param {number} factor
   * @returns {Vec2}
   */
  times(factor: number) {
    return new Vec2(this.x * factor, this.y * factor);
  }
}