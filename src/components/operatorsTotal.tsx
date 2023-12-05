import { Box, Grid, GridItem, HStack, Heading, Text } from '@chakra-ui/react'
import React, { useMemo } from 'react'
import { headingStyles, textStyles } from '../constants'
import { useExtension } from '../states/extension'
import { calculateSharedToStake, formatAddress, formatNumber, hexToNumber } from '../utils'
import { TooltipAmount } from './tooltipAmount'

interface OperatorsTotalProps {
  operatorOwner?: string
}

export const OperatorsTotal: React.FC<OperatorsTotalProps> = ({ operatorOwner }) => {
  const { stakingConstants, chainDetails } = useExtension((state) => state)
  const { tokenDecimals, tokenSymbol } = chainDetails

  const totalFundsInStake = useMemo(() => {
    if (operatorOwner)
      return stakingConstants.operators
        .filter((operator) => operator.operatorOwner === operatorOwner)
        .reduce((acc, operator) => acc + hexToNumber(operator.operatorDetail.currentTotalStake, tokenDecimals), 0)
    return stakingConstants.operators.reduce(
      (acc, operator) => acc + hexToNumber(operator.operatorDetail.currentTotalStake, tokenDecimals),
      0
    )
  }, [operatorOwner, stakingConstants.operators, tokenDecimals])

  // To-Do: Implement this
  const totalFundsInStakeAvailable = useMemo(() => {
    return totalFundsInStake
  }, [totalFundsInStake])

  const totalOperators = useMemo(() => {
    if (operatorOwner)
      return stakingConstants.operators
        .filter((operator) => operator.operatorOwner === operatorOwner)
        .reduce((acc) => acc + 1, 0)
    return stakingConstants.operators.reduce((acc) => acc + 1, 0)
  }, [operatorOwner, stakingConstants.operators])

  const totalOperatorsStake = useMemo(() => {
    if (operatorOwner)
      return stakingConstants.operators
        .filter((operator) => operator.operatorOwner === operatorOwner)
        .reduce(
          (acc, operator) =>
            acc +
            calculateSharedToStake(
              operator.operatorDetail.totalShares,
              operator.operatorDetail.totalShares ?? '0x0',
              operator.operatorDetail.currentTotalStake ?? '0x0'
            ) -
            calculateSharedToStake(
              stakingConstants.nominators.find((nominator) => nominator.operatorId === operator.operatorId)?.shares ??
                '0x0',
              operator.operatorDetail.totalShares ?? '0x0',
              operator.operatorDetail.currentTotalStake ?? '0x0'
            ),
          0
        )

    return stakingConstants.operators.reduce(
      (acc, operator) =>
        acc +
        calculateSharedToStake(
          operator.operatorDetail.totalShares,
          operator.operatorDetail.totalShares ?? '0x0',
          operator.operatorDetail.currentTotalStake ?? '0x0'
        ) -
        calculateSharedToStake(
          stakingConstants.nominators.find((nominator) => nominator.operatorId === operator.operatorId)?.shares ??
            '0x0',
          operator.operatorDetail.totalShares ?? '0x0',
          operator.operatorDetail.currentTotalStake ?? '0x0'
        ),
      0
    )
  }, [operatorOwner, stakingConstants.nominators, stakingConstants.operators])

  const totalNominators = useMemo(() => {
    if (operatorOwner)
      return stakingConstants.nominators
        .filter((nominator) => nominator.nominatorOwner === operatorOwner)
        .reduce((acc) => acc + 1, 0)
    return stakingConstants.nominators.reduce((acc, nominator) => {
      const operator = stakingConstants.operators.find((operator) => operator.operatorId === nominator.operatorId)
      if (operator && nominator.nominatorOwner !== operator.operatorOwner) return acc + 1
      return acc
    }, 0)
  }, [operatorOwner, stakingConstants.nominators, stakingConstants.operators])

  const totalNominatorsStake = useMemo(() => {
    if (operatorOwner)
      return stakingConstants.nominators
        .filter((nominator) => nominator.nominatorOwner === operatorOwner)
        .reduce((acc, nominator) => {
          const operator = stakingConstants.operators.find((operator) => operator.operatorId === nominator.operatorId)
          if (operator)
            return (
              acc +
              calculateSharedToStake(
                nominator.shares,
                operator.operatorDetail.totalShares,
                operator.operatorDetail.currentTotalStake
              )
            )
          return acc
        }, 0)

    return stakingConstants.nominators.reduce((acc, nominator) => {
      const operator = stakingConstants.operators.find((operator) => operator.operatorId === nominator.operatorId)
      if (operator)
        return (
          acc +
          calculateSharedToStake(
            nominator.shares,
            operator.operatorDetail.totalShares,
            operator.operatorDetail.currentTotalStake
          )
        )
      return acc
    }, 0)
  }, [operatorOwner, stakingConstants.nominators, stakingConstants.operators])

  return (
    <Box>
      <Box mt='6'>
        <HStack mb='6'>
          <Heading {...headingStyles.paragraph}>Aggregated data</Heading>
          {operatorOwner && (
            <Heading {...headingStyles.paragraphExtra}>on Account {formatAddress(operatorOwner)}</Heading>
          )}
        </HStack>
      </Box>
      <Grid templateColumns='repeat(2, 1fr)' gap={6} mt='12'>
        <GridItem w='100%'>
          <Text style={textStyles.heading}>Funds in Stake, {tokenSymbol}</Text>
          <Text style={textStyles.value}>
            <TooltipAmount amount={totalFundsInStake}>{formatNumber(totalFundsInStake)}</TooltipAmount>
          </Text>

          <Text style={textStyles.heading} mt='8'>
            Number of Operators
          </Text>
          <Text style={textStyles.value}>{totalOperators}</Text>

          <Text style={textStyles.heading} mt='8'>
            Number of Nominators
          </Text>
          <Text style={textStyles.value}>{totalNominators}</Text>
        </GridItem>
        <GridItem w='100%'>
          <Text style={textStyles.heading}>Available for withdrawal, {tokenSymbol}</Text>
          <Text style={textStyles.value}>
            <TooltipAmount amount={totalFundsInStakeAvailable}>
              {formatNumber(totalFundsInStakeAvailable)}
            </TooltipAmount>
          </Text>

          <Text style={textStyles.heading} mt='8'>
            Operator’s funds, {tokenSymbol}
          </Text>
          <Text style={textStyles.value}>
            <TooltipAmount amount={totalOperatorsStake}>{formatNumber(totalOperatorsStake)}</TooltipAmount>
          </Text>

          <Text style={textStyles.heading} mt='8'>
            Nominator’s funds, {tokenSymbol}
          </Text>
          <Text style={textStyles.value}>
            <TooltipAmount amount={totalNominatorsStake}>{formatNumber(totalNominatorsStake)}</TooltipAmount>
          </Text>
        </GridItem>
      </Grid>
    </Box>
  )
}
