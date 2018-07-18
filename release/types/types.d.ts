/**
 * Copyright (C) 2018 Silas B. Domingos
 * This source code is licensed under the MIT License as described in the file LICENSE.
 */
import * as Routing from '@singleware/routing';

import { Request } from './request';

/**
 * Type declaration for callable members.
 */
export type Callable<T = any> = (...parameters: any[]) => T;

/**
 * Type declaration for class handler constructors.
 */
export type ClassConstructor<T> = new (...parameters: any[]) => T;

/**
 * Type declaration for class decorators.
 */
export type ClassDecorator = <T extends Object>(type: ClassConstructor<T>) => any;

/**
 * Type declaration for member decorators.
 */
export type MemberDecorator = (prototype: any, property: PropertyKey, descriptor?: PropertyDescriptor) => any;

/**
 * Type declaration for route match.
 */
export type Match<I, O> = Routing.Match<Request<I, O>>;
