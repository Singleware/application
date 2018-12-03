/**
 * Copyright (C) 2018 Silas B. Domingos
 * This source code is licensed under the MIT License as described in the file LICENSE.
 */
import * as Class from '@singleware/class';
import * as Routing from '@singleware/routing';
import * as Injection from '@singleware/injection';

import { ClassDecorator, MemberDecorator, Constructor, Callable } from './types';
import { Settings } from './settings';
import { Service } from './service';
import { Action } from './action';
import { Request } from './request';
import { Route } from './route';
import { Logger } from './logger';

/**
 * Generic main application class.
 */
@Class.Describe()
export class Main<I, O> extends Class.Null {
  /**
   * DI management.
   */
  @Class.Private()
  private dependencies = new Injection.Manager();

  /**
   * Array of services.
   */
  @Class.Private()
  private services = <Service<I, O>[]>[];

  /**
   * Array of loggers.
   */
  @Class.Private()
  private loggers = <Logger<I, O>[]>[];

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
  private started = false;

  /**
   * Receive handler listener.
   */
  @Class.Private()
  private receiveHandlerListener = this.receiveHandler.bind(this);

  /**
   * Send handler listener.
   */
  @Class.Private()
  private sendHandlerListener = this.sendHandler.bind(this);

  /**
   * Error handler listener.
   */
  @Class.Private()
  private errorHandlerListener = this.errorHandler.bind(this);

  /**
   * Receiver handler.
   */
  @Class.Private()
  private async receiveHandler(request: Request<I, O>): Promise<void> {
    this.protectRequest(request);
    this.notifyAllLoggers('receive', request);
    const processor = this.processors.match(request.path, request);
    const environment = request.environment;
    while (processor.length) {
      const filter = this.filters.match(request.path, request);
      request.environment = { ...processor.variables, ...environment };
      request.granted = filter.length === 0;
      await filter.next();
      await processor.next();
    }
    this.notifyAllLoggers('process', request);
  }

  /**
   * Send handler.
   */
  @Class.Private()
  private async sendHandler(request: Request<I, O>): Promise<void> {
    this.notifyAllLoggers('send', request);
  }

