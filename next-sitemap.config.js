const fs = require('fs')
const path = require('path')

/** @type {import("next-sitemap").IConfig} */
module.exports = {
  siteUrl: process.env.SITE_URL || 'https://lib.kyokko.work',
  outDir: './.next',
  // ...other options
  additionalPaths: async () => {
    return await generateSSRPaths()
  },
}

const generateSSRPaths = async () => {
  const paths = []
  const markets = ['us', 'jp']
  markets.flatMap((market) => {
    return fs
      .readdirSync(`./data/${market}/techs/companies`)
      .map((file) => {
        return file.replace('.json', '')
      })
      .map((file) => {
        paths.push({ loc: `/ja/${market}/techs/companies/${file}` })
      })
  })

  markets.flatMap((market) => {
    return fs.readdirSync(`./data/${market}/techs/techs`).map((dir) => {
      const files = fs.readdirSync(
        path.join(`./data/${market}/techs/techs`, dir)
      )
      const json = JSON.parse( fs.readFileSync(path.join(`./data/${market}/techs/techs/${dir}`, files[0]), 'utf8'))
      const otherInitials = json.otherInitials

      otherInitials.map((initial) => {
        paths.push({ loc: `/ja/${market}/techs/${dir}/${initial}` })
      })
    })
  })

  return paths
}
