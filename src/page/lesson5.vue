<template>
  <search @on-success="searchClick"></search>
  <div class="content">
    <Row :gutter="24" v-if="prodList.value.length">
      <Col span="6" v-for="item in prodList.value" :key="item.prod_id">
        <prodItem :item="item"></prodItem>
      </Col>
    </Row>
    <div style="text-align: center">暂无数据</div>
  </div>
</template>

<script lang="ts" setup>
import {ref, getCurrentInstance, reactive} from "vue"
import $axios from "../axios/axios"
import search from "../components/search.vue"
import prodItem from "../components/prodItem.vue"

let originData:Array<object> = []

interface resType{
  data:{data: { list:Array<object> }}
}
interface prodType{
  value: Array<object>
}
let prodList:prodType = reactive({value: []})
function getProdListFun () {
  $axios({
    url: '/v1/zyp/ov/prod/list',
    data: {
      limit: 30,
      page:1,
      is_over: 1
    },
    method: 'post'
  }).then((res:resType) => {
    let data = res.data.data
    prodList.value = reactive(data.list)
    originData = data.list
  })
}
getProdListFun()

function searchClick(val:string) {
  if (!val) {
    prodList.value = originData
    return
  }
  let arr = []
  for (let item of originData) {
    if (item.prod_name.indexOf(val) !==-1) {
      arr.push(item)
    }
  }
  prodList.value = arr
}
</script>

<style scoped>
.content{
  width: 80%;margin: 0 auto;margin-top: 20px
}
</style>
