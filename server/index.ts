import { PluginInitializerContext } from '../../../src/core/server';
import { TestDashboardPlugin } from './plugin';

// This exports static code and TypeScript types,
// as well as, OpenSearch Dashboards Platform `plugin()` initializer.

export function plugin(initializerContext: PluginInitializerContext) {
  return new TestDashboardPlugin(initializerContext);
}

export { TestDashboardPluginSetup, TestDashboardPluginStart } from './types';
