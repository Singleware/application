/**
 * Copyright (C) 2018 Silas B. Domingos
 * This source code is licensed under the MIT License as described in the file LICENSE.
 */
import * as Class from '@singleware/class';
import * as Routing from '@singleware/routing';

import { Request } from './request';

/**
 * Type declaration for callable members.
 */
export type Callable<T = any> = Class.Callable<T>;

/**
 * Type declaration for class handler constructors.
 */
export type Constructor<T extends Object = any> = Class.Constructor<T>;

/**
 * Type declaration for class decorators.
 */
export type ClassDecorator = <T extends Object>(type: Constructor<T>) => any;

/**
 * Type declaration for member decorators.
 */
export type MemberDecorator = <T>(target: Object, property: string | symbol, descriptor?: TypedPropertyDescriptor<T>) => any;

/**
 * Type declaration for route match.
 */
export type Match<I, O> = Routing.Match<Request<I, O>>;

/**
 * Type declaration for route variables.
 */
export type Variables = Routing.Variables;
