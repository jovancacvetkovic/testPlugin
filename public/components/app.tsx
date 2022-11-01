import React, { useState } from 'react';
import { i18n } from '@osd/i18n';
import { FormattedMessage, I18nProvider } from '@osd/i18n/react';
import { BrowserRouter as Router } from 'react-router-dom';

import {
  EuiButton,
  EuiHorizontalRule,
  EuiPage,
  EuiPageBody,
  EuiPageContent,
  EuiPageContentBody,
  EuiPageContentHeader,
  EuiPageHeader,
  EuiTitle,
  EuiText,
  dateFormatAliases,
  formatDate,
} from '@elastic/eui';

import { CoreStart } from '../../../../src/core/public';
import { NavigationPublicPluginStart } from '../../../../src/plugins/navigation/public';

import { PLUGIN_ID, PLUGIN_NAME } from '../../common';
import { DataPublicPluginStart } from '../../../../src/plugins/data/public';
import { Chart, Settings, BarSeries, Axis, timeFormatter, niceTimeFormatByDay } from '@elastic/charts';
import { EUI_CHARTS_THEME_DARK, EUI_CHARTS_THEME_LIGHT } from '@elastic/eui/dist/eui_charts_theme';

interface TestDashboardAppDeps {
  basename: string;
  notifications: CoreStart['notifications'];
  http: CoreStart['http'];
  navigation: NavigationPublicPluginStart;
  data: DataPublicPluginStart
}

export const TestDashboardApp = ({
  basename,
  notifications,
  http,
  navigation,
  data
}: TestDashboardAppDeps) => {
  // Use React hooks to manage state.
  const [timestamp, setTimestamp] = useState<string | undefined>();
  const [searchdata = [], setSearchdata] = useState<Array<Record<string, any>>>();

  const onClickHandler = () => {
    // Use the core http service to make a response to the server API.
    http.get('/api/test_dashboard/example').then((res) => {
      setTimestamp(res.time);
      // Use the core notifications service to display a success message.
      notifications.toasts.addSuccess(
        i18n.translate('testDashboard.dataUpdated', {
          defaultMessage: 'Data updated',
        })
      );
    });
  };

  const onSearchHandler = async () => {
    const searchSource = await data.search.searchSource.create();
    const [dataView] = await data.indexPatterns.find("opensearch_dashboards_sample_data_logs");
    const searchResponse = await searchSource
      .setField('index', dataView)
      .setField("size", 50)
      .fetch();

    setSearchdata(searchResponse.hits.hits);
  }

  // Render the application DOM.
  // Note that `navigation.ui.TopNavMenu` is a stateful component exported on the `navigation` plugin's start contract.
  return (
    <Router basename={basename}>
      <I18nProvider>
        <>
          <navigation.ui.TopNavMenu
            appName={PLUGIN_ID}
            showSearchBar={true}
            useDefaultBehaviors={true}
          />
          <EuiPage restrictWidth="1000px">
            <EuiPageBody component="main">
              <EuiPageHeader>
                <EuiTitle size="l">
                  <h1>
                    <FormattedMessage
                      id="testDashboard.helloWorldText"
                      values={{ name: PLUGIN_NAME }}
                    />
                  </h1>
                </EuiTitle>
              </EuiPageHeader>
              <EuiPageContent>
                <EuiPageContentHeader>
                  <EuiTitle>
                    <h2>
                      <FormattedMessage
                        id="testDashboard.congratulationsTitle"
                        defaultMessage="Congratulations, you have successfully created a new OpenSearch Dashboards Plugin!"
                      />
                    </h2>
                  </EuiTitle>
                </EuiPageContentHeader>
                <EuiPageContentBody>
                  <EuiText>
                    <p>
                      <FormattedMessage
                        id="testDashboard.content"
                        defaultMessage="Look through the generated code and check out the plugin development documentation."
                      />
                    </p>
                    <EuiHorizontalRule />
                    <p>
                      <FormattedMessage
                        id="testDashboard.timestampText"
                        defaultMessage="Last timestamp: {time}"
                        values={{ time: timestamp ? timestamp : 'Unknown' }}
                      />
                    </p>
                    <EuiButton type="primary" size="s" onClick={onClickHandler}>
                      <FormattedMessage id="testDashboard.timeButtonText" defaultMessage="Get time" />
                    </EuiButton>

                    <EuiHorizontalRule />
                    <Chart size={{ height: 200 }}>
                      <BarSeries
                        id="bytes"
                        name="bytes"
                        data={searchdata?.map((data) => [data._source.timestamp, data._source.bytes])}
                        xScaleType="time"
                        xAccessor={0}
                        yAccessors={[1]}

                      />
                      <Axis
                        title={formatDate(Date.now(), dateFormatAliases.date)}
                        id="bottom-axis"
                        position="bottom"
                        tickFormat={timeFormatter(niceTimeFormatByDay(1))}

                      />
                      <Axis
                        id="left-axis"
                        position="left"
                        showGridLines
                        tickFormat={(d) => Number(d).toFixed(2)}
                      />
                    </Chart>
                    <EuiButton type="primary" size="s" onClick={onSearchHandler}>
                      <FormattedMessage id="testDashboard.searchButtonText" defaultMessage="Get data" />
                    </EuiButton>

                    <pre>
                      <FormattedMessage
                        id="testDashboard.searchText"
                        defaultMessage="Search data: {data}"
                        values={{ data: searchdata ? JSON.stringify(searchdata, null, 2) : 'No data' }}
                      />
                    </pre>
                  </EuiText>
                </EuiPageContentBody>
              </EuiPageContent>
            </EuiPageBody>
          </EuiPage>
        </>
      </I18nProvider>
    </Router>
  );
};
