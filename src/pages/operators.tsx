import { Box, HStack, Heading } from '@chakra-ui/react'
import { useTranslation } from 'next-i18next'
import dynamic from 'next/dynamic'
import React, { useEffect } from 'react'
import { Wallet } from '../components/icons'
import { OperatorsCards } from '../components/operatorsCards'
import { OperatorsList } from '../components/operatorsList'
import { OperatorsTotal } from '../components/operatorsTotal'
import { ViewSelector } from '../components/viewSelector'
import { OperatorListType, headingStyles, pageStyles } from '../constants'
import { useOnchainData } from '../hooks/useOnchainData'
import { useView } from '../states/view'

const PieGraph = dynamic(() => import('../components/pieGraph').then((m) => m.PieGraph), { ssr: false })

const Page: React.FC = () => {
  const { t } = useTranslation()
  const { handleOnchainData } = useOnchainData()
  const { operatorsListType } = useView()

  useEffect(() => {
    handleOnchainData()
  }, [handleOnchainData])

  return (
    <Box {...pageStyles}>
      <HStack>
        <Wallet />
        <Heading {...headingStyles.page}>{t('operators.header')}</Heading>
      </HStack>
      <OperatorsTotal />
      <PieGraph />
      <ViewSelector />
      {operatorsListType === OperatorListType.CARD_GRID && <OperatorsCards />}
      {operatorsListType === OperatorListType.LIST && <OperatorsList />}
    </Box>
  )
}

export async function getStaticProps() {
  return { props: { title: 'Subspace Staking Interface - Operators' } }
}

export default Page
