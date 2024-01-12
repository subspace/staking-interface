import { ChevronDownIcon } from '@chakra-ui/icons'
import {
  Button,
  Center,
  Grid,
  GridItem,
  Heading,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  VStack
} from '@chakra-ui/react'
import { encodeAddress } from '@polkadot/keyring'
import { useTranslation } from 'next-i18next'
import Image from 'next/image'
import { useRef } from 'react'
import { connectWalletButtonStyles } from '../constants'
import { useConnect } from '../hooks/useConnect'
import { useExtension } from '../states/extension'
import { formatAddress } from '../utils'

interface ExtensionIconProps {
  extension: string
}

const ExtensionIcon: React.FC<ExtensionIconProps> = ({ extension }) => {
  const { t } = useTranslation()

  switch (extension) {
    case 'polkadot-js':
      return <Image src={'/images/polkadot-dot.svg'} width={20} height={20} alt={t('components.wallet.polkadot')} />
    case 'subwallet-js':
      return <Image src={'/images/subwallet.svg'} width={20} height={20} alt={t('components.wallet.metamask')} />
    case 'metamask':
      return <Image src={'/images/metamask.svg'} width={20} height={20} alt={t('components.wallet.subwallet')} />
    default:
      return null
  }
}

export const ConnectWallet = () => {
  const { t } = useTranslation()
  const {
    extension,
    subspaceAccount,
    chainDetails: { ss58Format }
  } = useExtension()
  const {
    handleSelectFirstWalletFromExtension,
    handleSelectWallet,
    handleDisconnect,
    onConnectOpen,
    isConnectOpen,
    onConnectClose
  } = useConnect()
  const finalRef = useRef(null)

  return (
    <>
      {!extension.data || !subspaceAccount ? (
        <Button {...connectWalletButtonStyles} onClick={onConnectOpen}>
          {t('components.wallet.connectWallet')}
        </Button>
      ) : (
        <Menu>
          <MenuButton {...connectWalletButtonStyles} as={Button} rightIcon={<ChevronDownIcon pl='2' />}>
            {formatAddress(subspaceAccount)}
          </MenuButton>
          <MenuList>
            {extension.data.accounts.map((account) => (
              <MenuItem
                key={`${account.meta.source}-${account.address}`}
                onClick={() => handleSelectWallet(account.address)}
                _hover={{
                  bgGradient: 'linear(to-r, #A28CD2, #F4ABFD)'
                }}>
                <ExtensionIcon extension={account.meta.source} />
                <Text ml='2'>
                  {`${account.meta.name && `(${account.meta.name})`} ${formatAddress(
                    encodeAddress(account.address, ss58Format)
                  )}`}
                </Text>
              </MenuItem>
            ))}
            <MenuDivider />
            <MenuItem
              onClick={handleDisconnect}
              _hover={{
                bgGradient: 'linear(to-r, #A28CD2, #F4ABFD)'
              }}>
              <Image src={'/images/disconnect.svg'} width={20} height={20} alt={'disconnect'} />
              <Text ml='2'>{t('components.wallet.disconnect')}</Text>
            </MenuItem>
          </MenuList>
        </Menu>
      )}

      <Modal finalFocusRef={finalRef} isOpen={isConnectOpen} onClose={onConnectClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{t('components.wallet.connectYourWallet')}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Center>
              <VStack>
                <Heading size='lg' fontWeight='500' fontSize='30px' ml='2' color='#5B5252'>
                  {t('components.wallet.selectWallet')}
                </Heading>
                <Grid templateColumns='repeat(1, 1fr)' gap={6} p='6'>
                  <GridItem>
                    <Button
                      variant='outline'
                      w='200px'
                      borderColor='brand'
                      onClick={() => handleSelectFirstWalletFromExtension('polkadot-js')}>
                      <ExtensionIcon extension='polkadot-js' />
                      <Text ml='2'>{t('components.wallet.polkadot')}</Text>
                    </Button>
                  </GridItem>
                  <GridItem>
                    <Button
                      variant='outline'
                      w='200px'
                      borderColor='brand'
                      onClick={() => handleSelectFirstWalletFromExtension('subwallet-js')}>
                      <ExtensionIcon extension='subwallet-js' />
                      <Text ml='2'>{t('components.wallet.subwallet')}</Text>
                    </Button>
                  </GridItem>
                  {/* Uncomment when metamask snap is ready */}
                  {/* <GridItem>
                    <Button variant='outline' w='200px' borderColor='brand' onClick={() => handleSelectWallet('')}>
                      <ExtensionIcon extension='metamask' />
                      <Text ml='2'>{t('components.wallet.metamask')}</Text>
                    </Button>
                  </GridItem> */}
                </Grid>
              </VStack>
            </Center>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme='brand' mr={3} onClick={onConnectClose}>
              {t('action.close')}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}
