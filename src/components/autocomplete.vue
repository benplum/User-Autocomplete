<template>
  <div>

    <textarea :class="className" ref="input"></textarea>

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
    }
  }
}
</script>

<style>

</style>
