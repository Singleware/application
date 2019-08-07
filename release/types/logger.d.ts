/*!
 * Copyright (C) 2018-2019 Silas B. Domingos
 * This source code is licensed under the MIT License as described in the file LICENSE.
 */
import * as Aliases from './aliases';

import { Request } from './request';

/**
 * Application logger interface.
 */
export interface Logger<I, O> {
  /**
   * Receive input events.
   */
  onReceive: Aliases.RequestObserver<I, O>;
  /**
   * Process input events.
   */
  onProcess: Aliases.RequestObserver<I, O>;
  /**
   * Send output events.
   */
  onSend: Aliases.RequestObserver<I, O>;
  /**
   * Error events.
   */
  onError: Aliases.RequestObserver<I, O>;
  /**
   * Start events.
   */
  onStart: Aliases.Observer;
  /**
   * Stop events.
   */
  onStop: Aliases.Observer;
}
