import {
  ClockIcon,
  SpinnerIcon,
  CheckIcon,
  PauseIcon,
  WarningIcon,
  PlayIcon,
  TimesIcon,
  ShieldAltIcon,
  CircleIcon,
} from "react-line-awesome";

export const COLOR_MAP = [
  "#ff7f0e",
  "#2980b9",
  "#82ca9d",
  "#8884d8",
  "#2c3e50",
  "#ffc658",
  "#1abc9c",
  "#3498db",
  "#9b59b6",
  "#2ecc71",
  "#f1c40f",
  "#e74c3c",
  "#34495e",
  "#e67e22",
  "#16a085",
  "#8e44ad",
  "#2980b9",
  "#27ae60",
];

export const CHART_TYPE = {
  BAR: { value: "Bar", label: "Bar Chart" },
  LINE: { value: "Line", label: "Line Chart" },
  AREA: { value: "Area", label: "Area Chart" },
};

export const DASHBOARD_EDIT_DROPDOWN = {
  APP: { value: "AppDev", label: "App Developer" },
  COST: { value: "CostMan", label: "Cost Manager" },
};

// Todo: Consider expose this setting to cloud_providers.yml
export const MONITORING_MICROSERVICE = {
  vm: {},
  docker: {
    msUri: "CommandDefinition/KUBERNETES/Generic/k8_services_list.xml",
    msName: "k8_services_list",
    searchQuery: "LoadBalancer",
    variableName: {
      endpoint: "ingress.0.endpoints.0.link",
    },
    services: [
      {
        label: "Prometheus",
        objectId: "prometheus-service-loadbalancer",
      },
      {
        label: "Grafana",
        searchQuery: "LoadBalancer",
        objectId: "grafana-service-loadbalancer",
        iframe: true,
      },
      {
        label: "Alert Manager",
        objectId: "alertmanager-service-loadbalancer",
      },
    ],
  },
};

export const MONITORING_DATA = {
  LAST_HOUR: { value: "hour", label: "Last hour" },
  LAST_DAY: { value: "day", label: "Last day" },
  LAST_WEEK: { value: "week", label: "Last week" },
  LAST_MONTH: { value: "month", label: "Last month" },
  LAST_YEAR: { value: "year", label: "Last year" },
};

export const MONITORING_PERIODS = {
  DAILY: { value: "DAILY", label: "Daily", format: "MMM dd yyyy" },
  MONTHLY: { value: "MONTHLY", label: "Monthly", format: "MMM yyyy" },
};

export const COST_GRAPH = {
  INITIAL: [new Date().setMonth(new Date().getMonth() - 11), new Date()],
  MIN_DATE: new Date().setMonth(new Date().getMonth() - 11),
  MAX_DATE: new Date(),
};

export const PROCESS_NAME = {
  TEAR_DOWN: "Tear Down",
};

export const ENVIRONMENT_VARIABLES_NAME = {
  CLUSTER_ME_ID: "cluster_me_ext_ref",
};

export const DEPLOYMENT_VARIABLES_NAME = {
  NAME: "deployment_name",
  DESCRIPTION: "deployment_desc",
  IP_ADDRESS: "ip_address",
  ENVIRONMENT_MANAGED_ENTITY: "env_infrastructure_me",
  APPLICATION: "apps_to_deploy",
  APPLICATION_NAME: "app_name",
  APPLICATION_DESCRIPTION: "short_description",
  APPLICATION_LOGO: "logo_url",
  APPLICATION_SLUG: "app_image",
  APPLICATION_VERSION: "version",
  APPLICATION_ACCESS: "app_access",
  APPLICATION_REPLICAS: "app_replicas",
};

export const DEPLOYMENT_ESTIMATE_GRANULARITY = {
  HOURLY: {
    value: "HOURLY",
    label: "Hourly",
    unit: "Hour",
    hour: 1,
  },
  MONTHLY: {
    value: "MONTHLY",
    label: "Monthly",
    unit: "Month",
    hour: 730,
  },
  ANNUAL: {
    value: "ANNUAL",
    label: "Annual",
    unit: "Year",
    hour: 8760,
  },
};

export const ENVIRONMENT_COMMUNITY_ACCOUNT = {
  count: 5,
};

export const MAXIMUM_USER_LIMIT = {
  count: 3,
};

export const SECURITY_VARIABLES_NAME = {
  SERVICE_ID: "deployment_service_id",
  ROW: "containers",
  ROW_NAME: "name",
  ROW_STATUS: "scan_status",
  ROW_VULNERABILITIES: "vulnerabilities",
  ROW_RESULT: "vulnerabilities_json_file",
  RESULT_TYPE: "type",
};

