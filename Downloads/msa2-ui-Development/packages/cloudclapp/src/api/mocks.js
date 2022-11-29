// per hour
export const priceTable = {
  aws: {
    eks: [
      {
        parameters: {
          environment: {
            aws_region: "*",
          },
        },
        price: 0.1,
      },
      {
        parameters: {
          environment: {
            aws_region: "*",
          },
          application: {
            "apps_to_deploy.0.app_image": "*",
          },
        },
        price: 0,
      },
    ],
    // ec2: [
    //   {
    //     parameters: {
    //       environment: {
    //         aws_region: "*",
    //       },
    //     },
    //     price: 0,
    //   },
    //   {
    //     parameters: {
    //       environment: {
    //         aws_region: "*",
    //       },
    //       application: {
    //         "apps_to_deploy.0.app_image": "*",
    //       },
    //     },
    //     price: 10,
    //   },
    // ],
  },
  azure: {
    aks: [
      {
        parameters: {
          environment: {
            aws_region: "*",
          },
        },
        discount: [
          {
            granularity: "ANNUAL",
            amount: 1,
            rate: 0.48,
          },
          {
            granularity: "ANNUAL",
            amount: 3,
            rate: 0.65,
          },
        ],
        price: 0.1,
      },
      {
        parameters: {
          environment: {
            aws_region: "*",
          },
          application: {
            "apps_to_deploy.0.app_image": "*",
          },
        },
        price: 0,
      },
    ],
  },
};
