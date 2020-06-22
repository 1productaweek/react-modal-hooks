import React from 'react'
import ReactDOM from 'react-dom'

let counter = 0
export const ModalContext = React.createContext<ModalProvider | null>(null)

export interface ModalPromise<T> extends Promise<T> {
  id: number
}

export interface ModalProps<T = any> {
  onDone: (resolved?: T) => void
  onCancel: () => void
}

export interface ModalStackItem {
  id: number
  Component: React.ComponentType<any>
  props: any
  resolve: (data: any) => unknown
  reject: () => unknown
}

export interface ModalProviderState {
  stack: ModalStackItem[]
}

export interface ModalProviderProps {
  usePortal?: boolean
}

class ModalProvider extends React.Component<ModalProviderProps, ModalProviderState> {
  state = {
    stack: [] as ModalStackItem[],
  }

  // Add a modal to the stack
  push = (Component: React.ComponentType<any>, props?: any) => {
    const id = counter++
    const promise = (new Promise((resolve, reject) => {
      this.setState(({ stack }) => ({
        stack: [...stack, {
          id,
          Component,
          props: props || {},
          resolve,
          reject: () => resolve(null),
        }],
      }))
      // TODO: REFACTOR logic check this typing
    }).then((data: any) => {
      // HACK: we cannot run this immediately, otherwise the reference may be lost,
      // especially when using hooks
      setTimeout(() => {
        this.removeModal(id)
      }, 0)
      return data
    })) as ModalPromise<any>
    promise.id = id
    return promise
  }

  // TODO: it is not removed, last promise resolved and that is it
  // Remove the top modal from the stack
  pop = (resolveData: any) => {
    const { stack } = this.state
    stack[stack.length - 1].resolve(resolveData)
  }

  removeModal = (removeId: number) => {
    this.setState(({ stack }) => ({
      stack: stack.filter(({ id }) => id !== removeId),
    }))
  }

  componentDidUpdate () {
    if (!this.state.stack || this.state.stack.length === 0) {
      document.body.classList.remove('modal-provider-active')
    } else {
      document.body.classList.add('modal-provider-active')
    }
  }

  // Render the open modals
  render () {
    const { stack } = this.state
    const { children, usePortal } = this.props
    let modals: JSX.Element|JSX.Element[] = stack.map(({ id, Component, resolve, reject, props }) => {
      return (
        <Component
          {...props}
          modalProvider={this}
          key={id}
          show
          isOpen
          onCancel={reject}
          onDone={resolve}
        />
      )
    })

    if (usePortal) {
      modals = ReactDOM.createPortal((
        <>
          {modals}
        </>
      ), document.body)
    }

    return (
      <ModalContext.Provider value={this}>
        {children}
        {modals}
      </ModalContext.Provider>
    )
  }
}

export default ModalProvider
