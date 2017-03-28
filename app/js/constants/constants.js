'use strict';

/**
 * This is a dumping ground for constants that don't need a specific module.
 * Check the other modules in the constants directory before adding a constant here.
 */

var constantsModule = require('./');

constantsModule.constant('GettingStartedUrl',
    'https://access.redhat.com/products/red-hat-insights');

constantsModule.constant(
    'QuickFilters', {
        summaryTypes: {
            systems: 'systems',
            categories: 'categories'
        }
    });

// entitlements constants
constantsModule.constant('TrialSku', 'SER0482');

// tableToCards breakpoint
constantsModule.constant('TableToCardsBreakpoint', '650px');

constantsModule.constant(
    'HttpHeaders', {
        resourceCount: 'X-Resource-Count'
    });

// These are avalible via a service, but the service is not a production service.
// For speed and reliability storing them here for now
// We can move them to InsightsAPI if we want,
// and have that API endpoint cache the data from Klink
// https://klink.gsslab.rdu2.redhat.com/telemetry/accounts/internal
constantsModule.constant(
    'IgnoreAccountList',
    [
        '939082',
        '1070555',
        '5361051',
        '636204',
        '5526886',
        '730731',
        '5506478',
        '1298305',
        '1337999',
        '5463389',
        '5341931',
        '5557007',
        '5586766',
        '1494526',
        '1460290',
        '1568253',
        '5491806',
        '631105',
        '1191423',
        '5387712',
        '5301816',
        '5606428',
        '5348764',
        '901578',
        '5364511',
        '5597433',
        '633200',
        '5345665',
        '971738',
        '5496022',
        '5582724',
        '5496024',
        '1455657',
        '5538252',
        '5273074',
        '5457785',
        '5301467',
        '5254297',
        '5535221',
        '5274410',
        '5597794',
        '5385776',
        '5596826',
        '5243891',
        '5673127',
        '5594202',
        '5375112',
        '5463401',
        '477931',
        '5582531',
        '5445856',
        '720046',
        '1061991',
        '939054',
        '5351378',
        '761015',
        '895158',
        '5471870',
        '5582336',
        '6',
        '1640157',
        '5357088',
        '1495773',
        '901532',
        '5258694',
        '5505446',
        '940527',
        '5530698',
        '853019',
        '1292438',
        '1212729',
        '5453171',
        '5645132',
        '972614',
        '1034029',
        '958959',
        '1262852',
        '5644938',
        '1626050',
        '1191884',
        '5574082',
        '5618348',
        '5436601',
        '5305464',
        '941133',
        '1456379',
        '5547202',
        '1546454',
        '5309654',
        '540155',
        '1650204',
        '5591454',
        '5440919',
        '1446047',
        '000006',
        '1469411',
        '5524039',
        '5632300',
        '5455085',
        '5513381'
    ]);
