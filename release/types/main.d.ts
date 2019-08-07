/*!
 * Copyright (C) 2018-2019 Silas B. Domingos
 * This source code is licensed under the MIT License as described in the file LICENSE.
 */
import * as Class from '@singleware/class';
import * as Injection from '@singleware/injection';
import * as Aliases from './aliases';
import { Settings } from './settings';
import { Service } from './service';
import { Action } from './action';
import { Logger } from './logger';
/**
 * Generic main application class.
 */
export declare class Main<I, O> extends Class.Null {
    /**
     * Global routes.
     */
    private static routes;
    /**
     * Determines whether the application is started or not.
     */
    private started;
    /**
     * Dependency Injection Manager.
     */
    private dim;
    /**
     * Array of services.
     */
    private services;
    /**
     * Array of loggers.
     */
    private loggers;
    /**
     * Router for filters.
     */
    private filters;
    /**
     * Router for processors.
     */
    private processors;
    /**
     * Receive handler listener.
     */
    private receiveHandlerListener;
    /**
     * Send handler listener.
     */
    private sendHandlerListener;
    /**
     * Error handler listener.
     */
    private errorHandlerListener;
    /**
     * Adds a new route handler.
     * @param handler Handler type.
     * @param route Route settings.
     */
    private static addRoute;
    /**
     * Notify all registered loggers about new requests.
     * @param type Notification type.
     * @param request Request information.
     * @throws Throws an error when the notification type is not valid.
     */
    private notifyRequest;
    /**
     * Notify all registered loggers about new actions.
     * @param type Notification type.
     * @param request Request information.
     * @throws Throws an error when the notification type is not valid.
     */
    private notifyAction;
    /**
     * Performs the specified handler method with the given route match and parameters.
     * @param handler Handler class.
     * @param method Handler method name.
     * @param parameters Handler constructor parameters.
     * @param match Route match.
     * @returns Returns the same value returned by the performed handler method.
     */
    private performHandler;
    /**
     * Performs all route filters for the specified request with the given variables.
     * @param request Request information.
     * @param variables Request processor variables.
     * @returns Returns true when the request access is granted or false otherwise.
     */
    private performFilters;
    /**
     * Receiver handler.
     * @param request Request information.
     */
    private receiveHandler;
    /**
     * Send handler.
     * @param request Request information.
     */
    private sendHandler;
    /**
     * Error handler.
     * @param request Request information.
     */
    private errorHandler;
    /**
     * Filter handler to be inherited and extended.
     * @param match Match information.
     * @param allows Determine whether the filter is allowing the request matching or not.
     * @returns Returns true when the filter handler still allows the request matching or false otherwise.
     */
    protected filterHandler(match: Aliases.Match<I, O>, allows: boolean): Promise<boolean>;
    /**
     * Process handler to be inherited and extended.
     * @param match Match information.
     * @param callback Callable member.
     */
    protected processHandler(match: Aliases.Match<I, O>, callback: Aliases.Callable): Promise<void>;
    /**
     * Decorates the specified class to be an application dependency.
     * @param settings Dependency settings.
     * @returns Returns the decorator method.
     */
    protected Dependency(settings: Injection.Settings): Aliases.ClassDecorator;
    /**
     * Decorates the specified class to be injected by the specified application dependencies.
     * @param list List of dependencies.
     * @returns Returns the decorator method.
     */
    protected Inject(...list: Injection.Dependency<any>[]): Aliases.ClassDecorator;
    /**
     * Adds a generic route handler into this application.
     * @param handler Handler class type.
     * @returns Returns the own instance.
     */
    protected addHandler(handler: Aliases.Constructor, ...parameters: any[]): Main<I, O>;
    /**
     * Adds a service handler into this application.
     * @param instance Service class type or instance.
     * @returns Returns the service instance.
     */
    protected addService<T extends Service<I, O>>(service: Aliases.Constructor<T> | T, ...parameters: any[]): T;
    /**
     * Adds a logger handler into this application.
     * @param logger Logger class type or instance.
     * @returns Returns the logger instance.
     */
    protected addLogger<T extends Logger<I, O>>(logger: Aliases.Constructor<T> | T, ...parameters: any[]): T;
    /**
     * Starts the application with all included services.
     * @returns Returns the own instance.
     */
    protected start(): Main<I, O>;
    /**
     * Stops the application and all included services.
     * @returns Returns the own instance.
     */
    protected stop(): Main<I, O>;
    /**
     * Default constructor.
     * @param settings Application settings.
     */
    constructor(settings: Settings);
    /**
     * Decorates the specified member to filter an application request.
     * @param action Filter action settings.
     * @returns Returns the decorator method.
     */
    static Filter(action: Action): Aliases.MemberDecorator;
    /**
     * Decorates the specified member to process an application request.
     * @param action Route action settings.
     * @returns Returns the decorator method.
     */
    static Processor(action: Action): Aliases.MemberDecorator;
}
