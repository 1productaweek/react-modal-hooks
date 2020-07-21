import { useContext, useMemo } from 'react'
import { ModalContext } from './ModalProvider'

export interface ModalProps {
  onDone: (prop: any) => void
}

const useModal = <T extends ModalProps>(Modal: React.ComponentType<T>) => {
  const modalProvider = useContext(ModalContext)
  if (!modalProvider) {
    throw new Error('useModal must be used in ModalProvider context')
  }

  return useMemo(() => {
    const fn = (props: T): Promise<Parameters<T['onDone']>[0]> => modalProvider.push(Modal, props)
    fn.modalProvider = modalProvider
    return fn
  }, [Modal, modalProvider])
}

export default useModal
