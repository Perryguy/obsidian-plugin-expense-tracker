module.exports = {
    module: {
      rules: [
        {
          test: /\.(js|jsx|ts|tsx)$/,
          exclude: /node_modules/,
          use: {
            loader: "babel-loader",
            options: {
              presets: [
                "@babel/preset-env",
                "@babel/preset-react",
                "@babel/preset-typescript",
              ],
            },
          },
        },
        // ... other rules
      ],
    },
    resolve: {
      extensions: [".js", ".jsx", ".ts", ".tsx"],
    },
  };
  