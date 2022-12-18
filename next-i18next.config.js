module.exports = {
    debug: process.env.NODE_ENV === 'development',
    i18n: {
        defaultLocale: 'en',
        locales: ['en', 'ja'],
    },
    reloadOnPrerender: process.env.NODE_ENV === 'development',
}
