import {Vec2} from '../core/math';
import {Lava} from '../actors/Lava';
import {Player} from '../actors/Player';
import {Coin} from '../actors/Coin';
import {ActorInterface} from '../types';

const maxStep: number = 0.05;

/*
  @ = Player start position
  o = Coins
  x = Solid surfaces
  ! = Non-moving lava
  = = Vertical moving lava
  v = Dripping lava
  | = Horizontal moving lava
*/

const actorChars: any = {
  '@': Player,
  'o': Coin,
  '=': Lava,
  '|': Lava,
  'v': Lava
};

export default class Level {
  width: number;
  height: number;

  grid: any;

  actors: any;
  status: any;

  finishDelay: number;
  roundTime: number;

  player: any;

  /**
   * Level constructor
   * @param plan
   */
  constructor(plan: any) {
    this.width = plan[0].length;
    this.height = plan.length;

    // Array of arrays, each position containing null or a character
    this.grid = [];

    // Contains all of the dynamic objects (lava, coin or player),
    // along with their position and state
    this.actors = [];

    this.status = null;
    this.finishDelay = null;
    this.roundTime = 0;

    for (let y = 0; y < this.height; y++) {
      let line = plan[y],
        gridLine = [];
      for (let x = 0; x < this.width; x++) {
        let ch = line[x],
          fieldType = null;
        let Actor = actorChars[ch];
        if (Actor)
        // This constructs the referenced moving object in
        // actorChars and pushes it to the actors array
          this.actors.push(new Actor(new Vec2(x, y), ch));
        else if (ch === 'x')
        // Wall
          fieldType = 'wall';
        else if (ch === '!')
        // Stationary lava
          fieldType = 'lava';
        gridLine.push(fieldType);
      }
      this.grid.push(gridLine);
    }
    // Find the Player actor

    this.player = this.actors.filter((actor: ActorInterface) => actor.type === 'player')[0];
    // Track whether the player has won or lost;
    // finishDelay keeps the level active for a brief period of time
  }

  /**
   * Is game finished
   * @returns {boolean}
   */
  isFinished() {
    let self = this;
    return self.roundTime <= 0 || (self.status !== null && self.finishDelay < 0);
  }

  /**
   * Figure out the collision area of an actor
   * @param {Vec2} pos
   * @param {Vec2} size
   * @returns {any}
   */
  obstacleAt(pos: Vec2, size: Vec2) {
    let xStart = Math.floor(pos.x);
    let xEnd = Math.ceil(pos.x + size.x);
    let yStart = Math.floor(pos.y);
    let yEnd = Math.ceil(pos.y + size.y);

    // The upper and side bounds of the level return a wall
    if (xStart < 0 || xEnd > this.width || yStart < 0)
      return 'wall';
    // The bottom bound returns lava
    if (yEnd > this.height)
      return 'lava';
    // Check what's on the grid around the collision box
    for (let y = yStart; y < yEnd; y++) {
      for (let x = xStart; x < xEnd; x++) {
        let fieldType = this.grid[y][x];
        // returns 'wall' or 'lava'
        if (fieldType) return fieldType;
      }
    }
  }

  /**
   * Track what actors overlap a given actor
   * @param {ActorInterface} actor
   * @returns {any}
   */
  actorAt(actor: ActorInterface) {
    for (let i = 0; i < this.actors.length; i++) {
      let other = this.actors[i];
      if (other !== actor &&
        actor.pos.x + actor.size.x > other.pos.x &&
        actor.pos.x < other.pos.x + other.size.x &&
        actor.pos.y + actor.size.y > other.pos.y &&
        actor.pos.y < other.pos.y + other.size.y)
        return other;
    }
  }

  /**
   * Animate the level
   * step will be given in seconds, keys is an object that
   * contains info about the arrow keys the player has pressed.
   * @param {number} step
   * @param keys
   */
  animate(step: number, keys: any) {
    this.roundTime = Math.max(0, this.roundTime - step);
    if (this.roundTime <= 0) {
      this.status = 'lost';
      this.finishDelay = 1;
    }

    // Used for the delay at the end of a game
    if (this.status != null)
      this.finishDelay -= step;

    while (step > 0) {
      let thisStep = Math.min(step, maxStep);
      this.actors.forEach(function (actor: ActorInterface) {
        actor.act(thisStep, this, keys);
      }, this);
      step -= thisStep;
    }
  }

  /**
   * Handle collisions between actors
   * @param {string} type
   * @param {ActorInterface} actor
   */
  playerTouched(type: string, actor?: ActorInterface) {
    // Lava's been touched
    if (type === 'lava' && this.status === null) {
      this.status = 'lost';
      this.finishDelay = 1;
    } else if (type === 'coin') { // a coin's been touched
      // Remove the coin that's been collected from actors array
      this.actors = this.actors.filter(function (other: ActorInterface) {
        return other !== actor;
      });
      // No more coins = you've won
      if (!this.actors.some(function (actor: ActorInterface) {
          return actor.type === 'coin';
        })) {
        this.status = 'won';
        this.finishDelay = 1;
      }
    }
  }
}