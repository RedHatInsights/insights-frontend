'use strict';
var constantsModule = require('./');

const SYSTEMS = {
    'kinlaw-rhel-vm': {
        system_id: 'f7473238-1953-415f-8de6-a8da92975a64',
        system_type_id: 105,
        toString: 'kinlaw-rhel-vm',
        account_number: '540155',
        report_count: 2,
        last_check_in: '2018-01-17T13:16:31.000Z'
    },
    'kinlaw-rhel-vm4': {
        system_id: '66a6d090-e1dc-4036-b29f-c0b8cfde433d',
        system_type_id: 105,
        toString: 'kinlaw-rhel-vm4',
        account_number: '540155',
        report_count: 6,
        last_check_in: '2018-01-17T13:16:31.000Z'
    }
};

const CVES = {
    'CVE-2017-6462': {
        id: 'CVE-2017-6462',
        impact: 'low',
        public_date: '2017-03-21',
        iava: '2017-A-0084',
        cwe: 'CWE-20',
        description: 'A vulnerability was found in NTP, in the parsing of ' +
             'packets from the /dev/datum device. A malicious device could send ' +
             'crafted messages, causing ntpd to crash. Find out more about ' +
             'CVE-2017-6462 from the MITRE CVE dictionary dictionary and NIST NVD.',
        systems: [SYSTEMS['kinlaw-rhel-vm'], SYSTEMS['kinlaw-rhel-vm4']],
        link: 'https://access.redhat.com/security/cve/cve-2017-6462'
    },
    'CVE-2017-6463': {
        id: 'CVE-2017-6463',
        impact: 'moderate',
        public_date: '2017-03-21',
        iava: '2017-A-0084',
        cwe: 'CWE-20',
        description: 'A vulnerability was discovered in the NTP server\'s ' +
             'parsing of configuration directives. A remote, authenticated ' +
             'attacker could cause ntpd to crash by sending a crafted message.' +
             '<br/>Find out more about CVE-2017-6463 from the MITRE CVE dictionary' +
             ' and NIST NVD.',
        systems: [],
        link: 'https://access.redhat.com/security/cve/CVE-2017-6463'
    },
    'CVE-2017-5754': {
        id: 'CVE-2017-5754',
        impact: 'important',
        public_date: '2018-01-03',
        iava: null,
        cew: null,
        description: `
            An industry-wide issue was found in the way many modern microprocessor designs
            have implemented speculative execution of instructions (a commonly used
            performance optimization). There are three primary variants of the issue which
            differ in the way the speculative execution can be exploited. Variant
            CVE-2017-5754 relies on the fact that, on impacted microprocessors, during
            speculative execution of instruction permission faults, exception generation
            triggered by a faulting access is suppressed until the retirement of the whole
            instruction block. In a combination with the fact that memory accesses may
            populate the cache even when the block is being dropped and never
            committed (executed), an unprivileged local attacker could use this flaw
            to read privileged (kernel space) memory by conducting targeted cache
            side-channel attacks.

            Note: CVE-2017-5754 affects Intel x86-64 microprocessors.
            AMD x86-64 microprocessors are not affected by this issue.`,
        systems: [SYSTEMS['kinlaw-rhel-vm'], SYSTEMS['kinlaw-rhel-vm4']],
        link: 'https://access.redhat.com/security/cve/CVE-2017-5754',
        insights_rule: 'CVE_2017_5754_kernel|KERNEL_CVE_2017_5754_INTEL'
    },
    'CVE-2017-1000251': {
        id: 'CVE-2017-1000251',
        impact: 'important',
        public_date: '2017-09-12',
        iava: null,
        cwe: 'CWE-121',
        description: `
        A stack buffer overflow flaw was found in the way the Bluetooth subsystem
        of the Linux kernel processed pending L2CAP configuration responses from
        a client. On systems with the stack protection feature enabled in the kernel
        (CONFIG_CC_STACKPROTECTOR=y, which is enabled on all architectures other than
        s390x and ppc64[le]), an unauthenticated attacker able to initiate a
        connection to a system via Bluetooth could use this flaw to crash the system.
        Due to the nature of the stack protection feature, code execution cannot be
        fully ruled out, although we believe it is unlikely. On systems without the
        stack protection feature (ppc64[le]; the Bluetooth modules are not built
        on s390x), an unauthenticated attacker able to initiate a connection to a
        system via Bluetooth could use this flaw to remotely execute arbitrary code
        on the system with ring 0 (kernel) privileges.`,
        systems: [SYSTEMS['kinlaw-rhel-vm'], SYSTEMS['kinlaw-rhel-vm4']],
        link: 'https://access.redhat.com/security/cve/CVE-2017-1000251',
        insights_rule: 'CVE_2017_1000251_kernel_blueborne|' +
                       'KERNEL_CVE_2017_1000251_POSSIBLE_DOS'
    },
    'CVE-2017-1000364': {
        id: 'CVE-2017-1000364',
        impact: 'important',
        public_date: '2017-06-19',
        iava: null,
        cwe: null,
        description: `
        A flaw was found in the way memory was being allocated on the stack for
        user space binaries. If heap (or different memory region) and stack memory
        regions were adjacent to each other, an attacker could use this flaw to jump
        over the stack guard gap, cause controlled memory corruption on process stack
        or the adjacent memory region, and thus increase their privileges on the
        system. This is a kernel-side mitigation which increases the stack guard gap
        size from one page to 1 MiB to make successful exploitation of this issue
        more difficult.`,
        systems: [SYSTEMS['kinlaw-rhel-vm'], SYSTEMS['kinlaw-rhel-vm4']],
        link: 'https://access.redhat.com/security/cve/CVE-2017-1000364',
        insights_rule: 'CVE_2017_1000366_glibc|' +
                       'CVE_2017_1000364_KERNEL_CVE_2017_1000366_GLIBC_EXPLOITABLE'
    },
    'CVE-2017-7184': {
        id: 'CVE-2017-7184',
        impact: 'important',
        public_date: '2017-03-29',
        iava: null,
        cwe: 'CWE-122',
        description: `
        Out-of-bounds kernel heap access vulnerability was found in xfrm,
        kernel's IP framework for transforming packets. An error dealing with
        netlink messages from an unprivileged user leads to arbitrary read/write
        and privilege escalation.`,
        systems: [SYSTEMS['kinlaw-rhel-vm'], SYSTEMS['kinlaw-rhel-vm4']],
        link: 'https://access.redhat.com/security/cve/CVE-2017-7184',
        insights_rule: 'CVE_2017_7184_kernel|KERNEL_CVE_2017_7184_EXPLOITABLE_2'
    }
};

