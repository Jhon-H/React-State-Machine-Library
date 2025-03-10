/* eslint-disable @typescript-eslint/no-explicit-any */
export type StateFSM = string | number

export type EventFSM = string | number

export type GuardFSM = (payload: any) => StateFSM | Promise<StateFSM>

export type ActionFSM = () => void | Promise<void>

export interface StateWithGuardFSM {
  guard: GuardFSM
  action?: ActionFSM
}

export type StateTransitionsFSM = Record<EventFSM, StateFSM | StateWithGuardFSM>

export type StatesFSM = Record<
  StateFSM,
  {
    action?: ActionFSM
    events: StateTransitionsFSM
  }
>

export interface StateMachineDefinition {
  initialState: StateFSM
  states: StatesFSM
  transition: (
    currentState: StateFSM,
    event: string,
    payload: any
  ) => Promise<StateFSM | null>
}
