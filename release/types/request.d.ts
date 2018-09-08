/**
 * Copyright (C) 2018 Silas B. Domingos
 * This source code is licensed under the MIT License as described in the file LICENSE.
 */
import { Variables } from './types';

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
  environment: Variables;
  /**
   * Determines whether this request is allowed or not.
   */
  granted?: boolean;
}
