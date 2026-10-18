import { createPinia } from 'pinia'
import { createPersistence } from './persistence'

export const pinia = createPinia()

pinia.use(createPersistence())

export { persistenceError } from './persistence'
