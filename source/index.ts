/*!
 * Copyright (C) 2018-2019 Silas B. Domingos
 * This source code is licensed under the MIT License as described in the file LICENSE.
 */
export { Main } from './main';
export { Service } from './service';
export { Settings } from './settings';
export { Logger } from './logger';
export { Action } from './action';
export { Request } from './request';
export { Environment } from './environment';
export { Router, Match, Variables, Constraint, RequestSubject, RequestObserver, Observer } from './aliases';

// Declarations
import { Main } from './main';
import { Action } from './action';
import { MemberDecorator } from './aliases';

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

// Imported aliases.
import * as Types from './types';

/**
 * Types namespace.
 */
export import Types = Types;
