import { Button, ButtonProps } from '@chakra-ui/react'
import { useTranslation } from 'next-i18next'
import dynamic from 'next/dynamic'
import React, { useEffect, useState } from 'react'
import { buttonStyles, connectWalletButtonStyles } from '../constants'

const Connect = dynamic(() => import('./wallet').then((m) => m.ConnectWallet), {
  ssr: false
})

export const FormButton: React.FC<ButtonProps> = ({ children, onClick }) => {
  return (
    <Button {...buttonStyles} onClick={onClick}>
      {children}
    </Button>
  )
}

export const ConnectWallet: React.FC<ButtonProps> = ({ onClick }) => {
  const { t } = useTranslation()
  const [clientSide, setClientSide] = useState(false)

  useEffect(() => {
    setClientSide(true)
  }, [])

  if (!clientSide)
    return (
      <Button {...connectWalletButtonStyles} onClick={onClick}>
        {t('components.buttons.connectWallet')}
      </Button>
    )

  return <Connect />
}
