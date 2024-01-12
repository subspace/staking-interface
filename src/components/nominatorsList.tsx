import { Box, HStack, Heading, Table, TableContainer, Tag, Tbody, Td, Text, Th, Thead, Tr } from '@chakra-ui/react'
import { encodeAddress } from '@polkadot/keyring'
import { useTranslation } from 'next-i18next'
import Link from 'next/link'
import React, { useEffect, useMemo, useState } from 'react'
import { ROUTES, headingStyles, tHeadStyles, tableStyles, textStyles } from '../constants'
import { useExtension } from '../states/extension'
import { calculateSharedToStake, formatAddress, formatNumber, hexToFormattedNumber, hexToNumber } from '../utils'
import { Actions } from './actions'
import { FundsInStake } from './fundsInStake'
import { TooltipAmount } from './tooltipAmount'

interface OperatorsListProps {
  operatorId?: string
}

export const NominatorsList: React.FC<OperatorsListProps> = ({ operatorId }) => {
  const { t } = useTranslation()
  const [clientSide, setClientSide] = useState(false)
  const {
    extension,
    subspaceAccount,
    stakingConstants,
    chainDetails: { ss58Format }
  } = useExtension()

  const nominators = useMemo(() => {
    if (operatorId) return stakingConstants.nominators.filter((operator) => operator.operatorId === operatorId)
    return stakingConstants.nominators
  }, [operatorId, stakingConstants.nominators])

  const operators = useMemo(() => {
    if (operatorId) return stakingConstants.operators.filter((operator) => operator.operatorId === operatorId)
    return stakingConstants.operators
  }, [operatorId, stakingConstants.operators])

  useEffect(() => {
    setClientSide(true)
  }, [])

  if (!clientSide) return null

  return (
    <Box>
      <Box mt='6'>
        <HStack mb='6'>
          <Heading {...headingStyles.paragraph}>{t('components.nominatorsList.header')}</Heading>
          {operatorId && (
            <Heading {...headingStyles.paragraphExtra}>
              {t('components.nominatorsList.headerOperatorOwner', { operatorId })}
            </Heading>
          )}
        </HStack>
      </Box>
      <TableContainer>
        <Table {...tableStyles}>
          <Thead {...tHeadStyles}>
            <Tr>
              <Th>{t('components.nominatorsList.nominatorAccount')}</Th>
              <Th>{t('components.nominatorsList.operatorID')}</Th>
              <Th isNumeric>{t('components.nominatorsList.nominatorTax')}</Th>
              <Th isNumeric>{t('components.nominatorsList.minNominatorsStake')}</Th>
              <Th isNumeric>{t('components.nominatorsList.fundsInStake')}</Th>
              <Th isNumeric>{t('components.nominatorsList.pcOfStake')}</Th>
              <Th isNumeric>{t('components.nominatorsList.totalFundsStaked')}</Th>
              {subspaceAccount && <Th>{t('action.actions')}</Th>}
            </Tr>
          </Thead>
          {nominators.length === 0 ? (
            <Tbody>
              {[0].map((_, key) => (
                <Tr key={key}>
                  <Td {...textStyles.text} colSpan={subspaceAccount ? 9 : 8}>
                    <Text>{t('components.nominatorsList.noRow')}</Text>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          ) : (
            <Tbody>
              {operators &&
                nominators.map((nominator, key) => {
                  const operator = operators.find((operator) => operator.operatorId === nominator.operatorId)
                  const findMatchingAccount =
                    operator &&
                    extension.data &&
                    extension.data.accounts.find((a) => encodeAddress(a.address, ss58Format) === operator.operatorOwner)
                  const isOperator = operator?.operatorOwner === nominator.nominatorOwner
                  const accountLabel =
                    findMatchingAccount && findMatchingAccount.meta.name && isOperator
                      ? `(${findMatchingAccount.meta.name}) ${formatAddress(nominator.nominatorOwner)}`
                      : formatAddress(nominator.nominatorOwner)
                  const fundsInStake = calculateSharedToStake(
                    nominator.shares,
                    operator?.operatorDetail.totalShares ?? '0x0',
                    operator?.operatorDetail.currentTotalStake ?? '0x0'
                  )
                  const percentage =
                    operator &&
                    formatNumber(
                      (hexToNumber(nominator.shares) / hexToNumber(operator.operatorDetail.totalShares)) * 100,
                      2
                    )
                  return (
                    <Tr key={key}>
                      <Td {...textStyles.link}>
                        <Link href={`${ROUTES.NOMINATORS_STATS}/${nominator.nominatorOwner}`}>{accountLabel}</Link>
                        {isOperator && (
                          <Link href={`${ROUTES.OPERATOR_STATS}/${nominator.nominatorOwner}`}>
                            <Tag ml='2' colorScheme='brand'>
                              {t('components.nominatorsList.operator')}
                            </Tag>
                          </Link>
                        )}
                      </Td>
                      <Td {...textStyles.text} isNumeric>
                        {nominator.operatorId}
                      </Td>
                      <Td {...textStyles.text} isNumeric>
                        {operator && operator.operatorDetail.nominationTax}%
                      </Td>
                      <Td {...textStyles.text} isNumeric>
                        <TooltipAmount
                          amount={hexToNumber(operator ? operator.operatorDetail.minimumNominatorStake : '0x0')}>
                          {hexToFormattedNumber(operator ? operator.operatorDetail.minimumNominatorStake : '0x0')}
                        </TooltipAmount>
                      </Td>
                      <Td {...textStyles.text} isNumeric>
                        <TooltipAmount amount={fundsInStake}>{formatNumber(fundsInStake)}</TooltipAmount>
                      </Td>
                      <Td {...textStyles.text} isNumeric>
                        {percentage && `${formatNumber(percentage)}%`}
                      </Td>
                      <Td {...textStyles.text} isNumeric>
                        <TooltipAmount
                          amount={hexToNumber(operator ? operator.operatorDetail.currentTotalStake : '0x0')}>
                          {hexToFormattedNumber(operator ? operator.operatorDetail.currentTotalStake : '0x0')}
                        </TooltipAmount>
                        {operator && <FundsInStake operatorId={operator.operatorId} />}
                      </Td>
                      {subspaceAccount && operator && subspaceAccount === nominator.nominatorOwner && (
                        <Td {...textStyles.text}>
                          <Actions operatorId={operator.operatorId} />
                        </Td>
                      )}
                    </Tr>
                  )
                })}
            </Tbody>
          )}
        </Table>
      </TableContainer>
    </Box>
  )
}
