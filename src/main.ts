import {GameLevels} from './levels/levelsData';
import Level from './levels/Level';
import {DOMDisplay} from './core/DOMDisplay';

function prepareLevel(level: number[]) {
  const cvtIndex: any = ' @xxxxox!v|='.split('');

  let w = level.shift();
  let h = level.shift();
  let rows = new Array(h);
  for (let y = 0; y < h; y++) {
    let cols = new Array(w);
    for (let x = 0; x < w; x++) {
      cols[x] = cvtIndex[level[y * w + x]];
    }
    rows[y] = cols.join('');
  }
  return rows;
}

const arrowCodes = {
  37: 'left',
  38: 'up',
  39: 'right'
};

/**
 * Tracking keypresses for player movement
 * @param codes
 * @returns {object}
 */
function trackKeys(codes: any) {
  let pressed = Object.create(null);

  function handler(event: KeyboardEvent) {
    if (codes.hasOwnProperty(event.keyCode)) {
      pressed[codes[event.keyCode]] = event.type === 'keydown';
      event.preventDefault();
    }
  }

  addEventListener('keydown', handler);
  addEventListener('keyup', handler);

  pressed.unregister = function () {
    removeEventListener('keydown', handler);
    removeEventListener('keyup', handler);
  };

  return pressed;
}

/**
 * Run the animation
 * @param frameFunc
 */
function runAnimation(frameFunc: any) {
  let lastTime: number = 0;

  function frame(time: number) {
    let stop = false;
    if (lastTime) {
      let timeStep = Math.min(time - lastTime, 100) / 1000;
      stop = frameFunc(timeStep) === false;
    }
    lastTime = time;
    if (!stop)
      requestAnimationFrame(frame);
  }

  requestAnimationFrame(frame);
}

let arrows = trackKeys(arrowCodes);
let timePerRound = 400;
let timeSpan = document.getElementById('time');

/**
 * Run the level
 * @param {Level} level
 * @param Display
 * @param andThen
 */
function runLevel(level: Level, Display: any, andThen: any) {
  let display = new Display(document.body, level);
  // Used for storing pause state of the game
  let running = 'yes';
  level.roundTime = timePerRound;

  function handleKey(event: KeyboardEvent) {
    if (event.keyCode === 27) {
      if (running === 'no') {
        running = 'yes';
        runAnimation(animation);
      } else if (running === 'pausing') {
        running = 'yes';
      } else if (running === 'yes') {
        running = 'pausing';
      }
    }
  }

  addEventListener('keydown', handleKey);

  let prev_t = -1;

  function animation(step: number) {
    if (running === 'pausing') {
      running = 'no';
      return false;
    }
    let t = Math.ceil(level.roundTime);
    if (prev_t !== t) {
      timeSpan.textContent = `${(prev_t = t)}`;
    }

    level.animate(step, arrows);
    display.drawFrame(step);
    if (level.isFinished()) {
      display.clear();

      if (andThen)
        andThen(level.status);
      return false;
    }
  }

  runAnimation(animation);
}

/**
 * Run the game
 * @param plans
 * @param Display
 */
function runGame(plans: any, Display: any) {
  let lives = 3;
  let livesSpan = document.getElementById('lives');
  let gameStatus = document.getElementById('status');

  function startLevel(n: number) {
    // var start_time = performance.now();
    timeSpan.textContent = `${timePerRound}`;
    livesSpan.textContent = `${lives}`;
    runLevel(new Level(plans[n]), Display, function (status: string) {
      if (status === 'lost') {
        lives--;
        if (lives === 0) {
          gameStatus.textContent = 'Game Over';
        } else
          startLevel(n);
      } else if (n < plans.length - 1)
        startLevel(n + 1);
      else {
        gameStatus.textContent = 'You win!';
      }
    });
  }

  startLevel(0);
}

/**
 * Prepare Levels
 */
const GAME_LEVELS = GameLevels.map((item: number[]) => prepareLevel(item));

runGame(GAME_LEVELS, DOMDisplay);