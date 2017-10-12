<template>
  <div id="app">

    <form action="#" class="form comment_form">
      <label class="form_label">Your Comment</label>
      <autocomplete className="form_input" :userData="userData"></autocomplete>
      <button class="form_button">Post</button>
    </form>

  </div>
</template>

<script>
import axios from 'axios'
import Autocomplete from './components/autocomplete.vue'

export default {
  name: 'app',
  components: {
    Autocomplete
  },
  data () {
    return {
      userData: {}
    }
  },
  mounted () {
    this.loadUserData()
  },
  methods: {
    loadUserData () {
      // Load the user data for use elsewhere
      let p = axios.get('static/data.json')

      p.then((response) => {
        this.userData = response.data
      })

      p.catch((error) => {
        console.log(error)
      })
    }
  }
}
</script>

<style>
*,
*:before,
*:after {
  box-sizing: border-box;
}

body {
  margin: 0;
  padding: 0;
}

#app {
  font-family: helvetica, sans-serif;
  font-size: 14px;
  padding: 20px;
}

.comment_form {}

.form_label {
  display: block;
  font-size: 14px;
  margin: 0 0 5px;
}

.form_input {
  border: 1px solid #999;
  border-radius: 2px;
  font-size: 14px;
  height: 100px;
  margin: 0 0 5px;
  overflow-y: scroll;
  padding: 10px;
  width: 100%;
}

.form_button {
  background: #666;
  border: none;
  border-radius: 2px;
  color: #fff;
  font-size: 12px;
  padding: 8px 16px;
  text-transform: uppercase;
}
</style>
