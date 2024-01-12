const path = require('path')
const intervalPlural = require('i18next-intervalplural-postprocessor')

module.exports = {
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'de'],
    use: [intervalPlural],
    serializeConfig: false
  },
  localePath: path.resolve('./public/locales'),
  reloadOnPrerender: process.env.NODE_ENV === 'development'
}
