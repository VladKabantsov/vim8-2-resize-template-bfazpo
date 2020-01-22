import { InjectionToken } from '@angular/core';

export interface IConfig {
  medium: number;
  large: number;
}

export const CONFIG = new InjectionToken<IConfig>('CONFIG');