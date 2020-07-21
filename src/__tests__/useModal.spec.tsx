import React from 'react'
// import { render, fireEvent, waitFor, screen } from '@testing-library/react'
import { renderHook, act } from '@testing-library/react-hooks'
import '@testing-library/jest-dom/extend-expect'
import useModal from '../useModal'
import ModalProvider from '../ModalProvider'

describe('useModal.spec', () => {
  test('returns fn', () => {
    const wrapper = ({ children }: any) => <ModalProvider>{children}</ModalProvider>
    const Modal = ({ a, onDone }: { a: string, onDone: () => void }) => <div>HelloWorld</div>
    const { result } = renderHook(() => useModal(Modal), { wrapper })
    expect(typeof result.current).toBe('function')
  })
})
