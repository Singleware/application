"use strict";
/**
 * Copyright (C) 2018 Silas B. Domingos
 * This source code is licensed under the MIT License as described in the file LICENSE.
 */
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Application states enumeration.
 */
var States;
(function (States) {
    States[States["RECEIVE"] = 0] = "RECEIVE";
    States[States["PROCESS"] = 1] = "PROCESS";
    States[States["SEND"] = 2] = "SEND";
})(States = exports.States || (exports.States = {}));
