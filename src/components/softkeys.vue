<template>
  <div class="software-keys">
        <span class="software-keys__key software-keys__left">{{softkeys.left}}</span>
        <span class="software-keys__key software-keys__center">{{softkeys.center}}</span>
        <span class="software-keys__key software-keys__right">{{softkeys.right}}</span>
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  computed: mapState(['softkeys'])
}
</script>

<style>
</style>