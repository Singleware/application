"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/*!
 * Copyright (C) 2018-2019 Silas B. Domingos
 * This source code is licensed under the MIT License as described in the file LICENSE.
 */
var main_1 = require("./main");
exports.Main = main_1.Main;
var aliases_1 = require("./aliases");
exports.Router = aliases_1.Router;
exports.Match = aliases_1.Match;
exports.RequestSubject = aliases_1.RequestSubject;
// Declarations
const main_2 = require("./main");
/**
 * Decorates the specified member to filter an application request. (Alias for Main.Filter)
 * @param action Filter action settings.
 * @returns Returns the decorator method.
 */
exports.Filter = (action) => main_2.Main.Filter(action);
/**
 * Decorates the specified member to process an application request. (Alias for Main.Processor)
 * @param action Route action settings.
 * @returns Returns the decorator method.
 */
exports.Processor = (action) => main_2.Main.Processor(action);
// Imported aliases.
const Types = require("./types");
/**
 * Types namespace.
 */
exports.Types = Types;
//# sourceMappingURL=index.js.map