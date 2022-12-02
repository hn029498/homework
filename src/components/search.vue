<template>
  <div class="search">
    <Input v-model="inputValue" search enter-button clearable placeholder="请输入商品名称" @on-search="searchClick" @on-clear="searchClick"/>
    <div v-if="searchHistory.length" style="margin-top: 10px">
      <span>搜索记录 </span>
      <Tag class="icon" v-for="item in searchHistory" :key="item" @click="historySearch(item)">{{item}}</Tag>
      <Icon class="icon" size="20" type="ios-trash-outline" @click="deleteClick"/>
<!--      <Button shape="circle" icon="ios-trash-outline"></Button>-->
    </div>
  </div>
</template>

<script lang="ts" setup>
import {ref,getCurrentInstance} from "vue"

const _this = getCurrentInstance().appContext.config.globalProperties
let emit = defineEmits(["alertSome"])
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
  if (val && !searchHistory.value.includes(val)) searchHistory.value.unshift(val)
  localStorage.setItem('searHistory',JSON.stringify(searchHistory.value))
  emit("onSuccess",inputValue.value)

}
function deleteClick() {
  searchHistory.value = []
  localStorage.setItem('searHistory',JSON.stringify(searchHistory.value))
}
function historySearch(val:string) {
  inputValue.value = val
  emit("onSuccess",inputValue.value)
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
