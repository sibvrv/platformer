import {Vec2} from './core/math';
import Level from './levels/Level';

export interface ActorInterface {
  type: string;
  pos: Vec2;
  size: Vec2;
  act: (step: number, level: Level, keys: any) => void;
}