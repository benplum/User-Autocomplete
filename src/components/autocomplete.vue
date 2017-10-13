<template>
  <div>

    <!-- contenteditable gives us more control over range selection -->
    <div contenteditable="true" spellcheck="false" class="autocomplete" :class="className" ref="input"
      @keydown.up="onUp($event)"
      @keydown.down="onDown($event)"
      @keydown.enter="onEnter($event)"
      @keydown.left="clearResults()"
      @keydown.right="clearResults()"
      @input="onInput($event)"
      @textinput="onInput($event)"
      @blur="clearResults()"
    ></div>

    <div class="results_list"
      :class="{ 'open': results.length }"
      :style="{ 'top': offsetTop + 'px' }"
    >
      <div class="results_item" v-for="(item, index) in results"
        :class="{ 'active': (index == active) }"
        @mousedown="onResultClick($event, index)"
        @touchstart="onResultClick($event, index)"
      >
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
import rangy from 'rangy'
import 'rangy/lib/rangy-selectionsaverestore.js'
import 'rangy/lib/rangy-textrange.js'
import rangefix from 'rangefix'

export default {
  name: 'autocomplete',
  props: [
    'className', // Dynamic class attribute
    'userData' // Search data
  ],
  data () {
    return {
      value: '', // Our input's value
      search: '', // Current search text
      results: [], // Search results
      active: 0, // Selected result index
      offsetTop: 0 // Results list top position
    }
  },
  watch: {

    /*
     * Handle updates when search text changes
     */

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

    /*
     * Handle input event
     */

    onInput ($event) {
      this.setValue()

      let char

      if (typeof $event.data !== 'undefined') {
        // WebKit / Blink
        if ($event.data) {
          char = $event.data
        }
      } else if (window.getSelection) {
        // Firefox / IE / Edge
        let oldSelection = rangy.saveSelection()
        let selection = rangy.getSelection()
        selection.move('character', -1)
        selection.expand('character')

        char = selection.toString()

        rangy.restoreSelection(oldSelection)
      }

      // Test for letter keys only
      if (char && char.length === 1 && /[a-zA-Z0-9]/.test(char)) {
        this.getWord()
      } else {
        this.clearResults()
      }
    },

    /*
     * Handle arrow up keydown event
     */

    onUp ($event) {
      if (this.hasResults()) {
        $event.preventDefault()
        $event.stopPropagation()

        this.active--
        this.checkLimit()
      }
    },

    /*
     * Handle arrow down keydown event
     */

    onDown ($event) {
      if (this.hasResults()) {
        $event.preventDefault()
        $event.stopPropagation()

        this.active++
        this.checkLimit()
      }
    },

    /*
     * Handle enter keydown event
     */

    onEnter ($event) {
      if (this.hasResults()) {
        $event.preventDefault()
        $event.stopPropagation()

        this.insertUser()
        this.clearResults()
      }
    },

    /*
     * Handle item click
     */

    onResultClick ($event, index) {
      $event.preventDefault()

      this.active = index

      this.insertUser()
      this.clearResults()

      this.$refs.input.focus()
    },

    /*
     * Check if we have some results
     */

    hasResults () {
      return (this.search !== '' && this.results.length)
    },

    /*
     * Check selected result index
     */

    checkLimit () {
      if (this.active < 0) {
        this.active = 0
      }
      if (this.active >= this.results.length) {
        this.active = this.results.length - 1
      }
    },

    /*
     * Set the input value
     */

    setValue () {
      this.value = this.$refs.input.textContent
    },

    /*
     * Set the search text
     */

    setSearch (word) {
      if (word.length > 2) {
        this.search = word.toLowerCase()
      } else {
        this.clearResults()
      }
    },

    /*
     * Clear the current results
     */

    clearResults () {
      this.search = ''
      this.results = []
      this.active = 0
    },

    /*
     * Position the results list on the page, relative to the current range
     */

    positionResults (range) {
      let rects = rangefix.getClientRects(range.nativeRange)

      if (rects.length && rects[0].top) {
        this.offsetTop = rects[0].top + 24
      }
    },

    /*
     * Insert the currently selected result
     */

    insertUser () {
      let item = this.results[this.active]

      this.replaceWord(item.username)
      this.setValue()
    },

    /*
     * Select the current word being typed
     */

    getWord () {
      let selection
      let range
      let word = ''

      let oldSelection = rangy.saveSelection()
      selection = rangy.getSelection()
      selection.move('word', -1)
      selection.expand('word')

      word = selection.toString()

      rangy.restoreSelection(oldSelection)

      selection = rangy.getSelection()
      range = selection.getRangeAt(0)

      this.setSearch(word)
      this.positionResults(range)
    },

    /*
     * Replace the current word with new text
     */

    replaceWord (word) {
      let selection
      let range

      word += '\u00A0'

      selection = rangy.getSelection()
      selection.move('word', -1)
      selection.expand('word')

      range = selection.getRangeAt(0)
      range.pasteHtml(word)

      selection = rangy.getSelection()
      selection.move('word', 1)
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
  max-width: 300px;
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
