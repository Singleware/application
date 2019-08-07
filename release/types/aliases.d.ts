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
export declare type Callable<T = any> = (...parameters: any[]) => T;
/**
 * Type declaration for class constructors.
 */
export declare type Constructor<T extends Object = any> = new (...parameters: any[]) => T;
/**
 * Type declaration for class decorators.
 */
export declare type ClassDecorator = <T extends Object>(type: Constructor<T>) => any;
/**
 * Type declaration for member decorators.
 */
export declare type MemberDecorator = <T>(target: Object, property: string | symbol, descriptor: TypedPropertyDescriptor<T>) => any;
/**
 * Type declaration for route variables.
 */
export declare type Variables = Routing.Variables;
/**
 * Type declaration for route constraint.
 */
export declare type Constraint = Routing.Constraint;
/**
 * Type declaration for observer.
 */
export declare type Observer = Observable.Observer<void>;
/**
 * Type declaration for request observer.
 */
export declare type RequestObserver<I, O> = Observable.Observer<Request<I, O>>;
/**
 * Type declaration for request subject.
 */
export declare type RequestSubject<I, O> = Observable.Subject<Request<I, O>>;
/**
 * Application request observer.
 */
export declare const RequestSubject: typeof Observable.Subject;
/**
 * Type declaration for routers.
 */
export declare type Router<I, O> = Routing.Router<Request<I, O>>;
/**
 * Application router.
 */
export declare const Router: typeof Routing.Router;
/**
 * Type declaration for route match.
 */
export declare type Match<I, O> = Routing.Match<Request<I, O>>;
/**
 * Application router.
 */
export declare const Match: typeof Routing.Match;
