import { Box, HStack, Heading } from '@chakra-ui/react'
import { GetStaticPaths } from 'next'
import { useTranslation } from 'next-i18next'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'
import React, { useEffect, useMemo } from 'react'
import { Wallet } from '../../components/icons'
import { OperatorsCards } from '../../components/operatorsCards'
import { OperatorsList } from '../../components/operatorsList'
import { OperatorsTotal } from '../../components/operatorsTotal'
import { ViewSelector } from '../../components/viewSelector'
import { OperatorListType, headingStyles, pageStyles } from '../../constants'
import { useOnchainData } from '../../hooks/useOnchainData'
import { useView } from '../../states/view'

const PieGraph = dynamic(() => import('../../components/pieGraph').then((m) => m.PieGraph), { ssr: false })

const Page: React.FC = () => {
  const { t } = useTranslation()
  const { handleOnchainData } = useOnchainData()
  const { query } = useRouter()
  const { operatorsListType } = useView()

  useEffect(() => {
    handleOnchainData()
  }, [handleOnchainData])

  const operatorOwner = useMemo(() => {
    if (query.operatorOwner && typeof query.operatorOwner === 'string') return query.operatorOwner as string
    return ''
  }, [query])

  return (
    <Box {...pageStyles}>
      <HStack>
        <Wallet />
        <Heading {...headingStyles}>{t('stats.header')}</Heading>
      </HStack>
      <OperatorsTotal operatorOwner={operatorOwner} />
      <PieGraph operatorOwner={operatorOwner} />
      <ViewSelector />
      {operatorsListType === OperatorListType.CARD_GRID && <OperatorsCards operatorOwner={operatorOwner} />}
      {operatorsListType === OperatorListType.LIST && <OperatorsList operatorOwner={operatorOwner} />}
    </Box>
  )
}

export async function getStaticProps() {
  return { props: { title: 'Subspace Staking Interface - Stats' } }
}

export const getStaticPaths: GetStaticPaths<{ operatorOwner: string }> = async () => {
  return {
    paths: [{ params: { operatorOwner: 'st00' } }],
    fallback: true
  }
}

export default Page
