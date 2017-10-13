import Vue from 'vue'
import autocomplete from '@/components/autocomplete'
import data from '@/../static/data.json'

describe('autocomplete.vue', () => {
  it('should find results for "patri"', (done) => {
    const Constructor = Vue.extend(autocomplete)
    const vm = new Constructor({
      propsData: {
        userData: data
      }
    }).$mount()

    vm.setSearch('patri')

    Vue.nextTick(() => {
      expect(vm.$el.querySelectorAll('.results_item').length).to.equal(2)
      done()
    })
  })

  it('should not find results for "asd"', (done) => {
    const Constructor = Vue.extend(autocomplete)
    const vm = new Constructor({
      propsData: {
        userData: data
      }
    }).$mount()

    vm.setSearch('asd')

    Vue.nextTick(() => {
      expect(vm.$el.querySelectorAll('.results_item').length).to.equal(0)
      done()
    })
  })
})
