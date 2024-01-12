import { Box, HStack, Heading, Text } from '@chakra-ui/react'
import { useTranslation } from 'next-i18next'
import Link from 'next/link'
import React from 'react'
import { EXTERNAL_ROUTES, headingStyles } from '../constants'
import { useExtension } from '../states/extension'
import { Wallet } from './icons'

export const Intro: React.FC = () => {
  const { t } = useTranslation()
  const {
    chainDetails: { tokenSymbol }
  } = useExtension()

  return (
    <Box>
      <HStack mb='6'>
        <Wallet />
        <Heading {...headingStyles.page}>{t('components.intro.header')}</Heading>
      </HStack>
      <Text>
        {t('components.intro.paragraphOne', { tokenSymbol })}{' '}
        <u>
          <Link href={EXTERNAL_ROUTES.STAKING_INCENTIVES}>{t('components.intro.stakingIncentives')}</Link>
        </u>
        .
      </Text>
      <Text>
        {t('components.intro.paragraphTwo')}{' '}
        <u>
          <Link href={EXTERNAL_ROUTES.STAKING_INFORMATION}>{t('components.intro.information')}</Link>
        </u>{' '}
        {t('components.intro.paragraphTree')}
      </Text>
      <Link href={EXTERNAL_ROUTES.RISK}>
        <Text textDecoration='underline'>{t('components.intro.learnMore')}</Text>
      </Link>
    </Box>
  )
}
