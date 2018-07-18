/**
 * Copyright (C) 2018 Silas B. Domingos
 * This source code is licensed under the MIT License as described in the file LICENSE.
 */
import * as Class from '@singleware/class';
import * as Routing from '@singleware/routing';
import * as Injection from '@singleware/injection';

import { ClassDecorator, MemberDecorator, ClassConstructor, Callable } from './types';
import { Settings } from './settings';
import { Service } from './service';
import { Action } from './action';
import { Request } from './request';
import { Route } from './route';

/**
 * Generic main application class.
 */
@Class.Describe()
export class Main<I, O> {
  /**
   * DI management.
   */
  @Class.Private()
  private dependencies: Injection.Manager = new Injection.Manager();

  /**
   * Array of services.
   */
  @Class.Private()
  private services: Service<I, O>[] = [];

  /**
   * Router for filters.
   */
  @Class.Private()
  private filters: Routing.Router<Request<I, O>>;

  /**
   * Router for processors.
   */
  @Class.Private()
  private processors: Routing.Router<Request<I, O>>;

  /**
   * Determines whether the application is started or not.
   */
  @Class.Private()
  private started: boolean = false;

  /**
   * Receiver handler.
   */
  @Class.Private()
  private receiveHandler = Class.bindCallback(async (request: Request<I, O>) => {
    this.protectRequest(request);
    const processor = this.processors.match(request.path, request);
    const environment = request.environment;
    do {
      const filter = this.filters.match(request.path, request);
      request.environment = { ...processor.variables, ...environment };
      request.granted = filter.length === 0;
      await filter.next();
      await processor.next();
    } while (processor.length);
  });

  /**
   * Send handler.
   */
  @Class.Private()
  private sendHandler = Class.bindCallback(async (request: Request<I, O>) => {});

  /**
   * Filter event handler.
   * @param match Matched routes.
   * @param callback Handler callback.
   */
  @Class.Protected()
  protected async filter(match: Routing.Match<Request<I, O>>, callback: Callable): Promise<void> {
    if ((match.detail.granted = await callback(match)) !== false) {
      await match.next();
    }
  }

  /**
   * Process event handler.
   * @param match Matched routes.
   * @param callback Handler callback.
   */
  @Class.Protected()
  protected async process(match: Routing.Match<Request<I, O>>, callback: Callable): Promise<void> {
    if (match.detail.granted) {
      await callback(match);
    }
  }

  /**
   * Protect all necessary properties of the specified request.
   * @param request Request information.
   */
  @Class.Private()
  private protectRequest(request: Request<I, O>): void {
    Object.defineProperties(request, {
      path: { value: request.path, writable: false, configurable: false },
      input: { value: request.input, writable: false, configurable: false },
      output: { value: request.output, writable: false, configurable: false }
    });
  }

  /**
   * Get a new route settings based on the specified action settings.
   * @param action Action settings.
   * @param exact Determines whether the default exact parameter must be true or not.
   * @param handler Callback to handle the route.
   */
  @Class.Private()
  private getRoute(action: Action, exact: boolean, handler: Callable): Routing.Route<Request<I, O>> {
    return {
      path: action.path,
      exact: action.exact === void 0 ? exact : action.exact,
      constraint: action.constraint,
      environment: action.environment,
      onMatch: Class.bindCallback(handler)
    };
  }

  /**
   * Adds a new route filter.
   * @param route Route settings.
   * @param handler Handler class type.
   * @param parameters Handler parameters.
   */
  @Class.Private()
  private addFilter(route: Route, handler: ClassConstructor<any>, ...parameters: any[]): void {
    this.filters.add(
      this.getRoute(route.action, false, async (match: Routing.Match<Request<I, O>>) => {
        const instance = <any>this.construct(handler, ...parameters);
        await this.filter(match, instance[route.method].bind(instance));
      })
    );
  }

  /**
   * Adds a new route processor.
   * @param route Route settings.
   * @param handler Handler class type.
   * @param parameters Handler parameters.
   */
  @Class.Private()
  private addProcessor(route: Route, handler: ClassConstructor<any>, ...parameters: any[]): void {
    this.processors.add(
      this.getRoute(route.action, true, async (match: Routing.Match<Request<I, O>>) => {
        const instance = <any>this.construct(handler, ...parameters);
        await this.process(match, instance[route.method].bind(instance));
      })
    );
  }

  /**
   * Default constructor.
   * @param settings Application settings.
   */
  constructor(settings: Settings) {
    const options = {
      separator: settings.separator,
      variable: settings.variable
    };
    this.filters = new Routing.Router(options);
    this.processors = new Routing.Router(options);
  }

