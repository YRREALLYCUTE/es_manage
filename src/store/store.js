import Vue from 'vue'
import Vuex from 'vuex'
import {getAdminInfo} from '@/api/getData'

Vue.use(Vuex)

const state = {
  userInfo: {
    id: '1',
    username: 'admin',
    role: 'admin'
  },
}

const mutations = {
  saveUserInfo(state, adminInfo){
    state.userInfo = adminInfo;
  }
}

const actions = {
  async getAdminData({commit}){
    try{
      const res = await getAdminInfo()
      console.log('here is store')
      console.log(res)
      if (res.status == 1) {
        commit('saveAdminInfo', res.data);
      }else{
        throw new Error(res.type)
      }
    }catch(err){
// console.log(err.message)
    }
  }
}

export default new Vuex.Store({
  state,
  actions,
  mutations,
})
