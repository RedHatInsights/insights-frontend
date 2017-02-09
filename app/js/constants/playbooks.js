'use strict';

var constantsModule = require('./');

var PlaybookTemplates = {
    UpdatePackages: '- hosts: {{hosts}}\n' +
        '  gather_facts: true\n' +
        '  user: root\n' +
        '  vars:\n' +
        '    vulnerable_package_names: {{VULNERABLE_PACKAGE_NAMES}}\n' +
        '  tasks:\n' +
        '    - name: \'update the packages: {{vulnerable_package_names}}\'\n' +
        '      yum: name={{vulnerable_package_names}} state=latest\n' +
        '      \n' +
        '    - name: run insights-client\n' +
        '      shell: redhat-access-insights\n' +
        '\n',
    MaxAuthTries: '- hosts: {{hosts}}\n' +
        '  gather_facts: true\n' +
        '  become: true\n' +
        '  become_user: root\n' +
        '  become_method: sudo\n' +
        '  vars:\n' +
        '    upgrade: {{upgradeOpenSsh}}\n' +
        '    disable: {{!upgradeOpenSsh}}\n' +
        '\n' +
        '    pkg_profiles:\n' +
        '      \'6\':\n' +
        '         - name: "openssh-server"\n' +
        '           version: "5.3p1-114.el6_7"\n' +
        '      \'7\':\n' +
        '         - name: "openssh-server"\n' +
        '           version: "6.6.1p1-22.el7"\n' +
        '\n' +
        '    vulerable_pkgs: "{{ pkg_profiles[ansible_distribution_major_version]' +
        '|default([]) }}"\n' +
        '\n' +
        '  tasks:\n' +
        '    - name: check whether sshd is running\n' +
        '      shell: service sshd status\n' +
        '      register: sshd_running\n' +
        '      ignore_errors: true\n' +
        '\n' +
        '    - name: get installed packages possibly affected\n' +
        '      shell: rpm -q --qf "%{VERSION}-%{RELEASE}" {{ item.name }}.{{ ' +
        'ansible_architecture }}\n' +
        '      with_items: "{{ vulerable_pkgs }}"\n' +
        '      register: checked_packages\n' +
        '      ignore_errors: true\n' +
        '\n' +
        '    - set_fact:\n' +
        '       maybe_affected: "{{ checked_packages.results|selectattr(\'rc\', ' +
        '\'equalto\', 0)|list }}"\n' +
        '\n' +
        '    - set_fact:\n' +
        '       do_upgrade: "{{ upgrade and maybe_affected|length > 0 }}"\n' +
        '\n' +
        '    - set_fact:\n' +
        '       do_disable: "{{ disable and maybe_affected|length > 0 }}"\n' +
        '\n' +
        '    - block:\n' +
        '      - name: update the packages if they\'re vulnerable\n' +
        '        yum: name={{item.item.name}} state=latest\n' +
        '        when: "{{ item.stdout | version_compare(item.item.version, ' +
        '\'<\') }}"\n' +
        '        with_items: "{{ maybe_affected }}"\n' +
        '        notify: restart sshd\n' +
        '\n' +
        '      - name: get installed packages possibly affected\n' +
        '        shell: rpm -q --qf "%{VERSION}-%{RELEASE}" ' +
        '{{ item.name }}.{{ ansible_architecture }}\n' +
        '        with_items: "{{ vulerable_pkgs }}"\n' +
        '        register: checked_packages\n' +
        '        ignore_errors: true\n' +
        '\n' +
        '      - set_fact:\n' +
        '         maybe_affected: "{{ checked_packages.results|selectattr(\'rc\', ' +
        '\'equalto\', 0)|list }}"\n' +
        '\n' +
        '      - name: check that we updated\n' +
        '        debug: msg="Package {{item.stdout}} is still vulnerable!"\n' +
        '        with_items: "{{ maybe_affected }}"\n' +
        '        when: "{{ item.stdout|version_compare(item.item.version, \'<\') }}"\n' +
        '' +
        '        failed_when: "{{ item.stdout | version_compare(' +
        'item.item.version, \'<\') }}"\n' +
        '\n' +
        '      when: "{{ do_upgrade }}"\n' +
        '\n' +
        '    - block:\n' +
        '      - name: turn kbd interaction off if it\'s on\n' +
        '        replace:\n' +
        '          backup: yes\n' +
        '          dest: /etc/ssh/sshd_config\n' +
        '          regexp: ^(\\s*KbdInteractiveAuthentication\\s+(no|yes))$\n' +
        '        notify: restart sshd\n' +
        '\n' +
        '      - name: turn kbd interaction off if it\'s not explicitly off\n' +
        '        lineinfile:\n' +
        '          backup: yes\n' +
        '          dest: /etc/ssh/sshd_config\n' +
        '          regexp: ^\\s*KbdInteractiveAuthentication\\s+on$\n' +
        '          line: "KbdInteractiveAuthentication no"\n' +
        '          state: present\n' +
        '          insertafter: EOF\n' +
        '        notify: restart sshd\n' +
        '\n' +
        '      - name: updating Insights\n' +
        '        shell: redhat-access-insights\n' +
        '\n' +
        '      when: "{{ do_disable }}"\n' +
        '\n' +
        '  handlers:\n' +
        '    - name: restart sshd\n' +
        '      service: name=sshd state=restarted\n' +
        '      when: "{{ sshd_running.rc == 0 }}"\n',
    Drown: '- hosts: {{hosts}}\n' +
        '  gather_facts: true\n' +
        '  sudo: true\n' +
        '  vars:\n' +
        '    vulnerable_releases:\n' +
        '      \'5\': \'0.9.8e-37.el5_11\'\n' +
        '      \'6\': \'1.0.1e-42.el6_7.2\'\n' +
        '      \'7\': \'1.0.1e-51.el7_2.2\'\n' +
        '\n' +
        '  tasks:\n' +
        '    - name: check for openssl version\n' +
        '      shell: rpm -q --qf "%{VERSION}-%{RELEASE}" openssl-libs.' +
        '{{ ansible_architecture }}\n' +
        '      register: openssl_version\n' +
        '\n' +
        '    - name: check for vulnerable versions\n' +
        '      debug: msg="OpenSSL version {{ openssl_version.stdout }} is ' +
        'vulnerable."\n' +
        '      when: openssl_version.stdout|version_compare(vulnerable_releases' +
        '[ansible_distribution_major_version], \'<=\')\n' +
        '      register: is_vuln\n' +
        '\n' +
        '    - name: update openssl from yum if vulnerable\n' +
        '      yum: name=openssl-libs state=latest update_cache=yes\n' +
        '      when: not is_vuln|skipped\n' +
        '      notify: restart_system\n' +
        '      register: installed\n' +
        '\n' +
        '    - name: check for openssl version\n' +
        '      shell: rpm -q --qf "%{VERSION}-%{RELEASE}" openssl-libs.{{ ' +
        'ansible_architecture }}\n' +
        '      register: openssl_version\n' +
        '      when: not is_vuln|skipped\n' +
        '\n' +
        '    - name: check that we are no longer vulnerable\n' +
        '      debug: msg="OpenSSL version {{ openssl_version.stdout }} is ' +
        'still vulnerable!"\n' +
        '      when: not is_vuln|skipped\n' +
        '      failed_when: openssl_version.stdout|version_compare(vulnerable_' +
        'releases[ansible_distribution_major_version], \'<=\')\n' +
        '\n' +
        '  handlers:\n' +
        '    - name: restart_system\n' +
        '      shell: sleep 2 && shutdown -r now "Ansible updates triggered"\n' +
        '      async: 1\n' +
        '      poll: 0\n' +
        '      ignore_errors: true\n'
};

