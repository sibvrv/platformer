import {ActorInterface} from '../types';
import Level from '../levels/Level';

/**
 * Set the scale of 1 grid unit
 * @type {number}
 */
let scale = 64;

/**
 * Helper function that creates an element and gives it a class
 * @param {string} name
 * @param {string} className
 * @returns {HTMLElement}
 */
function elt(name: string, className?: string) {
  let elt = document.createElement(name);
  if (className) elt.className = className;
  return elt;
}

/**
 * DOMDisplay uses the DOM to draw the program out
 */
export class DOMDisplay {
  wrap: HTMLElement;
  level: Level;
  actorLayer: HTMLElement;

  /**
   * DOMDisplay constructor
   * @param {HTMLElement} parent
   * @param {Level} level
   */
  constructor(parent: HTMLElement, level: Level) {
    this.wrap = parent.appendChild(elt('div', 'game'));
    this.level = level;

    // Background is drawn only once
    this.wrap.appendChild(this.drawBackground());
    // The actorLayer is animated in the drawFrame() method
    this.actorLayer = null;
    this.drawFrame();
  }

  /**
   * Draw the background
   * @returns {HTMLElement}
   */
  drawBackground() {
    let table = elt('table', 'background');
    table.style.width = this.level.width * scale + 'px';
    this.level.grid.forEach(function (row: any) {
      let rowElt = table.appendChild(elt('tr'));
      rowElt.style.height = scale + 'px';
      row.forEach(function (type: string) {
        rowElt.appendChild(elt('td', type));
      });
    });
    return table;
  }

  /**
   * Draw the actors
   * @returns {HTMLElement}
   */
  drawActors() {
    let wrap = elt('div');
    this.level.actors.forEach(function (actor: ActorInterface) {
      let rect = wrap.appendChild(elt('div', 'actor ' + actor.type));
      rect.style.width = actor.size.x * scale + 'px';
      rect.style.height = actor.size.y * scale + 'px';
      rect.style.left = actor.pos.x * scale + 'px';
      rect.style.top = actor.pos.y * scale + 'px';
    });
    return wrap;
  }

  /**
   * Redraw the actors
   */
  drawFrame() {
    if (this.actorLayer)
      this.wrap.removeChild(this.actorLayer);
    this.actorLayer = this.wrap.appendChild(this.drawActors());
    // The status class is used to style the player based on
    // the state of the game (won or lost)
    this.wrap.className = 'game ' + (this.level.status || '');
    this.scrollPlayerIntoView();
  }

  /**
   * Make sure the player's always on screen
   */
  scrollPlayerIntoView() {
    let width = this.wrap.clientWidth;
    let height = this.wrap.clientHeight;
    let margin = width / 3;

    // The viewport
    let left = this.wrap.scrollLeft,
      right = left + width;
    let top = this.wrap.scrollTop,
      bottom = top + height;

    // center makes use of the Vec2 methods defined earlier
    let player = this.level.player;
    let center = player.pos.plus(player.size.times(0.5))
      .times(scale);

    if (center.x < left + margin)
      this.wrap.scrollLeft = center.x - margin;
    else if (center.x > right - margin)
      this.wrap.scrollLeft = center.x + margin - width;
    if (center.y < top + margin)
      this.wrap.scrollTop = center.y - margin;
    else if (center.y > bottom - margin)
      this.wrap.scrollTop = center.y + margin - height;
  }

  /**
   * Clear the level
   */
  clear() {
    this.wrap.parentNode.removeChild(this.wrap);
  }
}
