// next.config.js

// eslint-disable-next-line no-undef
module.exports = {
  webpack: (config) => {
    config.module.rules.push({
      test: /\.svg$/,
      use: [
        {
          loader: "@svgr/webpack",
          options: {
            svgo: false,
            template: (
              { template },
              opts,
              { imports, componentName, props, jsx, exports }
            ) => template.ast`
                    ${imports}
                    const ${componentName} = (${props}) => {
                      return ${jsx};
                    };
                    export default ${componentName};
                  `,
          },
        },
      ],
    });
    return config;
  },
};
