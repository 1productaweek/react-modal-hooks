# React Modal Hooks

Simple library to help loading modals in a more async way, and auto cleans up modals after they've been resolved.

## Usage

#### Step 1 - Add the modal provider

Add the modal provider to the root of your app (you can add it multiple times, but there is no need).

```jsx

import { ModalProvider } from '@1productaweek/react-modal-hooks'

<ModalProvider usePortal>
  ...
</ModalProvider>
```

#### Step 2 - Create a modal

Create a custom modal (or use a library e.g. [react-modal](https://github.com/reactjs/react-modal)). The following props
will be injected into your modal component when you open it:

  * `onDone(resolvedValue?: any)` - close the modal and optionally return a value to the calling handler
  * `onCancel()` - close the modal, by rejecting the promise

NOTE: Make sure your component is always showing the modal, as this library will take care to unmount and hide the modal when it is no
longer needed.

```jsx
import React from 'react'
import Modal from 'react-modal'

// onCancel and onDone are injected into your modal for you
function MyModal ({ onCancel, onDone }) {
  return (
    <Modal 
      onRequestClose={onCancel}
      // Make sure isOpen is always true
      isOpen
    >
      <button onClick={onCancel}>Cancel</button>
      <button onClick={onDone}>Done</button>
    </Modal>
  )
}
```

#### Step 3 - Open modal with hooks
Open the modal and wait for the resolved value using hooks.

```jsx
import React from 'react'
import { useModal } from '@1productaweek/react-modal-hooks'
import MyModal from '...'

function AnyComponent ({ onCancel, onDone }) {
  const showModal = useModal(MyModal)

  const onPaymentHandler = async () => {
    // paymentDetails is any value that you passed to the onDone() callback
    const paymentDetails = await showModal({ ...propsToPassToModal })
    alert(`You paid with ${paymentDetails}`)
  }

  return (
    <button onClick={onPaymentHandler}>
      Make Payment
    </button>
  )
}
```


### Made by 1PAW

https://1productaweek.com
  * |- [Ralley](https://ralley.io) - queue as a service
  * |- [Snapboard](https://snapboard.io) - hackable dashboard
