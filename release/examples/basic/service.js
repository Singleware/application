"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
/*
 * Copyright (C) 2018 Silas B. Domingos
 * This source code is licensed under the MIT License as described in the file LICENSE.
 */
const Class = require("@singleware/class");
const Observable = require("@singleware/observable");
/**
 * Service class.
 */
let Service = class Service extends Class.Null {
    /**
     * Service class.
     */
    constructor() {
        super(...arguments);
        /**
         * Receive subject instance.
         */
        this.receiveSubject = new Observable.Subject();
        /**
         * Send subject instance.
         */
        this.sendSubject = new Observable.Subject();
        /**
         * Error subject instance.
         */
        this.errorSubject = new Observable.Subject();
    }
    /**
     * Receive events in this service.
     */
    get onReceive() {
        return this.receiveSubject;
    }
    /**
     * Send events in this service.
     */
    get onSend() {
        return this.sendSubject;
    }
    /**
     * Error events in this service.
     */
    get onError() {
        return this.errorSubject;
    }
    /**
     * Starts the application service.
     */
    start() {
        const path = `/${process.argv[2] || ''}`;
        this.receiveSubject.notifyAll({
            path: path,
            input: {
                url: `https://application.singleware.com${path}`
            },
            output: {
                data: ''
            },
            environment: {
                variable: 'Example'
            },
            granted: true
        });
    }
    /**
     * Stops the application service.
     */
    stop() { }
};
__decorate([
    Class.Private()
], Service.prototype, "receiveSubject", void 0);
__decorate([
    Class.Private()
], Service.prototype, "sendSubject", void 0);
__decorate([
    Class.Private()
], Service.prototype, "errorSubject", void 0);
__decorate([
    Class.Public()
], Service.prototype, "onReceive", null);
__decorate([
    Class.Public()
], Service.prototype, "onSend", null);
__decorate([
    Class.Public()
], Service.prototype, "onError", null);
__decorate([
    Class.Public()
], Service.prototype, "start", null);
__decorate([
    Class.Public()
], Service.prototype, "stop", null);
Service = __decorate([
    Class.Describe()
], Service);
exports.Service = Service;
