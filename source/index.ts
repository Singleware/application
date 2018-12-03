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

/**
 * Declarations.
 */
import { Action } from './action';
import { MemberDecorator } from './types';

import * as Module from './main';
export import Main = Module.Main;

/**
 * Decorates the specified member to filter an application request. (Alias for Main.Filter)
 * @param action Filter action settings.
 * @returns Returns the decorator method.
 */
export const Filter = (action: Action): MemberDecorator => Main.Filter(action);

/**
 * Decorates the specified member to process an application request. (Alias for Main.Processor)
 * @param action Route action settings.
 * @returns Returns the decorator method.
 */
export const Processor = (action: Action): MemberDecorator => Main.Processor(action);