constantsModule.constant('Playbooks', {
    'bash_injection|VULNERABLE_BASH_DETECTED': {
        filename: 'bash_injection|VULNERABLE_BASH_DETECTED.yml',
        playbook: PlaybookTemplates.UpdatePackages,
        playbook_variables: {
            VULNERABLE_PACKAGE_NAMES: [
                'bash'
            ]
        },
        questions: []
    },
    'CVEs_samba_badlock|SAMBA_CVE_2016_2118_CLIENT': {
        filename: 'CVEs_samba_badlock|SAMBA_CVE_2016_2118_CLIENT.yml',
        playbook: PlaybookTemplates.UpdatePackages,
        playbook_variables: {
            VULNERABLE_PACKAGE_NAMES: [
                'samba-client-libs',
                'samba'
            ]
        },
        questions: []
    },
    'CVEs_samba_badlock|SAMBA_CVE_2016_2118_SERVER': {
        filename: 'CVEs_samba_badlock|SAMBA_CVE_2016_2118_SERVER.yml',
        playbook: PlaybookTemplates.UpdatePackages,
        playbook_variables: {
            VULNERABLE_PACKAGE_NAMES: [
                'samba-client-libs',
                'samba'
            ]
        },
        questions: []
    },
    'CVEs_Top10_2015_flash_plugin|FLASH_CVES_TOP_10_2015': {
        filename: 'CVEs_Top10_2015_flash_plugin|FLASH_CVES_TOP_10_2015.yml',
        playbook: PlaybookTemplates.UpdatePackages,
        playbook_variables: {
            VULNERABLE_PACKAGE_NAMES: [
                'flash-plugin'
            ]
        },
        questions: []
    },
    'CVE_2015_3456|VENOM_CVE_2015_3456': {
        filename: 'CVE_2015_3456|VENOM_CVE_2015_3456.yml',
        playbook: PlaybookTemplates.UpdatePackages,
        playbook_variables: {
            VULNERABLE_PACKAGE_NAMES: [
                'qemu-kvm',
                'qemu-kvm-rhev'
            ]
        },
        questions: []
    },
    'CVE_2015_5600|OPENSSH_CVE_2015_5600': {
        filename: 'max_auth_tries.yml',
        playbook: PlaybookTemplates.MaxAuthTries,
        playbook_variables: {},
        questions: [
            {
                name: 'upgradeOpenSsh',
                description: 'Upgrade OpenSSH',
                choices: [
                    {
                        question: 'Upgrade openssh-server package',
                        value: 'true'
                    }, {
                        question: 'Disable the insecure access method',
                        value: 'false'
                    }
                ]
            }
        ]
    },
    'CVE_2015_7181_2_3_nss_nspr|NSS_NSPR_CVE_2015_7181_2_3': {
        filename: 'CVE_2015_7181_2_3_nss_nspr|NSS_NSPR_CVE_2015_7181_2_3.yml',
        playbook: PlaybookTemplates.UpdatePackages,
        playbook_variables: {
            VULNERABLE_PACKAGE_NAMES: [
                'firefox',
                'thunderbird',
                'nss',
                'nss-util',
                'nspr'
            ]
        },
        questions: []
    },
    'CVE_2015_7501_commons_collections|COMMONS_COLLECTIONS_CVE_2015_7501_IN_USE': {
        filename: 'CVE_2015_7501_commons_collections|COMMONS_COLLECTIONS_CVE_2015' +
            '_7501_IN_USE.yml',
        playbook: PlaybookTemplates.UpdatePackages,
        playbook_variables: {
            VULNERABLE_PACKAGE_NAMES: [
                'jakarta-commons-collections',
                'apache-commons-collections',
                'apache-commons-collections-eap6',
                'rh-java-common-apache-commons-collections'
            ]
        },
        questions: []
    },
    'CVE_2016_0800_openssl_drown|OPENSSL_CVE_2016_0800_DROWN': {
        filename: 'drown.yml',
        playbook: PlaybookTemplates.Drown,
        playbook_variables: {
            VULNERABLE_PACKAGE_NAMES: [
                'openssl-libs',
                'openssl'
            ]
        },
        questions: []
    },
    'CVE_2016_0800_openssl_drown|OPENSSL_CVE_2016_0800_DROWN_INT_LISTENING': {
        filename: 'drown.yml',
        playbook: PlaybookTemplates.Drown,
        playbook_variables: {
            VULNERABLE_PACKAGE_NAMES: [
                'openssl-libs',
                'openssl'
            ]
        },
        questions: []
    },
    'CVE_2016_0800_openssl_drown|OPENSSL_CVE_2016_0800_DROWN_LISTENING': {
        filename: 'drown.yml',
        playbook: PlaybookTemplates.Drown,
        playbook_variables: {
            VULNERABLE_PACKAGE_NAMES: [
                'openssl-libs',
                'openssl'
            ]
        },
        questions: []
    },
    'CVE_2016_0800_openssl_drown|OPENSSL_CVE_2016_0800_DROWN_USED': {
        filename: 'drown.yml',
        playbook: PlaybookTemplates.Drown,
        playbook_variables: {
            VULNERABLE_PACKAGE_NAMES: [
                'openssl-libs',
                'openssl'
            ]
        },
        questions: []
    },
    'CVE_2016_0800_openssl_drown|OPENSSL_CVE_2016_0800_SPECIAL_DROWN': {
        filename: 'drown.yml',
        playbook: PlaybookTemplates.Drown,
        playbook_variables: {
            VULNERABLE_PACKAGE_NAMES: [
                'openssl-libs',
                'openssl'
            ]
        },
        questions: []
    },
    'CVE_2016_0800_openssl_drown|OPENSSL_CVE_2016_0800_SPECIAL_DROWN_LISTEN': {
        filename: 'drown.yml',
        playbook: PlaybookTemplates.Drown,
        playbook_variables: {
            VULNERABLE_PACKAGE_NAMES: [
                'openssl-libs',
                'openssl'
            ]
        },
        questions: []
    },
    'CVE_2016_0800_openssl_drown|OPENSSL_CVE_2016_0800_SPECIAL_DROWN_URGENT': {
        filename: 'drown.yml',
        playbook: PlaybookTemplates.Drown,
        playbook_variables: {
            VULNERABLE_PACKAGE_NAMES: [
                'openssl-libs',
                'openssl'
            ]
        },
        questions: []
    },
    'CVE_2016_0800_openssl_drown|OPENSSL_CVE_2016_0800_SPECIAL_DROWN_USED': {
        filename: 'drown.yml',
        playbook: PlaybookTemplates.Drown,
        playbook_variables: {
            VULNERABLE_PACKAGE_NAMES: [
                'openssl-libs',
                'openssl'
            ]
        },
        questions: []
    },
    'CVE_2016_2315_24_git|GIT_CVE_2016_2315_24': {
        filename: 'CVE_2016_2315_24_git|GIT_CVE_2016_2315_24.yml',
        playbook: PlaybookTemplates.UpdatePackages,
        playbook_variables: {
            VULNERABLE_PACKAGE_NAMES: [
                'git'
            ]
        },
        questions: []
    },
    'CVE_2016_2315_24_git|GIT_DAEMON_CVE_2016_2315_24': {
        filename: 'CVE_2016_2315_24_git|GIT_DAEMON_CVE_2016_2315_24.yml',
        playbook: PlaybookTemplates.UpdatePackages,
        playbook_variables: {
            VULNERABLE_PACKAGE_NAMES: [
                'git',
                'git-daemon'
            ]
        },
        questions: []
    },
    'CVE_2016_3714_imagemagick|IMAGEMAGICK_CVE_2016_3714': {
        filename: 'CVE_2016_3714_imagemagick|IMAGEMAGICK_CVE_2016_3714.yml',
        playbook: PlaybookTemplates.UpdatePackages,
        playbook_variables: {
            VULNERABLE_PACKAGE_NAMES: [
                'ImageMagick'
            ]
        },
        questions: []
    },
    'CVE_2016_5696_kernel|KERNEL_CVE_2016_5696_URGENT': {
        filename: 'CVE_2016_5696_kernel|KERNEL_CVE_2016_5696_URGENT.yml',
        playbook: '- hosts: {{hosts}}\n' +
            '  vars:\n' +
            '    # inputs:\n' +
            '    #   mitigate ((|default(false)|bool)  apply mitigation instead of ' +
            'updateing kernel?\n' +
            '    mitigate: {{mitigate}}\n' +
            '    mitigate_boolean: \'{{ mitigate|default(false)|bool }}\'\n' +
            '  tasks:\n' +
            '    - name: \'set the sysctl net.ipv4.tcp_challenge_ack_limit = 2147483' +
            '647\'\n' +
            '      sysctl: name=net.ipv4.tcp_challenge_ack_limit value=2147483647\n' +
            '      when: mitigate_boolean\n' +
            '    - block:\n' +
            '      - name: update kernel\n' +
            '        yum: name=kernel state=latest\n' +
            '      - name: reboot the machine\n' +
            '        shell: sleep 2 && shutdown -r now \'Ansible triggered reboot\'\n' +
            '        async: 1\n' +
            '        poll: 0\n' +
            '      - name: waiting for server to come back\n' +
            '        local_action: wait_for host={{ inventory_hostname }} port=22 d' +
            'elay=5 state=started\n' +
            '      when: not mitigate_boolean\n' +
            '    - name: run insights\n' +
            '      shell: redhat-access-insights\n' +
            '      changed_when: false\n',
        playbook_variables: {},
        questions: [
            {
                name: 'mitigate',
                description: 'Set the value of mitigate',
                choices: [
                    {
                        question: 'Update kernel to latest version',
                        value: 'false'
                    },
                    {
                        question: 'Mitigate by seting ' +
                            'net.ipv4.tcp_challenge_ack_limit = 2147483',
                        value: 'true'
                    }
                ]
            }
        ]
    },
    'hardening_grub|GRUB_HARDENING_2': {
        filename: 'hardening_grub|GRUB_HARDENING_2.yml',
        playbook: '- hosts: {{hosts}}\n' +
            '  user: root\n' +
            '  vars:\n' +
            '    # inputs:\n' +
            '    users: {{users}}  # are users allowed to read grub.cfg?\n' +
            '    mode_value: \'{{ 0644 if users|default(false)|bool else 0600 }}\'\n' +
            '  tasks:\n' +
            '    - name: \'set the owner and permissions of grub\'s config file to mo' +
            'de={{ mode_value }}\'\n' +
            '      file: state=file path=/boot/grub2/grub.cfg owner=root group=root' +
            ' mode={{ mode_value }}\n' +
            '    - name: run insights\n' +
            '      shell: redhat-access-insights\n' +
            '      changed_when: false\n' +
            '\n',
        playbook_variables: {},
        questions: [
            {
                name: 'users',
                description: 'Set the value of users',
                choices: [
                    {
                        question: 'Prevent normal users from reading grub.cfg',
                        value: 'false'
                    },
                    {
                        question: 'Allow normal users to read grub.cfg',
                        value: 'true'
                    }
                ]
            }
        ]
    },
    'heartbleed|HAS_HEARTBLEED': {
        filename: 'heartbleed|HAS_HEARTBLEED.yml',
        playbook: PlaybookTemplates.UpdatePackages,
        playbook_variables: {
            VULNERABLE_PACKAGE_NAMES: [
                'openssl*'
            ]
        },
        questions: []
    },
    'heartbleed|HAS_HEARTBLEED_DEMO': {
        filename: 'heartbleed|HAS_HEARTBLEED_DEMO.yml',
        playbook: PlaybookTemplates.UpdatePackages,
        playbook_variables: {
            VULNERABLE_PACKAGE_NAMES: [
                'openssl*'
            ]
        },
        questions: []
    },
    'heartbleed|HEARTBLEED_ACCESSIBLE': {
        filename: 'heartbleed|HEARTBLEED_ACCESSIBLE.yml',
        playbook: PlaybookTemplates.UpdatePackages,
        playbook_variables: {
            VULNERABLE_PACKAGE_NAMES: [
                'openssl*'
            ]
        },
        questions: []
    },
    'rhns_ca_cert_expired|RHNS_CA_CERT_EXPIRED': {
        filename: 'rhns_ca_cert_expired|RHNS_CA_CERT_EXPIRED.yml',
        playbook: PlaybookTemplates.UpdatePackages,
        playbook_variables: {
            VULNERABLE_PACKAGE_NAMES: [
                'rhn-client-tools'
            ]
        },
        questions: []
    },
    'vsftpd_local_enable|VSFTPD_LOCAL_ENABLED': {
        filename: 'vsftpd_local_enable|VSFTPD_LOCAL_ENABLED.yml',
        playbook: '- hosts: {{hosts}}\n' +
            '  tasks:\n' +
            '    - name: set local_enable=NO in /etc/vsftpd/vsftpd.conf\n' +
            '      lineinfile:\n' +
            '        backup: yes\n' +
            '        dest: /etc/vsftpd/vsftpd.conf\n' +
            '        line: \'local_enable=NO\'\n' +
            '        regexp: ^\\s*local_enable\n' +
            '        state: present\n' +
            '    - name: restart vsftpd\n' +
            '      service: name=vsftpd state=restarted\n' +
            '    - name: run insights\n' +
            '      shell: redhat-access-insights\n' +
            '      changed_when: false\n',
        playbook_variables: {},
        questions: []
    },
    'vsftpd_poodle|VSFTPD_POODLE': {
        filename: 'vsftpd_poodle|VSFTPD_POODLE.yml',
        playbook: '- hosts: {{hosts}}\n' +
            '  tasks:\n' +
            '    - name: set ssl_sslv3=NO in /etc/vsftpd/vsftpd.conf\n' +
            '      lineinfile:\n' +
            '        backup: yes\n' +
            '        dest: /etc/vsftpd/vsftpd.conf\n' +
            '        line: \'ssl_sslv3=NO\'\n' +
            '        regexp: ^\\s*ssl_sslv3\n' +
            '        state: present\n' +
            '    - name: restart vsftpd\n' +
            '      service: name=vsftpd state=restarted\n' +
            '    - name: run insights\n' +
            '      shell: redhat-access-insights\n' +
            '      changed_when: false\n',
        playbook_variables: {},
        questions: []
    },
    NoRuleSelected: {
        filename: 'no_rule_selected_playbook.yml',
        playbook: '---\n' +
            '# This playbook is used when no rule has been selected.\n\n' +
            '# Answer to No Rule Selected Question One: {{noRuleSelectedOne}}\n' +
            '# Answer to No Rule Selected Question Two: {{noRuleSelectedTwo}}\n' +
            '  - name: test for rhel\n' +
            '    hosts: {{hosts}}\n' +
            '    tasks:\n' +
            '    - name: echo if rhel\n' +
            '      shell: echo "this is a Red Hat Enterprise Linux system"\n' +
            '      when: ansible_os_family == "RedHat" and {{includeRhel}}\n',
        playbook_variables: {},
        questions: [
            {
                name: 'noRuleSelectedOne',
                description: 'No Rule Selected Question One',
                choices: [
                    {
                        question: 'Answer Yes to No Rule Selected Question One',
                        value: 'true'
                    }, {
                        question: 'Answer No to No Rule Selected Question One',
                        value: 'false'
                    }
                ]
            }, {
                name: 'noRuleSelectedTwo',
                description: 'No Rule Selected Question Two',
                choices: [
                    {
                        question: 'Answer Yes to No Rule Selected Question Two',
                        value: 'true'
                    }, {
                        question: 'Answer No to No Rule Selected Question Two',
                        value: 'false'
                    }
                ]
            }
        ]
    },
    NoRuleInScope: {
        filename: 'no_rule_in_scope_playbook.yml',
        playbook: '---\n' +
            '# This playbook is used when no rule has is in scope\n\n' +
            '# Answer to No Rule in Scope Question One: {{noRuleInScopeOne}}\n' +
            '# Answer to No Rule in Scope Question Two: {{noRuleInScopeTwo}}\n' +
            '  - name: test for rhel\n' +
            '    hosts: {{hosts}}\n' +
            '    tasks:\n' +
            '    - name: echo if rhel\n' +
            '      shell: echo "this is a Red Hat Enterprise Linux system"\n' +
            '      when: ansible_os_family == "RedHat" and {{includeRhel}}\n',
        playbook_variables: {},
        questions: [
            {
                name: 'noRuleInScopeOne',
                description: 'No Rule in Scope Question One',
                choices: [
                    {
                        question: 'Answer Yes to No Rule in Scope Question One',
                        value: 'true'
                    }, {
                        question: 'Answer No to No Rule in Scope Question One',
                        value: 'false'
                    }
                ]
            }, {
                name: 'noRuleInScopeTwo',
                description: 'No Rule in Scope Question Two',
                choices: [
                    {
                        question: 'Answer Yes to No Rule in Scope Question Two',
                        value: 'true'
                    }, {
                        question: 'Answer No to No Rule in Scope Question Two',
                        value: 'false'
                    }
                ]
            }
        ]
    },
    NoPlaybookForRule: {
        filename: 'no_playbook_for_rule.yml',
        playbook: '---\n' +
            '# This is used when no playbook has been implemented for a rule\n\n' +
            '# Answer to No Playbook for Rule Question One: {{noPlaybookOne}}\n' +
            '# Answer to No Playbook for Rule Question Two: {{noPlaybookTwo}}\n' +
            '  - name: test for rhel\n' +
            '    hosts: {{hosts}}\n' +
            '    tasks:\n' +
            '    - name: echo if rhel\n' +
            '      shell: echo "this is a Red Hat Enterprise Linux system"\n' +
            '      when: ansible_os_family == "RedHat" and {{includeRhel}}\n',
        playbook_variables: {},
        questions: [
            {
                name: 'noPlaybookOne',
                description: 'No Playbook for Rule Question One',
                choices: [
                    {
                        question: 'Answer Yes to No Playbook for Rule Question One',
                        value: 'true'
                    }, {
                        question: 'Answer No to No Playbook for Rule Question One',
                        value: 'false'
                    }
                ]
            }, {
                name: 'noPlaybookTwo',
                description: 'No Playbook for Rule Question Two',
                choices: [
                    {
                        question: 'Answer Yes to No Playbook for Rule Question Two',
                        value: 'true'
                    }, {
                        question: 'Answer No to No Playbook for Rule Question Two',
                        value: 'false'
                    }
                ]
            }
        ]
    }
});
