/**
 * Copyright (C) 2018 Silas B. Domingos
 * This source code is licensed under the MIT License as described in the file LICENSE.
 *
 * The proposal of this example is to show how to use the base application package
 * with all features.
 */
import * as Class from '@singleware/class';
import * as Observable from '@singleware/observable';
import * as Application from '../source';

/**
 * Application input request.
 */
interface Input {
  /**
   * Request URL.
   */
  url: string;
}

/**
 * Application output response.
 */
interface Output {
  /**
   * Response data.
   */
  data: string;
}
/**
 * Create an application.
 */
const Website = new Application.Main<Input, Output>({
  separator: '/',
  variable: /\{([a-z0-9])\}/
});

/**
 * Dependency class to provide information to the application service.
 */
@Class.Describe()
@Website.Dependency({ singleton: true, name: 'pages' })
class DependencyA {
  /**
   * Random pages.
   */
  @Class.Private()
  private pages = ['/', '/home', '/about', '/page', '/page/about'];
  /**
   * Get a random page.
   */
  @Class.Public()
  public get page(): string {
    return this.pages[Math.round(Math.random() * 100) % this.pages.length];
  }
}

/**
 * Dependency class to provide helper methods to the application handler.
 */
@Class.Describe()
@Website.Dependency({ singleton: true, name: 'helper' })
class DependencyB {
  /**
   * Print information about the request.
   * @param name Action name.
   * @param request Request information.
   */
  @Class.Public()
  public print(name: string, match: Application.Match<Input, Output>): void {
    console.log(name, match.detail, match.variables);
  }
}

/**
 * Service class to provide any input request and handle any output response.
 */
@Class.Describe()
@Website.Inject(DependencyA)
class Service implements Application.Service<Input, Output> {
  /**
   * Notifier Id.
   */
  @Class.Private()
  private notifier?: any;
  /**
   * Dependencies.
   */
  @Class.Private()
  private dependencies: any;
  /**
   * Events.
   */
  @Class.Private()
  private events = {
    receive: new Observable.Subject<Application.Request<Input, Output>>(),
    send: new Observable.Subject<Application.Request<Input, Output>>()
  };
  /**
   * Default constructor.
   * @param dependencies Service dependencies.
   * @param parameters Service parameters.
   */
  constructor(dependencies: any, parameters: any[]) {
    this.dependencies = dependencies;
  }
  /**
   * Receive events.
   */
  @Class.Public()
  public get onReceive(): Observable.Subject<Application.Request<Input, Output>> {
    return this.events.receive;
  }
  /**
   * Send events.
   */
  @Class.Public()
  public get onSend(): Observable.Subject<Application.Request<Input, Output>> {
    return this.events.send;
  }
  /**
   * Starts the application service.
   */
  @Class.Public()
  public start(): void {
    this.notifier = <any>setInterval(
      Class.bind(async () => {
        const path = this.dependencies.pages.page;
        await this.events.receive.notifyAll({
          path: path,
          input: { url: `http://test${path}` },
          output: { data: '' },
          environment: {}
        });
      }),
      250
    );
    console.log('STARTED!');
  }
  /**
   * Stops the application service.
   */
  @Class.Public()
  public stop(): void {
    clearInterval(this.notifier);
    console.log('STOPPED!');
  }
}

/**
 * Handler class to handle any input and provide some output.
 */
@Class.Describe()
@Website.Inject(DependencyB)
class Handler {
  /**
   * Dependencies.
   */
  @Class.Private()
  private dependencies: any;
  /**
   * Default constructor.
   * @param dependencies Handler dependencies.
   */
  constructor(dependencies: any) {
    this.dependencies = dependencies;
  }
  /**
   * Default route filter.
   * (Execute on all routes)
   * @param request Request information.
   */
  @Class.Public()
  @Application.Filter({ path: '/', environment: { name: 'F' } })
  public async defaultFilter(match: Application.Match<Input, Output>): Promise<boolean> {
    const granted = Math.random() * 1000 > 350;
    this.dependencies.helper.print(`Filter (${granted ? 'ALLOWED' : 'DENIED'})`, match);
    return granted;
  }
  /**
   * Default route processor.
   * (Using more than one route)
   * @param match Match information.
   */
  @Class.Public()
  @Application.Processor({ path: '/', environment: { name: 'R1' } })
  @Application.Processor({ path: '/home', environment: { name: 'R2' } })
  public async defaultProcessor(match: Application.Match<Input, Output>): Promise<void> {
    this.dependencies.helper.print('Default', match);
  }
  /**
   * About route processor.
   * (Using exact route)
   * @param match Match information.
   */
  @Class.Public()
  @Application.Processor({ path: '/about', environment: { name: 'R3' } })
  public async aboutProcessor(match: Application.Match<Input, Output>): Promise<void> {
    this.dependencies.helper.print('About', match);
  }
  /**
   * Page route processor.
   * (Using catch all for /page/*)
   * @param match Match information.
   */
  @Class.Public()
  @Application.Processor({ path: '/page', exact: false, environment: { name: 'R4' } })
  public async pageProcessor(match: Application.Match<Input, Output>): Promise<void> {
    this.dependencies.helper.print('Page', match);
  }
}

/**
 * Register services and handlers.
 */
Website.addService(Service);
Website.addHandler(Handler);

/**
 * Starts the application.
 */
Website.start();

/**
 * Stops the application after a few seconds.
 */
setTimeout(() => {
  Website.stop();
}, 5000);
