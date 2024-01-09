import { Box, Button, Center, Heading, Text, VStack } from '@chakra-ui/react'
import { useTranslation } from 'next-i18next'
import Link from 'next/link'
import { SUBSCAN_URL } from '../constants'

interface SuccessTxToastProps {
  heading: string
  description: string
  hash: string
}

export const SuccessTxToast: React.FC<SuccessTxToastProps> = ({ heading, description, hash }) => {
  const { t } = useTranslation()

  return (
    <Box color='white' p={3} bg='brand.500' w='40vh'>
      <Center>
        <VStack>
          <Heading color='white' size='md'>
            {heading}
          </Heading>
          <Text color='white'>{description}</Text>
          <Link href={`${SUBSCAN_URL}extrinsic/${hash}`} target='_blank'>
            <Button variant='outline' colorScheme='brand' ml='2' size='sm' color='white'>
              {t('components.toasts.viewInExplorer')}
            </Button>
          </Link>
        </VStack>
      </Center>
    </Box>
  )
}
