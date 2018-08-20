/**
 * Copyright (C) 2018 Silas B. Domingos
 * This source code is licensed under the MIT License as described in the file LICENSE.
 */
import * as Observable from '@singleware/observable';

import { Request } from './request';
import { Service } from './service';

/**
 * Application logger interface.
 */
export interface Logger<I, O> extends Service<I, O> {
  /**
   * Process input events.
   */
  readonly onProcess: Observable.Subject<Request<I, O>>;
}
