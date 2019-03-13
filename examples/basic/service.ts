/*
 * Copyright (C) 2018 Silas B. Domingos
 * This source code is licensed under the MIT License as described in the file LICENSE.
 */
import * as Class from '@singleware/class';
import * as Observable from '@singleware/observable';
import * as Application from '../../source';

import { Input } from './input';
import { Output } from './output';
import { Request } from './types';

/**
 * Service class.
 */
@Class.Describe()
export class Service extends Class.Null implements Application.Service<Input, Output> {
  /**
   * Receive subject instance.
   */
  @Class.Private()
  private receiveSubject = new Observable.Subject<Request>();

  /**
   * Send subject instance.
   */
  @Class.Private()
  private sendSubject = new Observable.Subject<Request>();

  /**
   * Error subject instance.
   */
  @Class.Private()
  private errorSubject = new Observable.Subject<Request>();

  /**
   * Receive events in this service.
   */
  @Class.Public()
  public get onReceive(): Observable.Subject<Request> {
    return this.receiveSubject;
  }

  /**
   * Send events in this service.
   */
  @Class.Public()
  public get onSend(): Observable.Subject<Request> {
    return this.sendSubject;
  }

  /**
   * Error events in this service.
   */
  @Class.Public()
  public get onError(): Observable.Subject<Request> {
    return this.errorSubject;
  }

  /**
   * Starts the application service.
   */
  @Class.Public()
  public start(): void {
    const path = `/${process.argv[2] || ''}`;
    this.receiveSubject.notifyAll({
      path: path,
      input: {
        url: `https://application.singleware.com${path}`
      },
      output: {
        data: ''
      },
      environment: {
        local: {
          variable: 'Example'
        },
        shared: {
          variable: 'Example'
        }
      },
      granted: true
    });
  }

  /**
   * Stops the application service.
   */
  @Class.Public()
  public stop(): void {}
}
