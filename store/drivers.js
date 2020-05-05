import Model from '@/models/driver'
import BaseCRUDStore from '@/models/base_crud_store'

var store = BaseCRUDStore(Model, '/api/drivers', { readAll: 'populate=bus' })

export const state = store.state

export const getters = store.getters

export const mutations = store.mutations

export const actions = store.actions