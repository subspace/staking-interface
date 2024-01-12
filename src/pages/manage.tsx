import { Box, Center, HStack, Heading, Text } from '@chakra-ui/react'
import { useTranslation } from 'next-i18next'
import React, { useEffect } from 'react'
import { ConnectWallet } from '../components/buttons'
import { Wallet } from '../components/icons'
import { OperatorsCards } from '../components/operatorsCards'
import { OperatorsList } from '../components/operatorsList'
import { OperatorsTotal } from '../components/operatorsTotal'
import { ViewSelector } from '../components/viewSelector'
import { OperatorListType, headingStyles, pageStyles } from '../constants'
import { useOnchainData } from '../hooks/useOnchainData'
import { useWallet } from '../hooks/useWallet'
import { useExtension } from '../states/extension'
import { useView } from '../states/view'

const Page: React.FC = () => {
  const { t } = useTranslation()
  const { subspaceAccount } = useExtension()
  const { handleConnect } = useWallet()
  const { handleOnchainData } = useOnchainData()
  const { operatorsListType } = useView()

  useEffect(() => {
    handleOnchainData()
  }, [handleOnchainData, subspaceAccount])

  return (
    <Box {...pageStyles}>
      <HStack>
        <Wallet />
        <Heading {...headingStyles.page}>{t('manage.header')}</Heading>
      </HStack>
      {subspaceAccount ? (
        <>
          <OperatorsTotal operatorOwner={subspaceAccount} />
          <ViewSelector />
          {operatorsListType === OperatorListType.CARD_GRID && (
            <OperatorsCards operatorOwner={subspaceAccount} fromManage />
          )}
          {operatorsListType === OperatorListType.LIST && <OperatorsList operatorOwner={subspaceAccount} fromManage />}
        </>
      ) : (
        <Box mt='4'>
          <Center>
            <Text color='#6C6666' pt='2' pb='2'>
              {t('action.pleaseConnectWallet')}
            </Text>
          </Center>
          <Center>
            <ConnectWallet onClick={handleConnect} />
          </Center>
        </Box>
      )}
    </Box>
  )
}

export async function getStaticProps() {
  return { props: { title: 'Subspace Staking Interface - Manage Stake' } }
}

export default Page
