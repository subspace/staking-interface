import { Box, Grid, GridItem, Heading, Text } from '@chakra-ui/react'
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import dynamic from 'next/dynamic'
import Image from 'next/image'
import Link from 'next/link'
import React, { useEffect } from 'react'
import { ConnectWallet, FormButton } from '../components/buttons'
import { Intro } from '../components/intro'
import { EXTERNAL_ROUTES, ROUTES, headingStyles, pageStyles, textStyles } from '../constants'
import { useOnchainData } from '../hooks/useOnchainData'
import { useWallet } from '../hooks/useWallet'
import { useExtension } from '../states/extension'

const PieGraph = dynamic(() => import('../components/pieGraph').then((m) => m.PieGraph), { ssr: false })

const Page: React.FC = () => {
  const { t } = useTranslation()
  const { subspaceAccount } = useExtension()
  const { extension, handleConnect } = useWallet()
  const { handleOnchainData } = useOnchainData()

  useEffect(() => {
    handleOnchainData()
  }, [handleOnchainData, subspaceAccount])

  return (
    <Box {...pageStyles}>
      <Intro />
      <Box mt='66px'>
        <Box mt='4'>
          <Grid templateColumns={['repeat(1, 1fr)', 'repeat(2, 1fr)']} gap={[2, 4, 6]}>
            <GridItem>
              <Heading {...headingStyles.page}>{t('index.setupNode.header')}</Heading>
              <Link href={EXTERNAL_ROUTES.OPERATORS_DOCS} target='_blank'>
                <Text {...textStyles.link}>{t('index.setupNode.linkText')}</Text>
              </Link>
              <Image src='/images/SetupANode.png' width='561' height='326' alt={t('index.setupNode.alt')} />
            </GridItem>
            <GridItem>
              <PieGraph small />
            </GridItem>
          </Grid>
        </Box>

        {extension.data ? (
          <Link href={ROUTES.REGISTER}>
            <FormButton>{t('action.next')}</FormButton>
          </Link>
        ) : (
          <Box mt='8'>
            <ConnectWallet onClick={handleConnect} />
          </Box>
        )}
      </Box>
    </Box>
  )
}

export const getStaticProps = async ({ locale = 'en' }: { locale: string }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
      title: 'Subspace Staking Interface'
    }
  }
}

export default Page