  /**
   * Decorates the specified class to be an application dependency.
   * @param settings Dependency settings.
   * @returns Returns the decorator method.
   */
  @Class.Public()
  public Dependency(settings: Injection.Settings): ClassDecorator {
    return this.dependencies.Describe(settings);
  }

  /**
   * Decorates the specified class to be injected by the specified application dependencies.
   * @param list List of dependencies.
   * @returns Returns the decorator method.
   */
  @Class.Public()
  public Inject(...list: Injection.Dependency<any>[]): ClassDecorator {
    return this.dependencies.Inject(...list);
  }

  /**
   * Constructs a new instance of the specified class type.
   * @param type Class type.
   * @param parameters Initial parameters.
   * @returns Returns a new instance of the specified class type.
   */
  @Class.Public()
  public construct<T extends Object>(type: ClassConstructor<T>, ...parameters: any[]): T {
    return this.dependencies.construct(type, ...parameters);
  }

  /**
   * Adds an application handler.
   * @param handler Handler class type.
   * @returns Returns the own instance.
   */
  @Class.Public()
  public addHandler(handler: ClassConstructor<any>, ...parameters: any[]): Main<I, O> {
    if (this.started) {
      throw new Error(`To add a new handler the application must be stopped.`);
    }
    const routes = <Route[]>Main.routes.get(handler.prototype.constructor) || [];
    for (const route of routes) {
      switch (route.type) {
        case 'filter':
          this.addFilter(route, handler, ...parameters);
          break;
        case 'processor':
          this.addProcessor(route, handler, ...parameters);
          break;
      }
    }
    return this;
  }

  /**
   * Adds an application service.
   * @param instance Service class type.
   * @returns Returns the own instance.
   */
  @Class.Public()
  public addService<T extends Service<I, O>>(service: ClassConstructor<T>, ...parameters: any[]): Main<I, O> {
    if (this.started) {
      throw new Error(`To add a new service the application must be stopped.`);
    }
    this.services.push(this.construct(service, ...parameters));
    return this;
  }

  /**
   * Starts the application with all included services.
   * @returns Returns the own instance.
   */
  @Class.Public()
  public start(): Main<I, O> {
    if (this.started) {
      throw new Error(`Application is already initialized.`);
    }
    for (const service of this.services) {
      service.onReceive.subscribe(this.receiveHandler);
      service.onSend.subscribe(this.sendHandler);
      service.start();
    }
    this.started = true;
    return this;
  }

  /**
   * Stops the application and all included services.
   * @returns Returns the own instance.
   */
  @Class.Public()
  public stop(): Main<I, O> {
    if (!this.started) {
      throw new Error(`Application is not initialized.`);
    }
    for (const service of this.services) {
      service.onReceive.unsubscribe(this.receiveHandler);
      service.onSend.unsubscribe(this.sendHandler);
      service.stop();
    }
    this.started = false;
    return this;
  }

  /**
   * Global application routes.
   */
  @Class.Private()
  private static routes = new WeakMap<ClassConstructor<any>, Route[]>();

  /**
   * Adds a new route settings.
   * @param handler Handler type.
   * @param route Route settings.
   */
  @Class.Private()
  private static addRoute(handler: ClassConstructor<any>, route: Route) {
    let routes: Route[];
    if (!(routes = <Route[]>Main.routes.get(handler))) {
      Main.routes.set(handler, (routes = []));
    }
    routes.push(route);
  }

  /**
   * Decorates the specified member to filter an application request.
   * @param action Filter action settings.
   * @returns Returns the decorator method.
   */
  @Class.Public()
  public static Filter(action: Action): MemberDecorator {
    return Class.bindCallback(
      (prototype: any, property: PropertyKey, descriptor?: PropertyDescriptor): void => {
        if (!descriptor || !(descriptor.value instanceof Function)) {
          throw new TypeError(`Only methods are allowed for filters.`);
        }
        Main.addRoute(prototype.constructor, { type: 'filter', action: action, method: property });
      }
    );
  }

  /**
   * Decorates the specified member to process an application request.
   * @param action Route action settings.
   * @returns Returns the decorator method.
   */
  @Class.Public()
  public static Processor(action: Action): MemberDecorator {
    return Class.bindCallback(
      (prototype: any, property: PropertyKey, descriptor?: PropertyDescriptor): void => {
        if (!descriptor || !(descriptor.value instanceof Function)) {
          throw new TypeError(`Only methods are allowed for processors.`);
        }
        Main.addRoute(prototype.constructor, { type: 'processor', action: action, method: property });
      }
    );
  }
}
