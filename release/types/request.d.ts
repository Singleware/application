/**
 * Copyright (C) 2018 Silas B. Domingos
 * This source code is licensed under the MIT License as described in the file LICENSE.
 */
import * as Routing from '@singleware/routing';

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
  environment: Routing.Variables;
  /**
   * Determines whether this request is allowed or not.
   */
  granted?: boolean;
}
