/*!
 * Copyright (C) 2018 Silas B. Domingos
 * This source code is licensed under the MIT License as described in the file LICENSE.
 */
import * as Class from '@singleware/class';

import * as Application from '../../source';

import { Input } from './input';
import { Output } from './output';
import { Request } from './types';

/**
 * Logger class.
 */
@Class.Describe()
export class Logger extends Class.Null implements Application.Logger<Input, Output> {
  /**
   * Prints the specified event information.
   * @param type Event type.
   * @param request Request information.
   */
  @Class.Private()
  private printEvent(type: string, request: Request): void {
    console.log(`${type}\t`, `Grated: ${request.granted}\t`, `Path: '${request.path}'\t`, `Name: '${request.environment.local.name}'`);
  }

  /**
   * Receive handler.
   * @param request Request information.
   */
  @Class.Public()
  public onReceive(request: Request): void {
    this.printEvent('Receive', request);
  }

  /**
   * Process handler.
   * @param request Request information.
   */
  @Class.Public()
  public onProcess(request: Request): void {
    this.printEvent('Process', request);
  }

  /**
   * Send handler.
   * @param request Request information.
   */
  @Class.Public()
  public onSend(request: Request): void {
    this.printEvent('Send', request);
  }

  /**
   * Error handler.
   * @param request Request information.
   */
  @Class.Public()
  public onError(request: Request): void {
    this.printEvent('Error', request);
    if (request.error) {
      console.log(`\t Detail: "${request.error.message}"`);
    }
  }

  /**
   * Start handler.
   */
  @Class.Public()
  public onStart(): void {
    console.log('Start');
  }

  /**
   * Stop handler.
   */
  @Class.Public()
  public onStop(): void {
    console.log('Stop');
  }
}
