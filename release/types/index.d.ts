/**
 * Copyright (C) 2018 Silas B. Domingos
 * This source code is licensed under the MIT License as described in the file LICENSE.
 */
export { Settings } from './settings';
export { Service } from './service';
export { Logger } from './logger';
export { Action } from './action';
export { Request } from './request';
export { Match, Variables } from './types';
import * as MainModule from './main';
export import Main = MainModule.Main;
export declare const Filter: typeof MainModule.Main.Filter;
export declare const Processor: typeof MainModule.Main.Processor;