const RHSAS_CVES = {
    'RHSA-2017:3071': {
        id: 'RHSA-2017:3071',
        type: 'Security Advisory',
        synopsis: 'ntp security update',
        severity: 'moderate',
        systems_affected: 2,
        summary: 'An update for ntp is now available for Red Hat Enterprise Linux ' +
                 '6.<br/>Red Hat Product Security has rated this update as having ' +
                 'a security impact of Moderate. A Common Vulnerability Scoring ' +
                 'System (CVSS) base score, which gives a detailed severity ' +
                 'rating, is available for each vulnerability from the CVE ' +
                 'link(s) in the References section.',
        description: 'An update for ntp is now available for Red Hat Enterprise ' +
                 'Linux 6.<br/>Red Hat Product Security has rated this update as ' +
                 'Scoring having a security impact of Moderate. A Common ' +
                 'Vulnerability System (CVSS) base score, which gives a detailed ' +
                 'severity rating, is available for each vulnerability from the ' +
                 'CVE link(s) in the References section.',
        solution: 'https://access.redhat.com/articles/11258',
        cves: [CVES['CVE-2017-6462'], CVES['CVE-2017-6463']],
        rule_hits: 0
    },
    'RHSA-2018:0007': {
        id: 'RHSA-2018:0007',
        type: 'Security Advisory',
        synopsis: 'kernel security update',
        severity: 'important',
        systems_affected: 1,
        summary:'An update for kernel is now available for Red Hat Enterprise Linux 7.',
        description: `
            An industry-wide issue was found in the way many modern microprocessor designs
            have implemented speculative execution of instructions (a commonly used
            performance optimization). There are three primary variants of the issue which
            differ in the way the speculative execution can be exploited.`,
        solution: 'https://access.redhat.com/articles/11258',
        cves: [CVES['CVE-2017-5754']],
        rule_hits: 1
    },
    'RHSA-2017:2679': {
        id:'RHSA-2017:2679',
        type: 'Security Advisory',
        synopsis: 'kernel security update',
        severity: 'important',
        summary: 'An update for kernel is now available for Red Hat Enterprise Linux 7.',
        description:`
            A stack buffer overflow flaw was found in the way the Bluetooth subsystem of
            the Linux kernel processed pending L2CAP configuration responses from
            a client.`,
        solution: 'https://access.redhat.com/articles/11258',
        cves: [CVES['CVE-2017-1000251']],
        rule_hits: 1
    },
    'RHSA-2017:1484': {
        id:'RHSA-2017:1484',
        type: 'Security Advisory',
        synopsis: 'kernel security update',
        severity: 'important',
        summary: 'An update for kernel is now available for Red Hat Enterprise Linux 7.',
        description:`
        A flaw was found in the way memory was being allocated on the stack for
        user space binaries. If heap (or different memory region) and stack memory regions
        were adjacent to each other, an attacker could use this flaw to jump over the
        stack guard gap, cause controlled memory corruption on process stack or
        the adjacent memory region, and thus increase their privileges on the system.
        This is a kernel-side mitigation which increases the stack guard gap size
        from one page to 1 MiB to make successful exploitation of this issue
        more difficult.`,
        solution: 'https://access.redhat.com/articles/11258',
        cves: [CVES['CVE-2017-1000364']],
        rule_hits: 1
    },
    'RHSA-2017:2930': {
        id:'RHSA-2017:2930',
        type: 'Security Advisory',
        synopsis: 'kernel security update',
        severity: 'important',
        summary: 'An update for kernel is now available for Red Hat Enterprise Linux 7.',
        description:`
        Security Fix(es):
        Out-of-bounds kernel heap access vulnerability was found in xfrm, kernel's IP
        framework for transforming packets.
        A race condition issue leading to a use-after-free flaw was found in the way
        the raw packet sockets are implemented in the Linux kernel networking subsystem
        handling synchronization. A local user able to open a raw packet socket
        (requires the CAP_NET_RAW capability) could use this flaw to elevate their
        privileges on the system.

        An exploitable memory corruption flaw was found in the Linux kernel.
        The append path can be erroneously switched from UFO to non-UFO in
        ip_ufo_append_data() when building an UFO packet with MSG_MORE option.
        If unprivileged user namespaces are available, this flaw can be exploited
        to gain root privileges.

        A flaw was found in the Linux networking subsystem where a local attacker with
        CAP_NET_ADMIN capabilities could cause an out-of-bounds memory access by
        creating a smaller-than-expected ICMP header and sending to its destination
        via sendto().

        Kernel memory corruption due to a buffer overflow was found in
        brcmf_cfg80211_mgmt_tx() function in Linux kernels from v3.9-rc1 to v4.13-rc1.
        The vulnerability can be triggered by sending a crafted NL80211_CMD_FRAME packet
        via netlink. This flaw is unlikely to be triggered remotely as certain userspace
        code is needed for this. An unprivileged local user could use this flaw to
        induce kernel memory corruption on the system, leading to a crash. Due to the
        nature of the flaw, privilege escalation cannot be fully ruled out, although
        it is unlikely.

        An integer overflow vulnerability in ip6_find_1stfragopt() function was found.
        A local attacker that has privileges (of CAP_NET_RAW) to open raw socket can
        cause an infinite loop inside the ip6_find_1stfragopt() function.

        A kernel data leak due to an out-of-bound read was found in the Linux kernel in
        inet_diag_msg_sctp{,l}addr_fill() and sctp_get_sctp_info() functions
        present since version 4.7-rc1 through version 4.13. A data leak happens when
        these functions fill in sockaddr data structures used to export
        socket's diagnostic information. As a result, up to 100 bytes of the slab
        data could be leaked to a userspace.

        The mq_notify function in the Linux kernel through 4.11.9 does not set the sock
        pointer to NULL upon entry into the retry logic. During a user-space close of a
        Netlink socket, it allows attackers to possibly cause a situation where a value
        may be used after being freed (use-after-free) which may lead to memory
        corruption or other unspecified other impact.

        A divide-by-zero vulnerability was found in the __tcp_select_window function in
        the Linux kernel. This can result in a kernel panic causing a local denial
        of service.`,
        solution: 'https://access.redhat.com/articles/11258',
        cves: [CVES['CVE-2017-7184']],
        rule_hits: 1
    }
};

