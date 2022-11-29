export const delegationProfiles = {
  environments: {
    general: {
      create: {
        name: 'create',
        access: false
      },
      tearDown: {
        name: 'tearDown',
        access: true
      },
      delete: {
        name: 'delete',
        access: false
      },
      access: true
    },

  },
  deployments: {
    general: {
      create: {
        name: 'create',
        access: false
      },
      action: {
        name: 'action',
        access: false
      },
      access: true
    },

  },
  applications: {
    dockerHub: {
      view: {
        name: 'view',
        access: true
      },
      access: true
    },
    virtualMachine: {
      view: {
        name: 'view',
        access: false
      },
      access: false
    },
    access: true
  },

  insights: {
    cost: {
      view: {
        name: 'view',
        access: true
      },
      access: true
    },
  },

  governance: {
    auditLogs: {
      view: {
        name: 'view',
        access: false
      },
      access: false
    },
  },
}
