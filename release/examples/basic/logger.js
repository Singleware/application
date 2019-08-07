"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
/*!
 * Copyright (C) 2018 Silas B. Domingos
 * This source code is licensed under the MIT License as described in the file LICENSE.
 */
const Class = require("@singleware/class");
/**
 * Logger class.
 */
let Logger = class Logger extends Class.Null {
    /**
     * Prints the specified event information.
     * @param type Event type.
     * @param request Request information.
     */
    printEvent(type, request) {
        console.log(`${type}\t`, `Grated: ${request.granted}\t`, `Path: '${request.path}'\t`, `Name: '${request.environment.local.name}'`);
    }
    /**
     * Receive handler.
     * @param request Request information.
     */
    onReceive(request) {
        this.printEvent('Receive', request);
    }
    /**
     * Process handler.
     * @param request Request information.
     */
    onProcess(request) {
        this.printEvent('Process', request);
    }
    /**
     * Send handler.
     * @param request Request information.
     */
    onSend(request) {
        this.printEvent('Send', request);
    }
    /**
     * Error handler.
     * @param request Request information.
     */
    onError(request) {
        this.printEvent('Error', request);
        if (request.error) {
            console.log(`\t Detail: "${request.error.message}"`);
        }
    }
    /**
     * Start handler.
     */
    onStart() {
        console.log('Start');
    }
    /**
     * Stop handler.
     */
    onStop() {
        console.log('Stop');
    }
};
__decorate([
    Class.Private()
], Logger.prototype, "printEvent", null);
__decorate([
    Class.Public()
], Logger.prototype, "onReceive", null);
__decorate([
    Class.Public()
], Logger.prototype, "onProcess", null);
__decorate([
    Class.Public()
], Logger.prototype, "onSend", null);
__decorate([
    Class.Public()
], Logger.prototype, "onError", null);
__decorate([
    Class.Public()
], Logger.prototype, "onStart", null);
__decorate([
    Class.Public()
], Logger.prototype, "onStop", null);
Logger = __decorate([
    Class.Describe()
], Logger);
exports.Logger = Logger;
//# sourceMappingURL=logger.js.map