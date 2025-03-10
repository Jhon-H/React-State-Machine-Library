import { StateFSM, StateMachineDefinition, StatesFSM } from './types'

export const createFSM = (
  initialState: StateFSM,
  states: StatesFSM
): StateMachineDefinition => ({
  initialState,
  states,
  transition: async (
    currentState,
    event,
    payload
  ): Promise<StateFSM | null> => {
    const state = states[currentState].events?.[event]
    if (!state) return null

    const newState =
      typeof state === 'object' ? await state.guard(payload) : state

    await states[newState].action?.()

    return newState
  }
})
