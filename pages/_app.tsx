import { ChakraProvider } from '@chakra-ui/react'

import { appWithTranslation } from 'next-i18next'
import type { AppProps } from 'next/app'
import Head from 'next/head'
import Script from 'next/script'
import MainLayout from '../components/layout/mainLayout'
import '../styles/globals.css'

function App({ Component, pageProps, router }: AppProps) {
  const path = router.asPath
  const isIndexable = /^\/(ja|en)\/(jp|us)\/techs\/comparison(\/|$)/.test(path)

  return (
    <ChakraProvider>
      <Head>
        {!isIndexable && <meta name="robots" content="noindex, nofollow" />}
        <link rel="icon" href="/favicon.ico" />
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="manifest" href="/manifest.webmanifest" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
      </Head>
      <Script
        src="https://uma.kyokko.work/uma"
        data-website-id="3dfda713-1111-40e3-9838-3432773f251d"
      ></Script>

      <MainLayout>
        <Component {...pageProps} />
      </MainLayout>
    </ChakraProvider>
  )
}

export default appWithTranslation(App)
