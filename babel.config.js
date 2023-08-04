module.exports = {
  retainLines: true,
  presets: [
    ['@babel/preset-env', {
      targets: {
        node: '8',
      },
      modules: 'cjs'
    }],
  ],
  plugins: [],
};
