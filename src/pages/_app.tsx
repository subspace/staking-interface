import { ColorModeScript } from '@chakra-ui/color-mode'
import { ChakraProvider } from '@chakra-ui/react'
import { UserConfig, appWithTranslation } from 'next-i18next'
import { AppProps } from 'next/app'
import React from 'react'
import nextI18NextConfig from '../../next-i18next.config.js'
import { Layout } from '../components/layout'
import Header from '../config'
import { useMobile } from '../hooks/useMobile'
import theme from '../styles/theme'

const App: React.FC<AppProps> = ({ Component, pageProps = { title: 'Subspace Faucet' } }) => {
  useMobile()

  return (
    <ChakraProvider theme={theme}>
      <ColorModeScript initialColorMode={theme.config.initialColorMode} />
      <Header title={pageProps.title} />
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </ChakraProvider>
  )
}

export default appWithTranslation(App, nextI18NextConfig as unknown as UserConfig)
