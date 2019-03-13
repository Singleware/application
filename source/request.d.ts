/*
 * Copyright (C) 2018-2019 Silas B. Domingos
 * This source code is licensed under the MIT License as described in the file LICENSE.
 */
import * as Types from './types';

import { Environment } from './environment';

/**
 * Application request interface.
 */
export interface Request<I, O> {
  /**
   * Request path.
   */
  readonly path: string;
  /**
   * Request input.
   */
  readonly input: I;
  /**
   * Request output.
   */
  readonly output: O;
  /**
   * Request environment.
   */
  environment: Environment;
  /**
   * Determines whether this request is allowed or not.
   */
  granted: boolean;
  /**
   * Request error.
   */
  error?: Error;
}
