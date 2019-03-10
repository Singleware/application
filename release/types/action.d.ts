/*
 * Copyright (C) 2018-2019 Silas B. Domingos
 * This source code is licensed under the MIT License as described in the file LICENSE.
 */
import * as Types from './types';

/**
 * Application actions interface.
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
  constraint?: Types.Constraint;
  /**
   * Action environment.
   */
  environment?: Types.Variables;
}
