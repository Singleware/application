/*
 * Copyright (C) 2018-2019 Silas B. Domingos
 * This source code is licensed under the MIT License as described in the file LICENSE.
 */
import * as Types from './types';
import { Request } from './request';

/**
 * Application service interface.
 */
export interface Service<I, O> {
  /**
   * Receive input events.
   */
  readonly onReceive: Types.RequestSubject<I, O>;
  /**
   * Send output events.
   */
  readonly onSend: Types.RequestSubject<I, O>;
  /**
   * Error events.
   */
  readonly onError: Types.RequestSubject<I, O>;
  /**
   * Starts the service.
   */
  start(): void;
  /**
   * Stops the service.
   */
  stop(): void;
}
