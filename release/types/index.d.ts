export { Settings } from './settings';
export { Service } from './service';
export { Logger } from './logger';
export { Action } from './action';
export { Request } from './request';
export { Match, Variables, Constraint, RequestSubject, RequestObserver, Observer } from './types';
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
export declare const Filter: (action: Action) => MemberDecorator;
/**
 * Decorates the specified member to process an application request. (Alias for Main.Processor)
 * @param action Route action settings.
 * @returns Returns the decorator method.
 */
export declare const Processor: (action: Action) => MemberDecorator;
