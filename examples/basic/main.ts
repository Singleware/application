/*
 * Copyright (C) 2018 Silas B. Domingos
 * This source code is licensed under the MIT License as described in the file LICENSE.
 */
import * as Class from '@singleware/class';
import * as Application from '../../source';

import { Input } from './input';
import { Output } from './output';
import { Service } from './service';
import { Logger } from './logger';
import { Handler } from './handler';

/**
 * Application example.
 */
@Class.Describe()
class Example extends Application.Main<Input, Output> {
  /**
   * Default constructor.
   */
  constructor() {
    super({ separator: '/', variable: /\{([a-z0-9])\}/ });
    this.addService(Service);
    this.addLogger(Logger);
    this.addHandler(Handler);
    this.start();
    this.stop();
  }
}

// Starts the application
const instance = new Example();
