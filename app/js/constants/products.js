'use strict';

var constantsModule = require('./');

constantsModule.constant('Products', {
    rhel: {
        shortName: 'RHEL Server',
        fullName: 'Red Hat Enterprise Linux',
        code: 'rhel',
        icon: 'fa-linux',
        roles: {
            host: {
                code: 'host',
                icon: 'fa-linux',
                fullName: 'Red Hat Enterprise Linux System',
                shortName: 'System'
            }
        }
    },
    rhev: {
        shortName: 'RHV',
        fullName: 'Red Hat Virtualization',
        code: 'rhev',
        icon: '',
        roles: {
            cluster: {
                code: 'cluster',
                fullName: 'Red Hat Virtualization Deployment',
                shortName: 'Deployment',
                icon: 'fa-object-group'
            },
            manager: {
                code: 'manager',
                fullName: 'Red Hat Virtualization Manager',
                shortName: 'Manager',
                icon: 'fa-building'
            },
            hypervisor: {
                code: 'hypervisor',
                fullName: 'Red Hat Virtualization Hypervisor',
                shortName: 'Hypervisor',
                icon: 'fa-server'
            }
        }
    },
    ocp: {
        shortName: 'OCP',
        fullName: 'Openshift Compute Platform',
        code: 'ocp',
        icon: '',
        roles: {
            cluster: {
                code: 'cluster',
                fullName: 'Red Hat Openshift Compute Platform',
                shortName: 'Deployment',
                icon: 'fa-cubes'
            },
            master: {
                code: 'master',
                fullName: 'Red Hat Openshift Compute Platform Master',
                shortName: 'Master',
                icon: 'fa-home'
            },
            node: {
                code: 'node',
                fullName: 'Red Hat Openshift Compute Platform Node',
                shortName: 'Node',
                icon: 'fa-cogs'
            }
        }
    },
    osp: {
        shortName: 'OSP',
        fullName: 'Red Hat OpenStack Platform',
        code: 'osp',
        icon: '',
        roles: {
            cluster: {
                code: 'cluster',
                fullName: 'Red Hat OpenStack Platform Deployment',
                shortName: 'Deployment',
                icon: 'fa-cubes'
            },
            director: {
                code: 'director',
                fullName: 'Red Hat OpenStack Platform Director',
                shortName: 'Director',
                icon: 'fa-home'
            },
            compute: {
                code: 'compute',
                fullName: 'Red Hat OpenStack Platform Compute Node',
                shortName: 'Compute',
                icon: 'fa-cogs'
            },
            controller: {
                code: 'controller',
                fullName: 'Red Hat OpenStack Platform Controller Node',
                shortName: 'Controller',
                icon: 'fa-wrench'
            }
        }
    },
    docker: {
        shortName2: 'Container',
        shortName: 'Containers',
        fullName: 'Red Hat Containers',
        code: 'docker',
        icon: '',
        roles: {
            host: {
                code: 'host',
                fullName: 'Red Hat Container Host',
                shortName: 'Host',
                icon: 'fa-ship'
            },
            image: {
                code: 'image',
                fullName: 'Red Hat Container Image',
                shortName: 'Image',
                icon: 'fa-archive'
            },
            container: {
                code: 'container',
                fullName: 'Red Hat Container',
                shortName: 'Container',
                icon: 'fa-cube'
            }
        }
    }
});
