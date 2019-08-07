/*!
 * Copyright (C) 2018-2019 Silas B. Domingos
 * This source code is licensed under the MIT License as described in the file LICENSE.
 */
import * as Aliases from './aliases';

import { Request } from './request';

/**
 * Application service interface.
 */
export interface Service<I, O> {
  /**
   * Receive input events.
   */
  readonly onReceive: Aliases.RequestSubject<I, O>;
  /**
   * Send output events.
   */
  readonly onSend: Aliases.RequestSubject<I, O>;
  /**
   * Error events.
   */
  readonly onError: Aliases.RequestSubject<I, O>;
  /**
   * Starts the service.
   */
  start(): void;
  /**
   * Stops the service.
   */
  stop(): void;
}
