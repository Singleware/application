/*
 * Copyright (C) 2018 Silas B. Domingos
 * This source code is licensed under the MIT License as described in the file LICENSE.
 */
import * as Application from '../../source';

import { Input } from './input';
import { Output } from './output';

/**
 * Match type.
 */
export type Match = Application.Match<Input, Output>;

/**
 * Request type.
 */
export type Request = Application.Request<Input, Output>;

/**
 * Subject type.
 */
export type RequestSubject = Application.RequestSubject<Input, Output>;
