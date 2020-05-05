import Model from '@/models/bus'

import BaseCRUDStore from '@/models/base_crud_store'

var store = BaseCRUDStore(Model, '/api/buses', { readAll: 'populate=drivers&populate=way.route' })

export const state = store.state

export const getters = store.getters

export const mutations = store.mutations

export const actions = store.actions