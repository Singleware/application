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
const Application = require("../../source");
const service_1 = require("./service");
const logger_1 = require("./logger");
const handler_1 = require("./handler");
/**
 * Application example.
 */
let Example = class Example extends Application.Main {
    /**
     * Default constructor.
     */
    constructor() {
        super({ separator: '/', variable: /\{([a-z0-9])\}/ });
        this.addService(service_1.Service);
        this.addLogger(logger_1.Logger);
        this.addHandler(handler_1.Handler);
        this.start();
        this.stop();
    }
};
Example = __decorate([
    Class.Describe()
], Example);
// Start application.
new Example();
//# sourceMappingURL=main.js.map