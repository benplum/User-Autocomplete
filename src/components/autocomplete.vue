<template>
  <div>

    <!-- contenteditable gives us more control over range selection -->
    <div contenteditable="true" class="autocomplete" :class="className" @input="onInput()" @keydown.up="onUp($event)" @keydown.down="onDown($event)" @keydown.enter="onEnter($event)"></div>

    <div class="results_list" :class="{ 'open': results.length }" :style="{ 'top': offsetTop + 'px' }">
      <div class="results_item" v-for="(item, index) in results" :class="{ 'active': (index == active) }">
        <img :src="item.avatar_url" alt="" class="results_item_image">
        <div class="results_item_content">
          <span class="results_item_name">{{ item.name }}</span>
          <span class="results_item_username">{{ item.username }}</span>
        </div>
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
      active: 0,
      offsetTop: 0
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

    // Input Events

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

    // Helpers

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
    setSearch (word) {
      if (word.length > 2) {
        this.setSearch(word)
      } else {
        this.clearResults()
      }
    },
    clearResults () {
      this.search = ''
      this.results = []
      this.active = 0
    },

    //

    positionResults (range) {
      let position = range.getBoundingClientRect()

      if (position) {
        this.offsetTop = position.y + 24
      }
    },

    // User

    insertUser () {
      let item = this.results[this.active]

      this.replaceWord(item.username)
    },

    // Range manipulation

    getWord () {
      // barrowed from http://jsfiddle.net/timdown/dBgHn/1/
      let selection = window.getSelection()
      let range = selection.getRangeAt(0)
      let word = ''

      selection.collapseToStart()
      selection.modify('move', 'backward', 'word')
      selection.modify('extend', 'forward', 'word')

      word = selection.toString()

      selection.removeAllRanges()
      selection.addRange(range)

      this.setSearch(word)
      this.positionResults(range)
    },
    replaceWord (word) {
      let selection = window.getSelection()
      let range

      word += '\u00A0'

      selection.collapseToStart()
      selection.modify('move', 'backward', 'word')
      selection.modify('extend', 'forward', 'word')

      range = selection.getRangeAt(0)

      range.deleteContents()
      range.insertNode(document.createTextNode(word))

      selection.modify('move', 'forward', 'character')
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
  margin: 0 0 0 10px;
  opacity: 0;
  position: absolute;
  transform: scale(0.5);
  transform-origin: left top;
  visibility: hidden;
  width: 80%;
  min-width: 200px;
}
  .results_list.open {
    opacity: 1;
    transform: scale(1);
    visibility: visible;
    transition:
      opacity 0.1s linear,
      transform 0.1s ease,
      visibility 0.1s linear;
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
