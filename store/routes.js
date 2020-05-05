import Model from '@/models/route'
import BaseCRUDStore from '@/models/base_crud_store'

var store = BaseCRUDStore(Model, '/api/routes', { readAll: 'populate=ways' })

export const state = store.state

export const getters = store.getters

export const mutations = store.mutations

export const actions = store.actions