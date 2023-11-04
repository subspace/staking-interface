import { useDisclosure } from '@chakra-ui/react'
import { web3Accounts, web3Enable } from '@polkadot/extension-dapp'
import { encodeAddress } from '@polkadot/keyring'
import { useCallback, useEffect } from 'react'
import { SUBSPACE_ACCOUNT_FORMAT, SUBSPACE_EXTENSION_ID, initialExtensionValues } from '../constants'
import { useExtension } from '../states/extension'
import { AccountDetails } from '../types'

export const useConnect = () => {
  const extension = useExtension((state) => state.extension)
  const api = useExtension((state) => state.api)
  const setExtension = useExtension((state) => state.setExtension)
  const setSubspaceAccount = useExtension((state) => state.setSubspaceAccount)
  const setInjectedExtension = useExtension((state) => state.setInjectedExtension)
  const setAccountDetails = useExtension((state) => state.setAccountDetails)
  const { isOpen: isConnectOpen, onOpen: onConnectOpen, onClose: onConnectClose } = useDisclosure()

  const handleConnect = useCallback(async () => {
    setExtension({ ...initialExtensionValues, loading: true })

    web3Enable(SUBSPACE_EXTENSION_ID)
      .then((injectedExtensions) => {
        if (!injectedExtensions.length) return Promise.reject(new Error('NO_INJECTED_EXTENSIONS'))

        setInjectedExtension(injectedExtensions[0])

        return web3Accounts()
      })
      .then(async (accounts) => {
        if (!accounts.length) return Promise.reject(new Error('NO_ACCOUNTS'))

        setExtension({
          error: null,
          loading: false,
          data: {
            accounts: accounts,
            defaultAccount: accounts[0]
          }
        })
        setSubspaceAccount(encodeAddress(accounts[0].address, SUBSPACE_ACCOUNT_FORMAT))

        console.log('accounts', accounts)
      })
      .catch((error) => {
        console.error('Error with connect', error)
        setExtension({ error, loading: false, data: undefined })
      })
  }, [setExtension, setInjectedExtension, setSubspaceAccount])

  const handleSelectFirstWalletFromExtension = useCallback(
    async (source: string) => {
      await handleConnect()
      const mainAccount = extension.data?.accounts.find((account) => account.meta.source === source)
      console.log('mainAccount', mainAccount)
      if (mainAccount && extension.data) {
        setExtension({
          ...extension,
          data: {
            ...extension.data,
            defaultAccount: mainAccount
          }
        })
        setSubspaceAccount(encodeAddress(mainAccount.address, SUBSPACE_ACCOUNT_FORMAT))
      }
      onConnectClose()
    },
    [handleConnect, extension, onConnectClose, setExtension, setSubspaceAccount]
  )

  const handleSelectWallet = useCallback(
    async (address: string) => {
      const mainAccount = extension.data?.accounts.find((account) => account.address === address)
      console.log('mainAccount', mainAccount)
      if (mainAccount && extension.data) {
        setExtension({
          ...extension,
          data: {
            ...extension.data,
            defaultAccount: mainAccount
          }
        })
        setSubspaceAccount(encodeAddress(mainAccount.address, SUBSPACE_ACCOUNT_FORMAT))
      }
    },
    [extension, setExtension, setSubspaceAccount]
  )

  const handleRefreshBalance = useCallback(async () => {
    if (!api || !extension.data) throw new Error('API not set')

    const rawAccountDetails = await api.query.system.account(extension.data.defaultAccount.address)
    const accountDetails = rawAccountDetails.toJSON() as AccountDetails
    setAccountDetails(accountDetails)

    const balance = accountDetails.data.free
    console.log('balance', balance)
  }, [api, extension.data, setAccountDetails])

  const handleDisconnect = useCallback(() => setExtension(initialExtensionValues), [setExtension])

  useEffect(() => {
    if (extension.data) handleRefreshBalance()
  }, [extension.data, handleRefreshBalance])

  return {
    handleConnect,
    handleSelectFirstWalletFromExtension,
    handleSelectWallet,
    handleDisconnect,
    onConnectOpen,
    isConnectOpen,
    onConnectClose
  }
}
