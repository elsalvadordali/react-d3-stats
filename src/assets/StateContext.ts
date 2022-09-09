import { createContext } from "react";


export let states: string[] = []

export function removeState(index: number): void {
  states = states.filter((state: string, i: number) => i != index && state)
}
export function addState(state: string): void {
  states.push(state)
}

export const StateContext = createContext(states);

