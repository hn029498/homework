<template>
  <div class="search">
    <Input v-model="inputValue" search enter-button placeholder="请输入商品名称" @on-search="searchClick"/>
    <div v-if="searchHistory.length">
      <p>搜索记录</p>
      <Tag class="icon" v-for="item in searchHistory" :key="item" @click="historySearch(item)">{{item}}</Tag>
      <Icon class="icon" size="20" type="ios-trash-outline" @click="deleteClick"/>
<!--      <Button shape="circle" icon="ios-trash-outline"></Button>-->
    </div>
  </div>
</template>

<script lang="ts" setup>
import {ref,watch} from "vue"
let inputValue = ref('')
let searchHistory:Array<string> = ref([])

if (localStorage.getItem('searHistory')) {
  searchHistory.value = JSON.parse(localStorage.getItem('searHistory'))
}

// watch(searchHistory,val => {
//   localStorage.setItem('searHistory',JSON.stringify(val))
// })
function searchClick() {
  let val:string = inputValue.value
  searchHistory.value.push(val)
  localStorage.setItem('searHistory',JSON.stringify(searchHistory.value))

}
function deleteClick() {
  searchHistory.value = []
  localStorage.setItem('searHistory',JSON.stringify(searchHistory.value))
}
function historySearch(val) {
  inputValue.value = val
}
</script>

<style scoped>
.icon{
  cursor: pointer;
  vertical-align: middle;
}
.search{
  width: 80%;
  margin: 0 auto;
}
</style>