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
const Application = require("../../source");
/**
 * Handler class.
 */
let Handler = class Handler extends Class.Null {
    /**
     * Prints the specified match information.
     * @param type Match type.
     * @param match Match information.
     */
    printMatch(type, match) {
        console.log(`${type}\t`, `Grated: ${match.detail.granted}\t`, `Path: '${match.path}'\t`, `Environment: '${match.detail.environment.name}'`, `Remaining: '${match.remaining}'\t`);
    }
    /**
     * Default route filter. (Execute on all routes)
     * @param request Request information.
     */
    async defaultFilter(match) {
        this.printMatch('Filter', match);
        if (match.detail.environment.auth !== false) {
            return Math.random() >= 0.35;
        }
        return true;
    }
    /**
     * Default route processor. (Using more than one exact route)
     * @param match Match information.
     */
    async defaultProcessor(match) {
        this.printMatch('Home', match);
    }
    /**
     * About route processor. (Using exact route)
     * @param match Match information.
     */
    async aboutProcessor(match) {
        this.printMatch('About', match);
    }
    /**
     * Page route processor. (Using catch all for /page/*)
     * @param match Match information.
     */
    async pageProcessor(match) {
        this.printMatch('Page', match);
    }
    /**
     * Error route processor.
     * @param match Match information.
     */
    async errorProcessor(match) {
        this.printMatch('Error', match);
        throw new Error('Error example.');
    }
};
__decorate([
    Class.Private()
], Handler.prototype, "printMatch", null);
__decorate([
    Class.Public(),
    Application.Filter({ path: '/', environment: { name: 'F' } })
], Handler.prototype, "defaultFilter", null);
__decorate([
    Class.Public(),
    Application.Processor({ path: '/', environment: { name: 'R1', auth: false } }),
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
__decorate([
    Class.Public(),
    Application.Processor({ path: '/error', exact: false, environment: { name: 'R5' } })
], Handler.prototype, "errorProcessor", null);
Handler = __decorate([
    Class.Describe()
], Handler);
exports.Handler = Handler;
