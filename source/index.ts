/**
 * Copyright (C) 2018 Silas B. Domingos
 * This source code is licensed under the MIT License as described in the file LICENSE.
 */
export { Settings } from './settings';
export { Service } from './service';
export { Action } from './action';
export { Request } from './request';
export { Match } from './types';

import * as MainModule from './main';
export const Main = MainModule.Main;

// Aliases
export const Filter = Main.Filter;
export const Processor = Main.Processor;
