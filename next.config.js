// next.config.js
const withSass = require("@zeit/next-sass");
const withPlugins = require("next-compose-plugins");

const nextConfig = {
  webpack: config => {
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
                  `
          }
        }
      ]
    });
    return config;
  }
};

module.exports = withPlugins([withSass], nextConfig);
