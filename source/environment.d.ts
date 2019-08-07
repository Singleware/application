/*!
 * Copyright (C) 2018-2019 Silas B. Domingos
 * This source code is licensed under the MIT License as described in the file LICENSE.
 */
import * as Aliases from './aliases';

/**
 * Application environment interface.
 */
export interface Environment {
  /**
   * Private local environment.
   */
  local: Aliases.Variables;
  /**
   * Public shared environment.
   */
  shared: Aliases.Variables;
}
