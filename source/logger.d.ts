/**
 * Copyright (C) 2018 Silas B. Domingos
 * This source code is licensed under the MIT License as described in the file LICENSE.
 */
import * as Observable from '@singleware/observable';

import { Request } from './request';

/**
 * Application logger interface.
 */
export interface Logger<I, O> {
  /**
   * Receive input events.
   */
  readonly onReceive: Observable.Observer<Request<I, O>>;
  /**
   * Process input events.
   */
  readonly onProcess: Observable.Observer<Request<I, O>>;
  /**
   * Send output events.
   */
  readonly onSend: Observable.Observer<Request<I, O>>;
  /**
   * Error events.
   */
  readonly onError: Observable.Observer<Request<I, O>>;
}
