import { writable, derived } from 'svelte/store'

export const innerWidth = writable(0)

export const outerWidth = writable(960)

export const mobile = derived(innerWidth, $innerWidth => $innerWidth < 480)
