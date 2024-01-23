module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      'expo-router/babel',
      ["@babel/plugin-proposal-class-properties"]
    ],
    assumptions: {
      setPublicClassFields: true,
      privateFieldsAsProperties: true,
    },
    overrides: [
      {
        test: fileName => !fileName.includes('node_modules'),
        plugins: [[require('@babel/plugin-proposal-class-properties'), { loose: false }]],
      },
    ],
  };
};
