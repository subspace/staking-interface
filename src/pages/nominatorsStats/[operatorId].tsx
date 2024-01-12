import { Box, HStack, Heading } from '@chakra-ui/react'
import { GetStaticPaths } from 'next'
import { useTranslation } from 'next-i18next'
import { useRouter } from 'next/router'
import React, { useEffect, useMemo } from 'react'
import { Wallet } from '../../components/icons'
import { NominatorsList } from '../../components/nominatorsList'
import { headingStyles, pageStyles } from '../../constants'
import { useOnchainData } from '../../hooks/useOnchainData'

const Page: React.FC = () => {
  const { t } = useTranslation()
  const { handleOnchainData } = useOnchainData()
  const { query } = useRouter()

  useEffect(() => {
    handleOnchainData()
  }, [handleOnchainData])

  const operatorId = useMemo(() => {
    if (query.operatorId && typeof query.operatorId === 'string') return query.operatorId as string
    return ''
  }, [query])

  return (
    <Box {...pageStyles}>
      <HStack>
        <Wallet />
        <Heading {...headingStyles}>{t('nominators.header')}</Heading>
      </HStack>
      <NominatorsList operatorId={operatorId} />
    </Box>
  )
}

export async function getStaticProps() {
  return { props: { title: 'Subspace Staking Interface - Nominators' } }
}

export const getStaticPaths: GetStaticPaths<{ operatorId: string }> = async () => {
  return {
    paths: [{ params: { operatorId: '0' } }],
    fallback: true
  }
}

export default Page
