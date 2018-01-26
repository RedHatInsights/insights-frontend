/*global module, require*/

module.exports = {
    src_folders: ['smoketest'],
    output_folder: 'reports',
    custom_commands_path: '',
    custom_assertions_path: '',
    page_objects_path: '',
    globals_path: '',

    selenium: {
        start_process: false,
        server_path: '',
        log_path: '',
        port: 4444,
        cli_args: {
            'webdriver.chrome.driver': '',
            'webdriver.gecko.driver': '',
            'webdriver.edge.driver': ''
        }
    },

    test_settings: {
        default: {
            screenshots: {
                enabled: true,
                path: '/tmp/images',
                on_failure: true,
                on_error: true
            },
            selenium_port: 9515,
            selenium_host: 'localhost',
            default_path_prefix: '',
            desiredCapabilities: {
                browserName: 'chrome',
                javascriptEnabled: true,
                acceptSslCerts: true,
                acceptInsecureCerts: true,
                chromeOptions: {
                    args: [
                        // '--headless',
                        '--start-fullscreen',
                        '--disable-gpu=true',
                        '--no-sandbox'
                    ]
                }
            }
        }
    }
};
