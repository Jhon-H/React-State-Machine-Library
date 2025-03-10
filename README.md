# React Finite State Machine

Libreria simple y flexible para manejar maquinas de estado finitos en aplicaciones React

## Installation

Usando npm:

```bash
npm install react-fsm-lite
```

Usando yarn:

```bash
yarn add react-fsm-lite
```

En tu proyecto React:

```javascript
import { useFiniteStateMachine } from 'react-fsm-lite'
```

## Ejemplo

Ejemplo de cómo usar la libreria

```javascript
const States: Record<string, StateFSM> = {
  INACTIVE: 'Inactivo',
  PRODUCT_CHOSEN: 'Producto seleccionado',
  AWAITING_PAYMENT: 'Esperando pago',
  DISPENSING_PRODUCT: 'Entregando producto',
  REFUNDING_PAYMENT: 'Regresando cambio',
  INSUFFICIENT_FUNDS: 'Fondos insuficientes'
}

const states: StatesFSM = {
  [States.INACTIVE]: {
    events: {
      ENTER_PRODUCT_ID: States.PRODUCT_CHOSEN
    }
  },
  [States.PRODUCT_CHOSEN]: {
    events: {
      CONFIRM_PRODUCT: States.AWAITING_PAYMENT
    }
  },
  [States.AWAITING_PAYMENT]: {
    events: {
      ENTER_PRODUCT_ID: {
        guard: (payload: { inserted: number, required: number }) => {
          if (payload.inserted >= payload.required) {
            return States.DISPENSING_PRODUCT
          }
          return States.INSUFFICIENT_FUNDS
        }
      },
      WAIT_20_SECONDS: States.INACTIVE
    }
  },
  [States.DISPENSING_PRODUCT]: {
    events: {
      PRODUCT_DELIVERED: {
        guard: (payload: { refundAmount: number }) => {
          if (payload.refundAmount > 0) return States.REFUNDING_PAYMENT
          return States.INACTIVE
        }
      }
    }
  },
  [States.INSUFFICIENT_FUNDS]: {
    events: {
      INSERT_MORE_COINS: States.AWAITING_PAYMENT
    }
  },
  [States.REFUNDING_PAYMENT]: {
    events: {
      COINS_RETURNED: States.INACTIVE
    },
    action: async () => {
      console.log('Processing refund...')
    }
  }
}

// En componente React
const { currentState, transition } = useStateMachine({
  initialState: States.INACTIVE,
  states,
  onChangeState: (newState) => {
    console.log('Nuevo estado:', newState)
  }
})
```
