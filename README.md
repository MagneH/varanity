# Varan boilerplate

A fully fledged offline-first PWA boilerplate for React and TypeScript with server side rendering using [varan](https://github.com/ersims/varan). 

Note that these badges are set up for the [source boilerplate master branch](https://github.com/ersims/varan-boilerplate/tree/master) and will not be correct in your own fork of the boilerplate.

[![CircleCI](https://img.shields.io/circleci/project/github/ersims/varan-boilerplate/master.svg)](https://circleci.com/gh/ersims/varan-boilerplate/tree/master)
[![Codecov branch](https://img.shields.io/codecov/c/github/ersims/varan-boilerplate/master.svg)](https://codecov.io/gh/ersims/varan-boilerplate/tree/master)
[![David](https://img.shields.io/david/ersims/varan-boilerplate/master.svg)](https://david-dm.org/ersims/varan-boilerplate/master)
[![Known Vulnerabilities](https://snyk.io/test/github/ersims/varan-boilerplate/master/badge.svg)](https://snyk.io/test/github/ersims/varan-boilerplate/master)
[![renovate-app badge](https://img.shields.io/badge/renovate-app-blue.svg)](https://renovateapp.com/)
[![license](https://img.shields.io/github/license/ersims/varan-boilerplate.svg)](https://github.com/ersims/varan-boilerplate/blob/master/LICENSE.md)

## Usage

### Development

Start a development server with hot reloading

```bash
npm run watch
```

### Production

Build a production build

```bash
npm run build
```

Start the production server

```bash
npm start
```

## Customize build

### Browser support

This project uses [browserslist](https://github.com/browserslist/browserslist). By default the browser support list is defined in the `package.json` file, but you can use a `.browserlistrc` file if you prefer.

### Webpack

You can create or bring your own webpack configuration files, though it is recommended to extend the default `varan` webpack configurations to take advantage of useful defaults and optimizations. See [varan documentation](https://github.com/ersims/varan) for more information.

### License

  [MIT](LICENSE.md)
