import { InfoOutlineIcon } from '@chakra-ui/icons'
import {
  Box,
  Button,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverFooter,
  PopoverHeader,
  PopoverTrigger,
  Portal,
  Text
} from '@chakra-ui/react'
import { useTranslation } from 'next-i18next'
import React, { useMemo } from 'react'
import { textStyles } from '../constants'
import { useExtension } from '../states/extension'
import { calculateSharedToStake, formatNumber, hexToFormattedNumber, hexToNumber } from '../utils'
import { TooltipAmount } from './tooltipAmount'

interface ActionsProps {
  operatorId: string
}

export const FundsInStake: React.FC<ActionsProps> = ({ operatorId }) => {
  const { t } = useTranslation()
  const { chainDetails, stakingConstants } = useExtension()

  const operator = useMemo(
    () => stakingConstants.operators.find((operator) => operator.operatorId === operatorId),
    [stakingConstants.operators, operatorId]
  )

  const nominatorsStake = useMemo(
    () =>
      operator &&
      stakingConstants.nominators
        .filter(
          (nominator) => nominator.operatorId === operatorId && nominator.nominatorOwner != operator.operatorOwner
        )
        .reduce(
          (acc, nominator) =>
            acc +
            calculateSharedToStake(
              nominator.shares,
              operator.operatorDetail.totalShares,
              operator.operatorDetail.currentTotalStake
            ),
          0
        ),
    [operator, stakingConstants.nominators, operatorId]
  )

  const operatorStake = useMemo(
    () =>
      operator &&
      calculateSharedToStake(
        operator.operatorDetail.totalShares,
        operator.operatorDetail.totalShares,
        operator.operatorDetail.currentTotalStake
      ) - (nominatorsStake ?? 0),
    [operator, nominatorsStake]
  )

  if (!operator) return null

  return (
    <Popover>
      <PopoverTrigger>
        <Button rightIcon={<InfoOutlineIcon />} colorScheme='brand' variant='outline' size='sm' pl={1} ml={2} />
      </PopoverTrigger>
      <Portal>
        <PopoverContent>
          <PopoverArrow />
          <PopoverHeader {...textStyles.heading}>{t('components.fundsInStake.header')}</PopoverHeader>
          <PopoverCloseButton />
          <PopoverBody>
            <Box mb={2}>
              <Text>{t('components.fundsInStake.operatorStake')}:</Text>
              <TooltipAmount amount={operatorStake ?? 0}>
                <Text {...textStyles.text}>
                  {operatorStake ? formatNumber(operatorStake) : '0'} {chainDetails.tokenSymbol}
                </Text>
              </TooltipAmount>
              <Text>{t('components.fundsInStake.nominatorsStake')}:</Text>
              <TooltipAmount amount={nominatorsStake ?? 0}>
                <Text {...textStyles.text}>
                  {nominatorsStake ? formatNumber(nominatorsStake) : '0'} {chainDetails.tokenSymbol}
                </Text>
              </TooltipAmount>
            </Box>
          </PopoverBody>
          <PopoverFooter>
            <Text>{t('components.fundsInStake.totalStake')}:</Text>
            <TooltipAmount amount={hexToNumber(operator.operatorDetail.currentTotalStake)}>
              <Text {...textStyles.text}>
                {hexToFormattedNumber(operator.operatorDetail.currentTotalStake)} {chainDetails.tokenSymbol}
              </Text>
            </TooltipAmount>
          </PopoverFooter>
        </PopoverContent>
      </Portal>
    </Popover>
  )
}
