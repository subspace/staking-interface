import {
  Box,
  Button,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  Grid,
  GridItem,
  Heading,
  Input,
  InputGroup,
  InputRightElement,
  Text
} from '@chakra-ui/react'
import { Select } from 'chakra-react-select'
import { useTranslation } from 'next-i18next'
import Link from 'next/link'
import React, { useEffect } from 'react'
import { ConnectWallet, FormButton } from '../components/buttons'
import { Intro } from '../components/intro'
import { EXTERNAL_ROUTES, headingStyles, pageStyles } from '../constants'
import { useOnchainData } from '../hooks/useOnchainData'
import { useRegister } from '../hooks/useRegister'
import { useWallet } from '../hooks/useWallet'
import { useExtension } from '../states/extension'
import { useRegistration } from '../states/registration'

const Page: React.FC = () => {
  const { t } = useTranslation()
  const {
    chainDetails: { tokenSymbol }
  } = useExtension()
  const { extension, handleConnect } = useWallet()
  const { domainsOptions, handleChange, handleDomainChange, handleMaxAmountToStake, handleSubmit } = useRegister()
  const { handleOnchainData } = useOnchainData()
  const {
    currentRegistration: { formattedAmountToStake, signingKey, formattedMinimumNominatorStake, nominatorTax },
    isErrorsField
  } = useRegistration()

  useEffect(() => {
    handleOnchainData()
  }, [handleOnchainData])

  return (
    <Box {...pageStyles}>
      <Intro />
      <Box mt='66px'>
        <Heading {...headingStyles.page}>{t('register.header')}</Heading>
        <Grid templateColumns='repeat(2, 1fr)' gap={6} mt='12'>
          <GridItem w='100%'>
            <FormControl isInvalid={isErrorsField['domainId']}>
              <FormLabel>{t('register.form.domainId.label')}</FormLabel>
              <Box mt='6'>
                <Select
                  name='domainId'
                  placeholder={t('register.form.domainId.placeholder')}
                  value={domainsOptions}
                  onChange={handleDomainChange}
                  options={domainsOptions}
                />
              </Box>
              {isErrorsField['domainId'] ? (
                <FormErrorMessage h='10'>{t('register.form.domainId.error')}</FormErrorMessage>
              ) : (
                <FormHelperText h='10'></FormHelperText>
              )}
            </FormControl>
            <FormControl isInvalid={isErrorsField['amountToStake']}>
              <FormLabel>{t('register.form.amountToStake.amountToStake', { tokenSymbol })}</FormLabel>
              <InputGroup size='md' mt='4'>
                <Input
                  name='amountToStake'
                  placeholder={t('register.form.amountToStake.placeholder')}
                  value={formattedAmountToStake}
                  onChange={handleChange}
                />
                <InputRightElement>
                  <Button m={1} onClick={handleMaxAmountToStake}>
                    Max
                  </Button>
                </InputRightElement>
              </InputGroup>
              {isErrorsField['amountToStake'] ? (
                <FormErrorMessage h='10'>{t('register.form.amountToStake.error')}</FormErrorMessage>
              ) : (
                <FormHelperText h='10'></FormHelperText>
              )}
            </FormControl>
            <FormControl isInvalid={isErrorsField['signingKey']}>
              <FormLabel>{t('register.form.signingKey.label')}</FormLabel>
              <Input
                name='signingKey'
                placeholder={t('register.form.signingKey.placeholder')}
                value={signingKey}
                onChange={handleChange}
                mt='4'
              />
              {isErrorsField['signingKey'] ? (
                <FormErrorMessage h='10'>{t('register.form.signingKey.error')}</FormErrorMessage>
              ) : (
                <FormHelperText h='10'></FormHelperText>
              )}
            </FormControl>
          </GridItem>
          <GridItem w='100%'>
            <FormControl isInvalid={isErrorsField['minimumNominatorStake']}>
              <FormLabel>{t('register.form.minimumNominatorStake.label', { tokenSymbol })}</FormLabel>
              <Input
                name='minimumNominatorStake'
                placeholder={t('register.form.minimumNominatorStake.placeholder')}
                value={formattedMinimumNominatorStake}
                onChange={handleChange}
                mt='4'
              />
              {isErrorsField['minimumNominatorStake'] ? (
                <FormErrorMessage h='10'>{t('register.form.minimumNominatorStake.error')}</FormErrorMessage>
              ) : (
                <FormHelperText h='10'></FormHelperText>
              )}
            </FormControl>
            <FormControl isInvalid={isErrorsField['nominatorTax']}>
              <FormLabel>{t('register.form.nominatorTax.label')}</FormLabel>
              <Input
                name='nominatorTax'
                placeholder={t('register.form.nominatorTax.placeholder')}
                value={nominatorTax}
                onChange={handleChange}
                mt='4'
              />
              {isErrorsField['nominatorTax'] ? (
                <FormErrorMessage h='10'>{t('register.form.nominatorTax.error')}</FormErrorMessage>
              ) : (
                <FormHelperText h='10'></FormHelperText>
              )}
            </FormControl>
            <Box mt='8'>
              <Link href={EXTERNAL_ROUTES.OPERATORS_DOCS}>
                <Text textDecoration='underline' color='#4524C1'>
                  {t('register.needHelpLink')}
                </Text>
              </Link>
            </Box>
          </GridItem>
        </Grid>

        {extension.data ? (
          <FormButton onClick={handleSubmit}>Next</FormButton>
        ) : (
          <Box mt='8'>
            <ConnectWallet onClick={handleConnect} />
          </Box>
        )}
      </Box>
    </Box>
  )
}

export async function getStaticProps() {
  return { props: { title: 'Subspace Staking Interface - Register' } }
}

export default Page
