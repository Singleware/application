/*!
 * Copyright (C) 2018-2019 Silas B. Domingos
 * This source code is licensed under the MIT License as described in the file LICENSE.
 */
import * as Types from './types';

import { Action } from './action';

/**
 * Application request interface.
 */
export interface Route {
  /**
   * Route type.
   */
  type: Types.Route;
  /**
   * Route action settings.
   */
  action: Action;
  /**
   * Route method name.
   */
  method: string;
}
