import { useContext, useMemo } from 'react'
import { ModalContext } from './ModalProvider'

const useModal = <T>(Modal: React.ComponentType<T>) => {
  const modalProvider = useContext(ModalContext)
  if (!modalProvider) {
    throw new Error('useModal must be used in ModalProvider context')
  }

  return useMemo(() => {
    const fn = (props?: any) => modalProvider.push(Modal, props)
    fn.modalProvider = modalProvider
    return fn
  }, [Modal, modalProvider])
}

export default useModal
