import { Box, HStack, Heading, Table, TableContainer, Tbody, Td, Text, Th, Thead, Tr } from '@chakra-ui/react'
import { encodeAddress } from '@polkadot/keyring'
import { useTranslation } from 'next-i18next'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { ROUTES, headingStyles, tHeadStyles, tableStyles, textStyles } from '../constants'
import { useOrderedOperators } from '../hooks/useOrderedOperators'
import { useExtension } from '../states/extension'
import { formatAddress, hexToFormattedNumber, hexToNumber } from '../utils'
import { Actions } from './actions'
import { FundsInStake } from './fundsInStake'
import { TooltipAmount } from './tooltipAmount'

interface OperatorsListProps {
  operatorOwner?: string
  fromManage?: boolean
}

export const OperatorsList: React.FC<OperatorsListProps> = ({ operatorOwner, fromManage }) => {
  const { t } = useTranslation()
  const [clientSide, setClientSide] = useState(false)
  const {
    extension,
    subspaceAccount,
    chainDetails: { ss58Format },
    stakingConstants
  } = useExtension()
  const { orderedOperators } = useOrderedOperators({ operatorOwner, fromManage })

  useEffect(() => {
    setClientSide(true)
  }, [])

  if (!clientSide) return null

  return (
    <Box>
      <Box mt='6'>
        <HStack mb='6'>
          <Heading {...headingStyles.paragraph}>{t('components.operatorsList.header')}</Heading>
          {operatorOwner && (
            <Heading {...headingStyles.paragraphExtra}>
              {t('components.operatorsList.headerOperatorOwner', { account: formatAddress(operatorOwner) })}
            </Heading>
          )}
        </HStack>
      </Box>
      <TableContainer>
        <Table {...tableStyles}>
          <Thead {...tHeadStyles}>
            <Tr>
              <Th isNumeric />
              <Th>{t('components.operatorsList.table.operatorId')}</Th>
              <Th>{t('components.operatorsList.table.signingKey')}</Th>
              <Th>{t('components.operatorsList.table.operatorAccount')}</Th>
              <Th isNumeric>{t('components.operatorsList.table.nominatorsCount')}</Th>
              <Th isNumeric>{t('components.operatorsList.table.nominatorTax')}</Th>
              <Th isNumeric>{t('components.operatorsList.table.minNominatorStake')}</Th>
              <Th isNumeric>{t('components.operatorsList.table.fundsInStake')}</Th>
              {subspaceAccount && <Th>{t('action.actions')}</Th>}
            </Tr>
          </Thead>
          {orderedOperators.length === 0 ? (
            <Tbody>
              {[0].map((_, key) => (
                <Tr key={key}>
                  <Td {...textStyles.text} colSpan={subspaceAccount ? 8 : 7}>
                    <Text {...textStyles.text}>{t('components.operatorsList.noRow')}</Text>
                    {subspaceAccount === operatorOwner && (
                      <Text {...textStyles.text}>{t('components.operatorsList.delayWarning')}</Text>
                    )}
                  </Td>
                </Tr>
              ))}
            </Tbody>
          ) : (
            <Tbody>
              {orderedOperators.map((operator, key) => {
                const findMatchingAccount =
                  extension.data &&
                  extension.data.accounts.find((a) => encodeAddress(a.address, ss58Format) === operator.operatorOwner)
                const accountLabel =
                  findMatchingAccount && findMatchingAccount.meta.name
                    ? `(${findMatchingAccount.meta.name}) ${formatAddress(operatorOwner ?? operator.operatorOwner)}`
                    : formatAddress(operatorOwner ?? operator.operatorOwner)
                const nominatorsCount =
                  stakingConstants.nominators.filter((nominator) => nominator.operatorId === operator.operatorId)
                    .length - 1
                return (
                  <Tr key={key}>
                    <Td {...textStyles.text} isNumeric>
                      {key + 1}
                    </Td>
                    <Td {...textStyles.text} isNumeric>
                      {operator.operatorId}
                    </Td>
                    <Td {...textStyles.text}>{formatAddress(operator.operatorDetail.signingKey)}</Td>
                    <Td {...textStyles.link}>
                      <Link href={`${ROUTES.OPERATOR_STATS}/${operatorOwner ?? operator.operatorOwner}`}>
                        {accountLabel}
                      </Link>
                    </Td>
                    <Td {...textStyles.link} isNumeric>
                      <Link href={`${ROUTES.NOMINATORS_STATS}/${operator.operatorId}`}>
                        {nominatorsCount > 0 ? nominatorsCount : ''}
                      </Link>
                    </Td>
                    <Td {...textStyles.text} isNumeric>
                      {operator.operatorDetail.nominationTax}%
                    </Td>
                    <Td {...textStyles.text} isNumeric>
                      <TooltipAmount amount={hexToNumber(operator.operatorDetail.minimumNominatorStake)}>
                        {hexToFormattedNumber(operator.operatorDetail.minimumNominatorStake)}
                      </TooltipAmount>
                    </Td>
                    <Td {...textStyles.text} isNumeric>
                      <TooltipAmount amount={hexToNumber(operator.operatorDetail.currentTotalStake)}>
                        {hexToFormattedNumber(operator.operatorDetail.currentTotalStake)}
                      </TooltipAmount>
                      <FundsInStake operatorId={operator.operatorId} />
                    </Td>
                    {subspaceAccount && (
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
