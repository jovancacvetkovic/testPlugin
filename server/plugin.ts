import {
  PluginInitializerContext,
  CoreSetup,
  CoreStart,
  Plugin,
  Logger,
} from '../../../src/core/server';

import { TestDashboardPluginSetup, TestDashboardPluginStart } from './types';
import { defineRoutes } from './routes';

export class TestDashboardPlugin
  implements Plugin<TestDashboardPluginSetup, TestDashboardPluginStart> {
  private readonly logger: Logger;

  constructor(initializerContext: PluginInitializerContext) {
    this.logger = initializerContext.logger.get();
  }

  public setup(core: CoreSetup) {
    this.logger.debug('testDashboard: Setup');
    const router = core.http.createRouter();

    // Register server side APIs
    defineRoutes(router);

    return {};
  }

  public start(core: CoreStart) {
    this.logger.debug('testDashboard: Started');
    return {};
  }

  public stop() {}
}
