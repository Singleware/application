/*
 * Copyright (C) 2018-2019 Silas B. Domingos
 * This source code is licensed under the MIT License as described in the file LICENSE.
 */
import * as Types from './types';

/**
 * Application environment interface.
 */
export interface Environment {
  /**
   * Private local environment.
   */
  local: Types.Variables;
  /**
   * Public shared environment.
   */
  shared: Types.Variables;
}