  /**
   * Error handler.
   */
  @Class.Private()
  private async errorHandler(request: Request<I, O>): Promise<void> {
    this.notifyAllLoggers('error', request);
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
   * Filter event handler.
   * @param match Matched routes.
   * @param callback Handler callback.
   */
  @Class.Protected()
  protected async filterHandler(match: Routing.Match<Request<I, O>>, callback: Callable): Promise<void> {
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
  protected async processHandler(match: Routing.Match<Request<I, O>>, callback: Callable): Promise<void> {
    if (match.detail.granted) {
      await callback(match);
    }
  }

  /**
   * Get a new route based on the specified action settings.
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
      onMatch: handler.bind(this)
    };
  }

  /**
   * Adds a new route filter.
   * @param route Route settings.
   * @param handler Handler class type.
   * @param parameters Handler parameters.
   */
  @Class.Private()
  private addFilter(route: Route, handler: Constructor, ...parameters: any[]): void {
    this.filters.add(
      this.getRoute(route.action, false, async (match: Routing.Match<Request<I, O>>) => {
        const instance = <any>this.construct(handler, ...parameters);
        await this.filterHandler(match, instance[route.method].bind(instance));
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
  private addProcessor(route: Route, handler: Constructor, ...parameters: any[]): void {
    this.processors.add(
      this.getRoute(route.action, true, async (match: Routing.Match<Request<I, O>>) => {
        const instance = <any>this.construct(handler, ...parameters);
        await this.processHandler(match, instance[route.method].bind(instance));
      })
    );
  }

  /**
   * Notify all registered loggers.
   * @param type Notification type.
   * @param request Request information.
   * @throws Throws an error when the logger state is invalid.
   */
  @Class.Private()
  private notifyAllLoggers(type: string, request: Request<I, O>): void {
    const copy = Object.freeze({ ...request });
    for (const logger of this.loggers) {
      switch (type) {
        case 'receive':
          logger.onReceive(copy);
          break;
        case 'process':
          logger.onProcess(copy);
          break;
        case 'send':
          logger.onSend(copy);
          break;
        case 'error':
          logger.onError(copy);
          break;
        default:
          throw new TypeError(`Invalid notification type '${type}'`);
      }
    }
  }

  /**
   * Default constructor.
   * @param settings Application settings.
   */
  constructor(settings: Settings) {
    super();
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
  public construct<T extends Object>(type: Constructor<T>, ...parameters: any[]): T {
    return this.dependencies.construct(type, ...parameters);
  }

  /**
   * Adds an application handler into this application.
   * @param handler Handler class type.
   * @returns Returns the own instance.
   */
  @Class.Public()
  public addHandler(handler: Class.Constructor, ...parameters: any[]): Main<I, O> {
    if (this.started) {
      throw new Error(`To add new handlers the application must be stopped.`);
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
   * Adds an application service into this application.
   * @param instance Service class type.
   * @returns Returns the service instance.
   */
  @Class.Public()
  public addService<T extends Service<I, O>>(service: Constructor<T>, ...parameters: any[]): T {
    if (this.started) {
      throw new Error(`To add new services the application must be stopped.`);
    }
    const instance = this.construct(service, ...parameters);
    this.services.push(instance);
    return instance;
  }

  /**
   * Adds an application logger into this application.
   * @param logger Logger class type.
   * @returns Returns the logger instance.
   */
  @Class.Public()
  public addLogger<T extends Logger<I, O>>(logger: Constructor<T>, ...parameters: any[]): T {
    if (this.started) {
      throw new Error(`To add new loggers service the application must be stopped.`);
    }
    const instance = this.construct(logger, ...parameters);
    this.loggers.push(instance);
    return instance;
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
      service.onReceive.subscribe(this.receiveHandlerListener);
      service.onSend.subscribe(this.sendHandlerListener);
      service.onError.subscribe(this.errorHandlerListener);
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
      service.stop();
      service.onReceive.unsubscribe(this.receiveHandlerListener);
      service.onSend.unsubscribe(this.sendHandlerListener);
      service.onError.unsubscribe(this.errorHandlerListener);
    }

    this.started = false;
    return this;
  }

  /**
   * Global application routes.
   */
  @Class.Private()
  private static routes: WeakMap<Constructor, Route[]> = new WeakMap();

  /**
   * Adds a new route handler.
   * @param handler Handler type.
   * @param route Route settings.
   */
  @Class.Private()
  private static addRoute(handler: Constructor, route: Route): void {
    let list: Route[];
    if (!(list = <Route[]>this.routes.get(handler))) {
      this.routes.set(handler, (list = []));
    }
    list.push(route);
  }

  /**
   * Decorates the specified member to filter an application request.
   * @param action Filter action settings.
   * @returns Returns the decorator method.
   */
  @Class.Public()
  public static Filter(action: Action): MemberDecorator {
    return (prototype: any, property: PropertyKey, descriptor?: PropertyDescriptor): void => {
      if (!descriptor || !(descriptor.value instanceof Function)) {
        throw new TypeError(`Only methods are allowed for filters.`);
      }
      this.addRoute(prototype.constructor, { type: 'filter', action: action, method: <string>property });
    };
  }

  /**
   * Decorates the specified member to process an application request.
   * @param action Route action settings.
   * @returns Returns the decorator method.
   */
  @Class.Public()
  public static Processor(action: Action): MemberDecorator {
    return (prototype: any, property: PropertyKey, descriptor?: PropertyDescriptor): void => {
      if (!descriptor || !(descriptor.value instanceof Function)) {
        throw new TypeError(`Only methods are allowed for processors.`);
      }
      this.addRoute(prototype.constructor, { type: 'processor', action: action, method: <string>property });
    };
  }
}
