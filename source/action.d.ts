/**
 * Copyright (C) 2018 Silas B. Domingos
 * This source code is licensed under the MIT License as described in the file LICENSE.
 */
import * as Routing from '@singleware/routing';

/**
 * Application action interface.
 */
export interface Action {
  /**
   * Action path.
   */
  path: string;
  /**
   * Determines whether the action path must be exact or not.
   */
  exact?: boolean;
  /**
   * Action path constraint.
   */
  constraint?: Routing.Constraint;
  /**
   * Action environment.
   */
  environment?: Routing.Variables;
}
