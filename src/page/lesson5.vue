<template>
  <search></search>
</template>

<script lang="ts" setup>
import {ref} from "vue"
import search from "../components/search.vue"
let inputValue = ref('')
function searchClick() {
  console.log(inputValue.value)
}
</script>

<style scoped>

</style>