/*
 * Copyright (C) 2018-2019 Silas B. Domingos
 * This source code is licensed under the MIT License as described in the file LICENSE.
 */
import * as Types from './types';
import { Request } from './request';

/**
 * Application logger interface.
 */
export interface Logger<I, O> {
  /**
   * Receive input events.
   */
  onReceive: Types.RequestObserver<I, O>;
  /**
   * Process input events.
   */
  onProcess: Types.RequestObserver<I, O>;
  /**
   * Send output events.
   */
  onSend: Types.RequestObserver<I, O>;
  /**
   * Error events.
   */
  onError: Types.RequestObserver<I, O>;
  /**
   * Start events.
   */
  onStart: Types.Observer;
  /**
   * Stop events.
   */
  onStop: Types.Observer;
}
