'use strict';

var servicesModule = require('./');

var groupBy = require('lodash/groupBy');
var _max = require('lodash/max');
var sum = require('lodash/sum');
var every = require('lodash/every');
var uniq = require('lodash/array/uniq');
var map = require('lodash/map');

// this is a temporary cheat until this data is available in the API
const PLUGIN_NAMES = {
    CVE_2016_0800_openssl_drown: 'DROWN',
    CVE_2016_0728_kernel: 'Kernel keychain vulnerability (CVE-2016-0728)',
    CVEs_samba_badlock: 'Badlock (Samba)',
    CVE_2016_2315_24_git: 'CVE-2016-2315, CVE-2016-2324 (Git)',
    heartbleed: 'Heartbleed',
    httpd_poodle: 'POODLE (Httpd)',
    vsftpd_local_enable: 'vsftpd',
    CVE_2016_3714_imagemagick: 'ImageMagick',
    httpd_weak_ciphers: 'Weak Ciphers (Apache)',
    network_skb_panic_after_add_grhead: 'Networking caused kernel panic',
    sanity_check_fstab: '/etc/fstab misconfigurations',
    docker_journald_stop: 'Docker crashes after journald is stopped',
    cifs_share_lost: 'Interruption in CIFS shares',
    rhev_qla2xxx_firmware_failed: 'RHEV Qla2xxx firmware failed',
    docker_mount_dev: 'Docker mounting',
    unsupported_journal_mode: 'Unsupported journal mode',
    panic_anon_vma_degree: 'unlink_anon_vmas() kernel panic',
    sosreport_load_bridge_module:
        'sosreport loads the bridge kernel module unintentionally',
    rpm_database_problems: 'RPM database problems',
    xinetd_per_source_limit: 'xinetd per_source_limit messages',
    crashkernel_with_3w_modules: 'Kernel crash with 3w-sas or 3w-9xxx modules loaded',
    fs_resize2fs_bug: 'resize2fs utility issue on ext4 file system',
    multipathd_start_failed: 'Multipathd service failing to start at boot time',
    rport_delete_crash: 'Kernel panic on SCSI host removal',
    tg3_driver_issue: 'tg3 driver bug causes network instability',
    ilo: 'HP iLO memory corruption',
    missing_boot_files: 'Grub configuration: missing files',
    nproc_common_entries: 'Common entries in both limits.conf and 90-nproc.conf',
    tsc_reboot_uptime: 'Clock overflow panic after 200+ days uptime',
    rsyslogd_shutdown_crash: 'Rsyslogd crashing during shutdown',
    rx_crc_errors: 'Interface RX CRC errors',
    vm_swappiness_oom: 'vm.swappiness value at risk of OOM termination condition'
};

/**
 * @ngInject
 */
function RuleService ($filter) {
    const service = {};
    const orderBy = $filter('orderBy');

    service.groupRulesByPlugin = function (rules) {
        let plugins = groupBy(rules, 'plugin');

        return map(plugins, function (rules, key) {
            rules = orderBy(rules, [
                'acked',
                'hitCount === 0',
                '-severityNum',
                '-hitCount'
            ]);
            const result = {
                rules: rules,
                plugin_id: key
            };

            if (result.rules.length === 1) {
                result.rule = result.rules[0]; // shortcut for easier access
                result.type = 'rule';
            } else {
                result.type = 'group';
            }

            result.severityNum = _max(result.rules, 'severityNum').severityNum;

            result.categories = uniq(map(result.rules, 'category'));

            // sum up hitCounts for the plugin
            result.hitCount = sum(result.rules, 'hitCount');

            // a plugin is acked as long as every single rule is acked
            result.acked = every(result.rules, 'acked');

            result.display_name = result.rules[0].plugin_name;
            if (result.display_name in PLUGIN_NAMES) {
                result.display_name = PLUGIN_NAMES[result.display_name];
            }

            return result;
        });
    };

    return service;
}

servicesModule.service('RuleService', RuleService);
