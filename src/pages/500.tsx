import { Heading } from '@chakra-ui/react'
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import React from 'react'

const Error: React.FC = () => {
  const { t } = useTranslation()

  return (
    <Heading as='h1' size='lg' textAlign='center'>
      {t('500.header')}
    </Heading>
  )
}

export const getStaticProps = async ({ locale }: { locale: string }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common']))
      // Will be passed to the page component as props
    }
  }
}

export default Error