const PACKAGES_NO_CVES = [{
    id: 0,
    name: 'ntp',
    release_date: '2017-01-01',
    critical_count: 0,
    important_count: 0,
    moderate_count: 1,
    low_count: 0,
    version: '4.0',
    systems: [SYSTEMS['kinlaw-rhel-vm'], SYSTEMS['kinlaw-rhel-vm4']],
    rhsas: [RHSAS_CVES['RHSA-2017:3071']]
}, {
    id: 1,
    name: 'kernel',
    release_date: '2014-06-10',
    critical_count: 0,
    important_count: 4,
    moderate_count: 0,
    low_count: 0,
    version: '3.10.0-693',
    systems: [SYSTEMS['kinlaw-rhel-vm'], SYSTEMS['kinlaw-rhel-vm4']],
    rhsas: [RHSAS_CVES['RHSA-2017:2930'], RHSAS_CVES['RHSA-2017:1484'],
            RHSAS_CVES['RHSA-2017:2679'], RHSAS_CVES['RHSA-2018:0007']]
}];

constantsModule.constant('VMAAS_CVES', [CVES['CVE-2017-6462'],CVES['CVE-2017-6463']]);

constantsModule.constant('VMAAS_PACKAGES_NOCVE', PACKAGES_NO_CVES);

constantsModule.constant('VMAAS_PACKAGES', [{
    id: 0,
    name: 'ntp',
    release_date: '2017-01-01',
    critical_count: 0,
    important_count: 0,
    moderate_count: 2,
    low_count: 0,
    version: '4.0',
    rhsas: [RHSAS_CVES['RHSA-2017:3071']]
}]);

constantsModule.constant('VMAAS_SYSTEMS', [{
    system_id: 'f7473238-1953-415f-8de6-a8da92975a64',
    system_type_id: 105,
    toString: 'kinlaw-rhel-vm',
    account_number: '540155',
    report_count: 2,
    last_check_in: '2018-01-17T13:16:31.000Z',
    packages: PACKAGES_NO_CVES
}]);
