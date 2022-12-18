import { ChakraProvider } from '@chakra-ui/react'

import { appWithTranslation } from 'next-i18next'
import type { AppProps } from 'next/app'
import '../styles/globals.css'

function App({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider>
      <Component {...pageProps} />
    </ChakraProvider>
  )
}

export default appWithTranslation(App)
