import { useState } from 'react'
import { StateFSM, StatesFSM } from './types'
import { createFSM } from './state-machine'

interface Props {
  initialState: StateFSM
  states: StatesFSM
  onChangeState?: (state: StateFSM) => void
}

export const useStateMachine = <T>({
  initialState,
  states,
  onChangeState
}: Props) => {
  const machine = createFSM(initialState, states)
  const [currentState, setCurrentState] = useState<StateFSM>(
    machine.initialState
  )

  const transition = async (event: string, payload: T) => {
    const newState = await machine.transition(currentState, event, payload)

    if (newState) {
      setCurrentState(newState)
      onChangeState?.(newState)
    }
  }

  return { currentState, transition }
}
