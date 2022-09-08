import { createContext } from "react";


export let states = ['hello', 'ass']

export function removeState(index: number) {
  states = states.filter((state: string, i: number) => i != index && state)
  console.log(states)
}
export function addState(state: string) {
  states.push(state)
  console.log(states)
} 


export const StateContext = createContext(states);

