<template>
  <div>

    <!-- contenteditable gives us more control over range selection -->
    <div contenteditable="true" :class="className" ref="input" @input="onInput()"></div>

    <div class="results_list">
      <div class="results_item" v-for="(item, index) in results">
        {{ item.name }}
        <br>
        {{ item.username }}
      </div>
    </div>

  </div>
</template>

<script>
export default {
  name: 'autocomplete',
  props: [
    'className',
    'userData'
  ],
  data () {
    return {
      search: '',
      results: []
    }
  },
  watch: {
    search () {
      if (this.search !== '') {
        this.results = this.userData.filter((item) => {
          return (
            item.name.toLowerCase().indexOf(this.search) > -1 ||
            item.username.toLowerCase().indexOf(this.search) > -1
          )
        })
      }
    }
  },
  methods: {
    onInput () {
      this.getWord()
    },

    getWord () {
      // barrowed from http://jsfiddle.net/timdown/dBgHn/1/
      let selection
      let range
      let word = ''

      if (window.getSelection && (selection = window.getSelection()).modify) {
        range = selection.getRangeAt(0)

        selection.collapseToStart()
        selection.modify('move', 'backward', 'word')
        selection.modify('extend', 'forward', 'word')

        word = selection.toString()

        selection.removeAllRanges()
        selection.addRange(range)
      } else if ((selection = document.selection) && selection.type !== 'Control') {
        range = selection.createRange()
        range.collapse(true)
        range.expand('word')
        word = range.text
      }

      this.search = word
    }
  }
}
</script>

<style>

</style>
