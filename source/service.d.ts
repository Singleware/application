/**
 * Copyright (C) 2018 Silas B. Domingos
 * This source code is licensed under the MIT License as described in the file LICENSE.
 */
import * as Observable from '@singleware/observable';

import { Request } from './request';

/**
 * Application service interface.
 */
export interface Service<I, O> {
  /**
   * Receive input events.
   */
  readonly onReceive: Observable.Subject<Request<I, O>>;

  /**
   * Send output events.
   */
  readonly onSend: Observable.Subject<Request<I, O>>;

  /**
   * Starts the service.
   */
  start(): void;

  /**
   * Stops the service.
   */
  stop(): void;
}
