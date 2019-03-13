/*
 * Copyright (C) 2018 Silas B. Domingos
 * This source code is licensed under the MIT License as described in the file LICENSE.
 */
import * as Class from '@singleware/class';
import * as Application from '../../source';

import { Match } from './types';

/**
 * Handler class.
 */
@Class.Describe()
export class Handler extends Class.Null {
  /**
   * Prints the specified match information.
   * @param type Match type.
   * @param match Match information.
   */
  @Class.Private()
  private printMatch(type: string, match: Match): void {
    const request = match.detail;
    const environment = request.environment.local;
    console.log(
      `${type}\t`,
      `Grated: ${request.granted}\t`,
      `Path: '${match.path}'\t`,
      `Name: '${environment.name}'`,
      `Remaining: '${match.remaining}'\t`
    );
  }

  /**
   * Default route filter. (Execute on all routes)
   * @param request Request information.
   */
  @Class.Public()
  @Application.Filter({ path: '/', environment: { name: 'F' } })
  public async defaultFilter(match: Match): Promise<boolean> {
    this.printMatch('Filter', match);
    if (match.detail.environment.local.auth !== false) {
      return Math.random() >= 0.35;
    }
    return true;
  }

  /**
   * Default route processor. (Using more than one exact route)
   * @param match Match information.
   */
  @Class.Public()
  @Application.Processor({ path: '/', environment: { name: 'R1', auth: false } })
  @Application.Processor({ path: '/home', environment: { name: 'R2' } })
  public async defaultProcessor(match: Match): Promise<void> {
    this.printMatch('Home', match);
  }

  /**
   * About route processor. (Using exact route)
   * @param match Match information.
   */
  @Class.Public()
  @Application.Processor({ path: '/about', environment: { name: 'R3' } })
  public async aboutProcessor(match: Match): Promise<void> {
    this.printMatch('About', match);
  }

  /**
   * Page route processor. (Using catch all for /page/*)
   * @param match Match information.
   */
  @Class.Public()
  @Application.Processor({ path: '/page', exact: false, environment: { name: 'R4' } })
  public async pageProcessor(match: Match): Promise<void> {
    this.printMatch('Page', match);
  }

  /**
   * Error route processor.
   * @param match Match information.
   */
  @Class.Public()
  @Application.Processor({ path: '/error', exact: false, environment: { name: 'R5' } })
  public async errorProcessor(match: Match): Promise<void> {
    this.printMatch('Error', match);
    throw new Error('Error example.');
  }
}
