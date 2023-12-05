import { Box, HStack, Heading, Table, TableContainer, Tbody, Td, Text, Th, Thead, Tr } from '@chakra-ui/react'
import { encodeAddress } from '@polkadot/keyring'
import Link from 'next/link'
import React, { useMemo } from 'react'
import { ROUTES, headingStyles, tHeadStyles, tableStyles, textStyles } from '../constants'
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
  const { extension, subspaceAccount, stakingConstants, chainDetails } = useExtension((state) => state)
  const { ss58Format } = chainDetails

  const operators = useMemo(() => {
    if (operatorOwner) return stakingConstants.operators.filter((operator) => operator.operatorOwner === operatorOwner)
    return stakingConstants.operators
  }, [operatorOwner, stakingConstants.operators])

  const nominatorsOperators = useMemo(() => {
    if (fromManage) {
      const nominators = stakingConstants.nominators.filter((operator) => operator.nominatorOwner === operatorOwner)
      return stakingConstants.operators.filter((operator) =>
        nominators.find((nominator) => nominator.operatorId === operator.operatorId)
      )
    }
  }, [fromManage, stakingConstants.nominators, stakingConstants.operators, operatorOwner])

  const operatorsList = useMemo(
    () => (fromManage && nominatorsOperators ? [...operators, ...nominatorsOperators] : operators),
    [fromManage, nominatorsOperators, operators]
  )

  return (
    <Box>
      <Box mt='6'>
        <HStack mb='6'>
          <Heading {...headingStyles.paragraph}>Information across operators</Heading>
          {operatorOwner && (
            <Heading {...headingStyles.paragraphExtra}>on Account {formatAddress(operatorOwner)}</Heading>
          )}
        </HStack>
      </Box>
      <TableContainer>
        <Table {...tableStyles}>
          <Thead {...tHeadStyles}>
            <Tr>
              <Th>OperatorID</Th>
              <Th>Signing key</Th>
              <Th>Operator Account</Th>
              <Th isNumeric>NominatorTax</Th>
              <Th isNumeric>Min Nominator Stake</Th>
              <Th isNumeric>Funds in stake</Th>
              {subspaceAccount && <Th>Actions</Th>}
            </Tr>
          </Thead>
          {operatorsList.length === 0 ? (
            <Tbody>
              {[0].map((_, key) => (
                <Tr key={key}>
                  <Td {...textStyles.text} colSpan={subspaceAccount ? 7 : 6}>
                    <Text>No operators found</Text>
                    {subspaceAccount === operatorOwner && (
                      <Text>
                        If you recently register a operator, it may take up to 10 minutes for the operator to be added.
                      </Text>
                    )}
                  </Td>
                </Tr>
              ))}
            </Tbody>
          ) : (
            <Tbody>
              {operatorsList.map((operator, key) => {
                const findMatchingAccount =
                  extension.data &&
                  extension.data.accounts.find((a) => encodeAddress(a.address, ss58Format) === operator.operatorOwner)
                const accountLabel =
                  findMatchingAccount && findMatchingAccount.meta.name
                    ? `(${findMatchingAccount.meta.name}) ${formatAddress(operatorOwner ?? operator.operatorOwner)}`
                    : formatAddress(operatorOwner ?? operator.operatorOwner)
                return (
                  <Tr key={key}>
                    <Td {...textStyles.text} isNumeric>
                      {operator.operatorId}
                    </Td>
                    <Td {...textStyles.text}>{formatAddress(operator.operatorDetail.signingKey)}</Td>
                    <Td {...textStyles.link}>
                      <Link href={`${ROUTES.OPERATOR_STATS}/${operatorOwner ?? operator.operatorOwner}`}>
                        {accountLabel}
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
