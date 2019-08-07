/*!
 * Copyright (C) 2018-2019 Silas B. Domingos
 * This source code is licensed under the MIT License as described in the file LICENSE.
 */
import * as Routing from '@singleware/routing';
import * as Observable from '@singleware/observable';

import { Request } from './request';

/**
 * Type declaration for callable members.
 */
export type Callable<T = any> = (...parameters: any[]) => T;

/**
 * Type declaration for class constructors.
 */
export type Constructor<T extends Object = any> = new (...parameters: any[]) => T;

/**
 * Type declaration for class decorators.
 */
export type ClassDecorator = <T extends Object>(type: Constructor<T>) => any;

/**
 * Type declaration for member decorators.
 */
export type MemberDecorator = <T>(target: Object, property: string | symbol, descriptor: TypedPropertyDescriptor<T>) => any;

/**
 * Type declaration for route variables.
 */
export type Variables = Routing.Variables;

/**
 * Type declaration for route constraint.
 */
export type Constraint = Routing.Constraint;

/**
 * Type declaration for observer.
 */
export type Observer = Observable.Observer<void>;

/**
 * Type declaration for request observer.
 */
export type RequestObserver<I, O> = Observable.Observer<Request<I, O>>;

/**
 * Type declaration for request subject.
 */
export type RequestSubject<I, O> = Observable.Subject<Request<I, O>>;

/**
 * Application request observer.
 */
export const RequestSubject = Observable.Subject;

/**
 * Type declaration for routers.
 */
export type Router<I, O> = Routing.Router<Request<I, O>>;

/**
 * Application router.
 */
export const Router = Routing.Router;

/**
 * Type declaration for route match.
 */
export type Match<I, O> = Routing.Match<Request<I, O>>;

/**
 * Application router.
 */
export const Match = Routing.Match;
