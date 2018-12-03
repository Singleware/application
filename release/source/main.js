"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var Main_1;
"use strict";
/**
 * Copyright (C) 2018 Silas B. Domingos
 * This source code is licensed under the MIT License as described in the file LICENSE.
 */
const Class = require("@singleware/class");
const Routing = require("@singleware/routing");
const Injection = require("@singleware/injection");
/**
 * Generic main application class.
 */
let Main = Main_1 = class Main extends Class.Null {
    /**
     * Default constructor.
     * @param settings Application settings.
     */
    constructor(settings) {
        super();
        /**
         * DI management.
         */
        this.dependencies = new Injection.Manager();
        /**
         * Array of services.
         */
        this.services = [];
        /**
         * Array of loggers.
         */
        this.loggers = [];
        /**
         * Determines whether the application is started or not.
         */
        this.started = false;
        /**
         * Receive handler listener.
         */
        this.receiveHandlerListener = this.receiveHandler.bind(this);
        /**
         * Send handler listener.
         */
        this.sendHandlerListener = this.sendHandler.bind(this);
        /**
         * Error handler listener.
         */
        this.errorHandlerListener = this.errorHandler.bind(this);
        const options = {
            separator: settings.separator,
            variable: settings.variable
        };
        this.filters = new Routing.Router(options);
        this.processors = new Routing.Router(options);
    }
    /**
     * Receiver handler.
     */
    async receiveHandler(request) {
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
    async sendHandler(request) {
        this.notifyAllLoggers('send', request);
    }
    /**
     * Error handler.
     */
    async errorHandler(request) {
        this.notifyAllLoggers('error', request);
    }
    /**
     * Protect all necessary properties of the specified request.
     * @param request Request information.
     */
    protectRequest(request) {
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
    async filterHandler(match, callback) {
        if ((match.detail.granted = await callback(match)) !== false) {
            await match.next();
        }
    }
    /**
     * Process event handler.
     * @param match Matched routes.
     * @param callback Handler callback.
     */
    async processHandler(match, callback) {
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
    getRoute(action, exact, handler) {
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
    addFilter(route, handler, ...parameters) {
        this.filters.add(this.getRoute(route.action, false, async (match) => {
            const instance = this.construct(handler, ...parameters);
            await this.filterHandler(match, instance[route.method].bind(instance));
        }));
    }
    /**
     * Adds a new route processor.
     * @param route Route settings.
     * @param handler Handler class type.
     * @param parameters Handler parameters.
     */
    addProcessor(route, handler, ...parameters) {
        this.processors.add(this.getRoute(route.action, true, async (match) => {
            const instance = this.construct(handler, ...parameters);
            await this.processHandler(match, instance[route.method].bind(instance));
        }));
    }
    /**
     * Notify all registered loggers.
     * @param type Notification type.
     * @param request Request information.
     * @throws Throws an error when the logger state is invalid.
     */
    notifyAllLoggers(type, request) {
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
     * Decorates the specified class to be an application dependency.
     * @param settings Dependency settings.
     * @returns Returns the decorator method.
     */
    Dependency(settings) {
        return this.dependencies.Describe(settings);
    }
    /**
     * Decorates the specified class to be injected by the specified application dependencies.
     * @param list List of dependencies.
     * @returns Returns the decorator method.
     */
    Inject(...list) {
        return this.dependencies.Inject(...list);
    }
    /**
     * Constructs a new instance of the specified class type.
     * @param type Class type.
     * @param parameters Initial parameters.
     * @returns Returns a new instance of the specified class type.
     */
    construct(type, ...parameters) {
        return this.dependencies.construct(type, ...parameters);
    }
    /**
     * Adds an application handler into this application.
     * @param handler Handler class type.
     * @returns Returns the own instance.
     */
    addHandler(handler, ...parameters) {
        if (this.started) {
            throw new Error(`To add new handlers the application must be stopped.`);
        }
        const routes = Main_1.routes.get(handler.prototype.constructor) || [];
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
    addService(service, ...parameters) {
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
    addLogger(logger, ...parameters) {
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
    start() {
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
    stop() {
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
     * Adds a new route handler.
     * @param handler Handler type.
     * @param route Route settings.
     */
    static addRoute(handler, route) {
        let list;
        if (!(list = this.routes.get(handler))) {
            this.routes.set(handler, (list = []));
        }
        list.push(route);
    }
    /**
     * Decorates the specified member to filter an application request.
     * @param action Filter action settings.
     * @returns Returns the decorator method.
     */
    static Filter(action) {
        return (prototype, property, descriptor) => {
            if (!descriptor || !(descriptor.value instanceof Function)) {
                throw new TypeError(`Only methods are allowed for filters.`);
            }
            this.addRoute(prototype.constructor, { type: 'filter', action: action, method: property });
        };
    }
    /**
     * Decorates the specified member to process an application request.
     * @param action Route action settings.
     * @returns Returns the decorator method.
     */
    static Processor(action) {
        return (prototype, property, descriptor) => {
            if (!descriptor || !(descriptor.value instanceof Function)) {
                throw new TypeError(`Only methods are allowed for processors.`);
            }
            this.addRoute(prototype.constructor, { type: 'processor', action: action, method: property });
        };
    }
};
/**
 * Global application routes.
 */
Main.routes = new WeakMap();
__decorate([
    Class.Private()
], Main.prototype, "dependencies", void 0);
__decorate([
    Class.Private()
], Main.prototype, "services", void 0);
__decorate([
    Class.Private()
], Main.prototype, "loggers", void 0);
__decorate([
    Class.Private()
], Main.prototype, "filters", void 0);
__decorate([
    Class.Private()
], Main.prototype, "processors", void 0);
__decorate([
    Class.Private()
], Main.prototype, "started", void 0);
__decorate([
    Class.Private()
], Main.prototype, "receiveHandlerListener", void 0);
__decorate([
    Class.Private()
], Main.prototype, "sendHandlerListener", void 0);
__decorate([
    Class.Private()
], Main.prototype, "errorHandlerListener", void 0);
__decorate([
    Class.Private()
], Main.prototype, "receiveHandler", null);
__decorate([
    Class.Private()
], Main.prototype, "sendHandler", null);
__decorate([
    Class.Private()
], Main.prototype, "errorHandler", null);
__decorate([
    Class.Private()
], Main.prototype, "protectRequest", null);
__decorate([
    Class.Protected()
], Main.prototype, "filterHandler", null);
__decorate([
    Class.Protected()
], Main.prototype, "processHandler", null);
__decorate([
    Class.Private()
], Main.prototype, "getRoute", null);
__decorate([
    Class.Private()
], Main.prototype, "addFilter", null);
__decorate([
    Class.Private()
], Main.prototype, "addProcessor", null);
__decorate([
    Class.Private()
], Main.prototype, "notifyAllLoggers", null);
__decorate([
    Class.Public()
], Main.prototype, "Dependency", null);
__decorate([
    Class.Public()
], Main.prototype, "Inject", null);
__decorate([
    Class.Public()
], Main.prototype, "construct", null);
__decorate([
    Class.Public()
], Main.prototype, "addHandler", null);
__decorate([
    Class.Public()
], Main.prototype, "addService", null);
__decorate([
    Class.Public()
], Main.prototype, "addLogger", null);
__decorate([
    Class.Public()
], Main.prototype, "start", null);
__decorate([
    Class.Public()
], Main.prototype, "stop", null);
__decorate([
    Class.Private()
], Main, "routes", void 0);
__decorate([
    Class.Private()
], Main, "addRoute", null);
__decorate([
    Class.Public()
], Main, "Filter", null);
__decorate([
    Class.Public()
], Main, "Processor", null);
Main = Main_1 = __decorate([
    Class.Describe()
], Main);
exports.Main = Main;
