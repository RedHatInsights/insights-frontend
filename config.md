# InsightsConfig

| option | description | default |
|---|---|---|---|
| title | The page title |  Red Hat Insights |
| autoRefresh | The time (in ms) to auto refresh the overview | 0 |
| authenticate | should we authenticate | false |
| allowExport | allow csv export | false |
| doPaf | enable portal analytics | false | 
| getReportsErrorCallback | function called when an error is reached while getting reports| null |
| overviewShowSystem | function to be called on system row click (overview page) | null |
| systemShowSystem | function to be called on system row click (system page) | null |
| getSystemStatus | should fetch system status | true |
| gettingStartedLink | where to link to for getting started | null |
| apiPrefix | api prefix | /r/insights |
| canUnregisterSystems | function or boolean that allows unregistering systems | null |
| canIgnoreRules | function or boolean that allows ignoring rules | null |

## Usage

```js

var app = angular.module('app', ['insights']);

app.config(['InsightsConfigProvider', function(InsightsConfigProvider) {
    InsightsConfigProvider.setApiPrefix('the/new/api/root');
    InsightsConfigProvider.setCanUnregisterSystems(false);
    InsightsConfigProvider.setSystemShowSystem(function(system) {
        window.location = '/show/system' + system.machine_id;
    });
}]);
```
