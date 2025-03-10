import { ReactNode } from 'react'
import { StateFSM, StatesFSM } from './types'
import { useStateMachine } from './useStateMachine'

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
        guard: (payload: { inserted: number; required: number }) => {
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

export const App = () => {
  const { currentState, transition } = useStateMachine({
    initialState: States.INACTIVE,
    states,
    onChangeState: (newState) => {
      console.log('Nuevo estado:', newState)
    }
  })

  const stateRenderMap: Record<keyof typeof States, ReactNode> = {
    [States.INACTIVE]: (
      <button
        onClick={() =>
          transition('ENTER_PRODUCT_ID', { inserted: 5, required: 3 })
        }
      >
        Ingresar ID de Producto
      </button>
    ),
    [States.PRODUCT_CHOSEN]: (
      <button onClick={() => transition('CONFIRM_PRODUCT', {})}>
        Confirmar Producto
      </button>
    ),
    [States.AWAITING_PAYMENT]: (
      <>
        <button
          onClick={() =>
            transition('ENTER_PRODUCT_ID', { inserted: 5, required: 3 })
          }
        >
          Ingresar ID de Producto
        </button>
        <button onClick={() => transition('WAIT_20_SECONDS', {})}>
          Pasan 20 segundos
        </button>
      </>
    ),
    [States.INSUFFICIENT_FUNDS]: (
      <button onClick={() => transition('INSERT_MORE_COINS', {})}>
        Insertar más monedas
      </button>
    ),
    [States.DISPENSING_PRODUCT]: (
      <>
        <button
          onClick={() => transition('PRODUCT_DELIVERED', { refundAmount: 0 })}
        >
          Producto entregado (Se regresa $0)
        </button>
        <button
          onClick={() => transition('PRODUCT_DELIVERED', { refundAmount: 10 })}
        >
          Producto entregado (Se regresan $10 - Se ejecuta acción )
        </button>
      </>
    ),
    [States.REFUNDING_PAYMENT]: (
      <button onClick={() => transition('COINS_RETURNED', {})}>
        Monedas regresadas
      </button>
    )
  }

  return (
    <div>
      <h1>Estado Actual: {currentState}</h1>
      {stateRenderMap[currentState]}
    </div>
  )
}
