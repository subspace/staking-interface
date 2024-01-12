import { useToast } from '@chakra-ui/react'
import { useTranslation } from 'next-i18next'
import { useCallback } from 'react'
import { SuccessTxToast } from '../components/toasts'
import { ERROR_WALLET_NOT_FOUND, toastConfig } from '../constants'
import { useExtension, useTransactions } from '../states/extension'
import { Registration } from '../types'

export const useTx = () => {
  const { t } = useTranslation()
  const toast = useToast()
  const { api, extension, subspaceAccount, injectedExtension } = useExtension()
  const { addTransactionToWatch } = useTransactions()

  const handleRegisterOperator = useCallback(
    async (registration: Registration) => {
      if (!api || !extension.data || !injectedExtension || !subspaceAccount)
        return toast({
          ...ERROR_WALLET_NOT_FOUND,
          ...toastConfig,
          status: 'error'
        })
      if (extension.data) {
        const block = await api.rpc.chain.getBlock()
        const hash = await api.tx.domains
          .registerOperator(registration.domainId, registration.amountToStake, {
            signingKey: registration.signingKey,
            minimumNominatorStake: registration.minimumNominatorStake,
            nominationTax: registration.nominatorTax
          })
          .signAndSend(extension.data?.defaultAccount.address, { signer: injectedExtension.signer })
        addTransactionToWatch({
          extrinsicHash: hash.toString(),
          method: 'registerOperator',
          sender: subspaceAccount,
          fromBlockNumber: block.block.header.number.toNumber(),
          parameters: [
            registration.domainId,
            registration.amountToStake,
            JSON.stringify({
              signingKey: registration.signingKey,
              minimumNominatorStake: registration.minimumNominatorStake,
              nominationTax: registration.nominatorTax
            })
          ]
        })
        toast({
          ...toastConfig,
          isClosable: true,
          render: () => (
            <SuccessTxToast
              heading={t('infos.registrationSend.title')}
              description={t('infos.registrationSend.description')}
              hash={hash.toString()}
            />
          )
        })
        return hash
      }
      return
    },
    [addTransactionToWatch, api, extension.data, injectedExtension, subspaceAccount, t, toast]
  )

  const handleDeregister = useCallback(
    async (operatorId: string) => {
      if (!api || !extension.data || !injectedExtension || !subspaceAccount)
        return toast({
          ...ERROR_WALLET_NOT_FOUND,
          ...toastConfig,
          status: 'error'
        })
      if (extension.data) {
        const block = await api.rpc.chain.getBlock()
        const hash = await api.tx.domains
          .deregisterOperator(operatorId)
          .signAndSend(extension.data?.defaultAccount.address, { signer: injectedExtension.signer })
        addTransactionToWatch({
          extrinsicHash: hash.toString(),
          method: 'deregisterOperator',
          sender: subspaceAccount,
          fromBlockNumber: block.block.header.number.toNumber(),
          parameters: [operatorId]
        })
        toast({
          ...toastConfig,
          isClosable: true,
          render: () => (
            <SuccessTxToast
              heading={t('infos.deregisterOperatorSend.title')}
              description={t('infos.deregisterOperatorSend.description')}
              hash={hash.toString()}
            />
          )
        })
      }
      return
    },
    [addTransactionToWatch, api, extension.data, injectedExtension, subspaceAccount, t, toast]
  )

  const handleAddFunds = useCallback(
    async (operatorId: string, amount: string) => {
      if (!api || !extension.data || !injectedExtension || !subspaceAccount)
        return toast({
          ...ERROR_WALLET_NOT_FOUND,
          ...toastConfig,
          status: 'error'
        })
      if (extension.data) {
        const block = await api.rpc.chain.getBlock()
        const hash = await api.tx.domains
          .nominateOperator(operatorId, amount)
          .signAndSend(extension.data?.defaultAccount.address, { signer: injectedExtension.signer })
        addTransactionToWatch({
          extrinsicHash: hash.toString(),
          method: 'nominateOperator',
          sender: subspaceAccount,
          fromBlockNumber: block.block.header.number.toNumber(),
          parameters: [operatorId, amount]
        })
        toast({
          ...toastConfig,
          isClosable: true,
          render: () => (
            <SuccessTxToast
              heading={t('infos.nominateOperatorSend.title')}
              description={t('infos.nominateOperatorSend.description')}
              hash={hash.toString()}
            />
          )
        })
      }
      return
    },
    [addTransactionToWatch, api, extension.data, injectedExtension, subspaceAccount, t, toast]
  )

  const handleWithdraw = useCallback(
    async (operatorId: string, amount: string) => {
      if (!api || !extension.data || !injectedExtension || !subspaceAccount)
        return toast({
          ...ERROR_WALLET_NOT_FOUND,
          ...toastConfig,
          status: 'error'
        })
      if (extension.data) {
        const block = await api.rpc.chain.getBlock()
        const hash = await api.tx.domains
          .withdrawStake(operatorId, {
            Some: amount
          })
          .signAndSend(extension.data?.defaultAccount.address, { signer: injectedExtension.signer })
        addTransactionToWatch({
          extrinsicHash: hash.toString(),
          method: 'withdrawStake',
          sender: subspaceAccount,
          fromBlockNumber: block.block.header.number.toNumber(),
          parameters: [operatorId, JSON.stringify({ Some: amount })]
        })
        toast({
          ...toastConfig,
          isClosable: true,
          render: () => (
            <SuccessTxToast
              heading={t('infos.withdrawStakeSend.title')}
              description={t('infos.withdrawStakeSend.description')}
              hash={hash.toString()}
            />
          )
        })
      }
      return
    },
    [addTransactionToWatch, api, extension.data, injectedExtension, subspaceAccount, t, toast]
  )

  return {
    handleRegisterOperator,
    handleDeregister,
    handleAddFunds,
    handleWithdraw
  }
}
