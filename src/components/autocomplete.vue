<template>
  <div>

    <!-- contenteditable gives us more control over range selection -->
    <div contenteditable="true" :class="className" @input="onInput()" @keydown.up="onUp($event)" @keydown.down="onDown($event)" @keydown.enter="onEnter($event)"></div>

    <div class="results_list">
      <div class="results_item" v-for="(item, index) in results" :class="{ 'active': (index == active) }">
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
      results: [],
      active: 0
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
    onUp ($event) {
      if (this.hasInput()) {
        $event.preventDefault()

        this.active--
        this.checkLimit()
      }
    },
    onDown ($event) {
      if (this.hasInput()) {
        $event.preventDefault()

        this.active++
        this.checkLimit()
      }
    },
    onEnter ($event) {
      if (this.hasInput()) {
        $event.preventDefault()

        this.insertUser()
        this.clearResults()
      }
    },

    hasInput () {
      return (this.search !== '' && this.results.length)
    },
    checkLimit () {
      if (this.active < 0) {
        this.active = 0
      }
      if (this.active >= this.results.length) {
        this.active = this.results.length - 1
      }
    },

    clearResults () {
      this.search = ''
      this.results = []
      this.active = 0
    },

    insertUser () {
      let item = this.results[this.active]

      this.replaceWord(item.username)
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
      } else if ((selection = document.selection) && selection.createRange()) {
        range = selection.createRange()
        range.collapse(true)
        range.expand('word')
        word = range.text
      }

      this.search = word
    },
    replaceWord (word) {
      let selection
      let range

      word += '\u00A0'

      if (window.getSelection && (selection = window.getSelection()).modify) {
        selection.collapseToStart()
        selection.modify('move', 'backward', 'word')
        selection.modify('extend', 'forward', 'word')

        range = selection.getRangeAt(0)

        range.deleteContents()
        range.insertNode(document.createTextNode(word))

        selection.modify('move', 'forward', 'character')
      } else if ((selection = document.selection) && selection.type !== 'Control') {
        range = selection.createRange()
        range.collapse(true)
        range.expand('word')
        range.text = word
      }
    }

  }
}
</script>

<style>
.results_list {
  background: #fff;
  border: 1px solid #999;
  border-radius: 2px;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.5);
}

.results_item {
  align-items: flex-start;
  display: flex;
  padding: 10px;
}
  .results_item.active {
    background: #eee;
  }

.results_item_image {
  border: 2px solid #fff;
  border-radius: 100%;
  display: block;
  margin: 0 10px 0 0;
  width: 30px;
  height: 30px;
}

.results_item_name {
  color: #000;
  display: block;
  font-size: 14px;
}

.results_item_username {
  color: #666;
  display: block;
  font-size: 12px;
}
</style>