export const SECURITY_SEVERITIES = {
  CRITICAL: {
    id: "critical",
    label: "Critical",
    color: "#B9344D",
    countKey: "critical_count",
  },
  HIGH: {
    id: "high",
    label: "High",
    color: "#DE915A",
    countKey: "high_count",
  },
  MEDIUM: {
    id: "medium",
    label: "Medium",
    color: "#DCA848",
    countKey: "medium_count",
  },
  LOW: {
    id: "low",
    label: "Low",
    color: "#447BEE",
    countKey: "low_count",
  },
  INFO: {
    id: "info",
    label: "Informational",
    color: "#7288BA",
    countKey: "info_count",
  },
};

export const WORKFLOW_STATUS = {
  NONE: {
    id: "none",
    name: "Pending",
    securityLabel: "Not Scanned",
    icon: ClockIcon,
    iconBig: ClockIcon,
    iconSecurity: CircleIcon,
    status: "NONE",
    color: "#B2BCCE",
    barSize: 10,
    actions: [],
    deployActions: [],
  },
  RUNNING: {
    id: "running",
    name: "Running...",
    securityLabel: "Scanning",
    icon: SpinnerIcon,
    iconBig: SpinnerIcon,
    iconSecurity: CircleIcon,
    status: "RUNNING",
    color: "#327BF6",
    barSize: 10,
    actions: ["PAUSE"],
    deployActions: [],
  },
  FAIL: {
    id: "fail",
    name: "Failed",
    securityLabel: "Failed",
    icon: TimesIcon,
    iconBig: TimesIcon,
    iconSecurity: CircleIcon,
    status: "FAIL",
    color: "#db2e14",
    barSize: 10,
    isResult: true,
    actions: ["RESUME"],
    deployActions: [
      {
        name: "Play",
        icon: PlayIcon,
        processName: "Restart APP",
      },
    ],
  },
  WARNING: {
    id: "warning",
    name: "Warning",
    securityLabel: "Warning",
    icon: WarningIcon,
    iconBig: WarningIcon,
    iconSecurity: CircleIcon,
    status: "WARNING",
    color: "#f5b622",
    barSize: 10,
    isResult: true,
    actions: [],
    deployActions: [],
  },
  PAUSE: {
    id: "pause",
    name: "Paused",
    securityLabel: "Paused",
    icon: PauseIcon,
    iconBig: PauseIcon,
    iconSecurity: CircleIcon,
    status: "PAUSE",
    color: "#80a2d9",
    barSize: 10,
    actions: ["RESTART"],
    deployActions: [
      {
        name: "Play",
        icon: PlayIcon,
        processName: "Resume APP",
      },
    ],
  },
  ENDED: {
    id: "ended",
    name: "Complete",
    securityLabel: "Passed",
    icon: CheckIcon,
    iconBig: CheckIcon,
    iconSecurity: ShieldAltIcon,
    status: "ENDED",
    color: "#5DBA84",
    barSize: 2,
    isResult: true,
    actions: [],
    deployActions: [
      {
        name: "Pause",
        icon: PauseIcon,
        processName: "Pause APP",
      },
    ],
  },
};

export const workflowStatus = Object.values(WORKFLOW_STATUS);

export const QUICK_DEPLOYMENT_STEPS = {
  CLOUD_CONNECTION_STEP: 0,
  ENVIRONMENT_STEP: 1,
  DEPLOYMENT_STEP: 2,
  DEPLOY_STEP: 3,
  COMPLETION_STEP: 4,
};

export const ENVIRONMENT_SUMMARY_CARDS = {
  SECURITY: "Image Scan",
  WEBAPPSECURITY: "Web App Scan",
  DEPLOYMENTS: "Deployments",
  USERS: "Users",
};

export const DASHBOARD_SUMMARY_CARDS = {
  CLOUDCONNECTIONS: "Cloud Connections",
  ENVIRONMENTS: "Environments",
  USERS: "Users",
  COSTS: "Current Month Costs",
};

export const quickDeploymentStatus = {
  COMPLETED: {
    color: "#5DBA84",
    icon: CheckIcon,
    label: "Completed",
  },
};

export const INFRASTRUCTURES = {
  PROVIDER: "PROVIDER",
  REGION: "REGION",
  APP_DEPLOYMENT: "APP_DEPLOYMENT",
};

export const RESOURCES = {
  K8_CLUSTER: "K8_CLUSTER",
};

export const ENV_DESIGNER = {
  INFRASTRUCTURES,
  RESOURCES,
};
