"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Copyright (C) 2018 Silas B. Domingos
 * This source code is licensed under the MIT License as described in the file LICENSE.
 *
 * The proposal of this example is to show how to use the base application package
 * with all features.
 */
const Class = require("@singleware/class");
const Observable = require("@singleware/observable");
const Application = require("../source");
/**
 * Create an application.
 */
const Website = new Application.Main({
    separator: '/',
    variable: /\{([a-z0-9])\}/
});
/**
 * Dependency class to provide information to the application service.
 */
let DependencyA = class DependencyA {
    /**
     * Dependency class to provide information to the application service.
     */
    constructor() {
        /**
         * Random pages.
         */
        this.pages = ['/', '/home', '/about', '/page', '/page/about'];
    }
    /**
     * Get a random page.
     */
    get page() {
        return this.pages[Math.round(Math.random() * 100) % this.pages.length];
    }
};
__decorate([
    Class.Private()
], DependencyA.prototype, "pages", void 0);
__decorate([
    Class.Public()
], DependencyA.prototype, "page", null);
DependencyA = __decorate([
    Class.Describe(),
    Website.Dependency({ singleton: true, name: 'pages' })
], DependencyA);
/**
 * Dependency class to provide helper methods to the application handler.
 */
let DependencyB = class DependencyB {
    /**
     * Print information about the request.
     * @param name Action name.
     * @param request Request information.
     */
    print(name, match) {
        console.log(name, match.detail, match.variables);
    }
};
__decorate([
    Class.Public()
], DependencyB.prototype, "print", null);
DependencyB = __decorate([
    Class.Describe(),
    Website.Dependency({ singleton: true, name: 'helper' })
], DependencyB);
/**
 * Service class to provide any input request and handle any output response.
 */
let Service = class Service {
    /**
     * Default constructor.
     * @param dependencies Service dependencies.
     * @param parameters Service parameters.
     */
    constructor(dependencies, parameters) {
        /**
         * Events.
         */
        this.events = {
            receive: new Observable.Subject(),
            send: new Observable.Subject()
        };
        this.dependencies = dependencies;
    }
    /**
     * Receive events.
     */
    get onReceive() {
        return this.events.receive;
    }
    /**
     * Send events.
     */
    get onSend() {
        return this.events.send;
    }
    /**
     * Starts the application service.
     */
    start() {
        this.notifier = setInterval(Class.bind(async () => {
            const path = this.dependencies.pages.page;
            await this.events.receive.notifyAll({
                path: path,
                input: { url: `http://test${path}` },
                output: { data: '' },
                environment: {}
            });
        }), 250);
        console.log('STARTED!');
    }
    /**
     * Stops the application service.
     */
    stop() {
        clearInterval(this.notifier);
        console.log('STOPPED!');
    }
};
__decorate([
    Class.Private()
], Service.prototype, "notifier", void 0);
__decorate([
    Class.Private()
], Service.prototype, "dependencies", void 0);
__decorate([
    Class.Private()
], Service.prototype, "events", void 0);
__decorate([
    Class.Public()
], Service.prototype, "onReceive", null);
__decorate([
    Class.Public()
], Service.prototype, "onSend", null);
__decorate([
    Class.Public()
], Service.prototype, "start", null);
__decorate([
    Class.Public()
], Service.prototype, "stop", null);
Service = __decorate([
    Class.Describe(),
    Website.Inject(DependencyA)
], Service);
/**
 * Handler class to handle any input and provide some output.
 */
let Handler = class Handler {
    /**
     * Default constructor.
     * @param dependencies Handler dependencies.
     */
    constructor(dependencies) {
        this.dependencies = dependencies;
    }
    /**
     * Default route filter.
     * (Execute on all routes)
     * @param request Request information.
     */
    async defaultFilter(match) {
        const granted = Math.random() * 1000 > 350;
        this.dependencies.helper.print(`Filter (${granted ? 'ALLOWED' : 'DENIED'})`, match);
        return granted;
    }
    /**
     * Default route processor.
     * (Using more than one route)
     * @param match Match information.
     */
    async defaultProcessor(match) {
        this.dependencies.helper.print('Default', match);
    }
    /**
     * About route processor.
     * (Using exact route)
     * @param match Match information.
     */
    async aboutProcessor(match) {
        this.dependencies.helper.print('About', match);
    }
    /**
     * Page route processor.
     * (Using catch all for /page/*)
     * @param match Match information.
     */
    async pageProcessor(match) {
        this.dependencies.helper.print('Page', match);
    }
};
__decorate([
    Class.Private()
], Handler.prototype, "dependencies", void 0);
__decorate([
    Class.Public(),
    Application.Filter({ path: '/', environment: { name: 'F' } })
], Handler.prototype, "defaultFilter", null);
__decorate([
    Class.Public(),
    Application.Processor({ path: '/', environment: { name: 'R1' } }),
    Application.Processor({ path: '/home', environment: { name: 'R2' } })
], Handler.prototype, "defaultProcessor", null);
__decorate([
    Class.Public(),
    Application.Processor({ path: '/about', environment: { name: 'R3' } })
], Handler.prototype, "aboutProcessor", null);
__decorate([
    Class.Public(),
    Application.Processor({ path: '/page', exact: false, environment: { name: 'R4' } })
], Handler.prototype, "pageProcessor", null);
Handler = __decorate([
    Class.Describe(),
    Website.Inject(DependencyB)
], Handler);
/**
 * Register services and handlers.
 */
Website.addService(Service);
Website.addHandler(Handler);
/**
 * Starts the application.
 */
Website.start();
/**
 * Stops the application after a few seconds.
 */
setTimeout(() => {
    Website.stop();
}, 5000);
