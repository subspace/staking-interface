import { Box, Grid, GridItem, Heading } from '@chakra-ui/react'
import { ResponsivePie } from '@nivo/pie'
import { useTranslation } from 'next-i18next'
import React from 'react'
import { headingStyles } from '../constants'
import { useTotal } from '../hooks/useTotal'

interface PieProps {
  data: {
    id: string
    label: string
    value: number
  }[]
  colors?: string
  small?: boolean
}

const Pie: React.FC<PieProps> = ({ data, colors = '#a584c2', small }) => (
  <ResponsivePie
    data={data}
    colors={colors}
    margin={small ? { top: 10, right: 20, bottom: 60, left: 20 } : { top: 40, right: 80, bottom: 80, left: 80 }}
    innerRadius={0.5}
    padAngle={0.7}
    cornerRadius={3}
    activeOuterRadiusOffset={8}
    borderWidth={1}
    borderColor={{
      from: 'color',
      modifiers: [['darker', 0.2]]
    }}
    arcLinkLabelsSkipAngle={10}
    arcLinkLabelsTextColor='#333333'
    arcLinkLabelsThickness={2}
    arcLinkLabel={(d) => `${d.id}: ${d.value}`}
    arcLinkLabelsColor={{ from: 'color' }}
    enableArcLabels={false}
    arcLabelsSkipAngle={10}
    arcLabelsTextColor={{
      from: 'color',
      modifiers: [['darker', 2]]
    }}
    defs={[
      {
        id: 'dots',
        type: 'patternDots',
        background: 'inherit',
        color: 'rgba(255, 255, 255, 0.3)',
        size: 4,
        padding: 1,
        stagger: true
      },
      {
        id: 'lines',
        type: 'patternLines',
        background: 'inherit',
        color: 'rgba(255, 255, 255, 0.3)',
        rotation: -45,
        lineWidth: 6,
        spacing: 10
      }
    ]}
    fill={[
      {
        match: {
          id: 'nominators'
        },
        id: 'dots'
      },
      {
        match: {
          id: 'operators'
        },
        id: 'lines'
      }
    ]}
    legends={[
      {
        anchor: 'bottom',
        direction: 'row',
        justify: false,
        translateX: 0,
        translateY: 56,
        itemsSpacing: 0,
        itemWidth: 100,
        itemHeight: 18,
        itemTextColor: '#999',
        itemDirection: 'left-to-right',
        itemOpacity: 1,
        symbolSize: 18,
        symbolShape: 'circle',
        effects: [
          {
            on: 'hover',
            style: {
              itemTextColor: '#000'
            }
          }
        ]
      }
    ]}
  />
)

interface OperatorsTotalProps {
  operatorOwner?: string
  small?: boolean
}

export const PieGraph: React.FC<OperatorsTotalProps> = ({ operatorOwner, small }) => {
  const { t } = useTranslation()
  const { totalOperators, totalOperatorsStake, totalNominators, totalNominatorsStake } = useTotal(operatorOwner)

  return (
    <Box mb={6}>
      <Grid
        templateColumns={small ? 'repeat(1, 1fr)' : ['repeat(1, 1fr)', 'repeat(2, 1fr)', 'repeat(2, 1fr)']}
        gap={[2, 4, 6]}
        mt={small ? 0 : 6}>
        <GridItem w='100%' h={small ? '200px' : '500px'}>
          {small ? (
            <Heading {...headingStyles.paragraphExtra}>{t('components.pieGraph.totalStake')}</Heading>
          ) : (
            <Heading {...headingStyles.paragraph}>{t('components.pieGraph.totalStake')}</Heading>
          )}
          <Pie
            data={[
              {
                id: 'nominators',
                label: 'nominators',
                value: Number(totalNominatorsStake.toFixed(0))
              },
              {
                id: 'operators',
                label: 'operators',
                value: Number(totalOperatorsStake.toFixed(0))
              }
            ]}
            colors='#a584c2'
            small={small}
          />
        </GridItem>
        <GridItem w='100%' h={small ? '200px' : '500px'}>
          {small ? (
            <Heading {...headingStyles.paragraphExtra}>{t('components.pieGraph.quantity')}</Heading>
          ) : (
            <Heading {...headingStyles.paragraph}>{t('components.pieGraph.quantity')}</Heading>
          )}
          <Pie
            data={[
              {
                id: 'nominators',
                label: t('components.pieGraph.nominators'),
                value: totalNominators
              },
              {
                id: 'operators',
                label: t('components.pieGraph.operators'),
                value: totalOperators
              }
            ]}
            colors='#3a1765'
            small={small}
          />
        </GridItem>
      </Grid>
    </Box>
  )
}
