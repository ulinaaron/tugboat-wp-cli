export default {
  retainLines: true,
  presets: [
    ['@babel/preset-env', {
      targets: {
        node: '8',
      },
    }],
  ],
  plugins: [],
};
