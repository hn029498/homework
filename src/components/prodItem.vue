<script setup>
import { ref } from 'vue'

defineProps({
  item: {}
})

const count = ref(0)
</script>

<template>
  <Card class="prod-card" :body-style="{ padding: '0px' }">
    <Image class="prod-img" :src="item.pic" alt="" fit="cover"></Image>
    <p class="prod-name">{{item.prod_name}}</p>
    <p class="prod-price">￥{{item.price}}</p>
  </Card>
</template>

<style scoped>
.read-the-docs {
  color: #888;
}
.prod-card{
  width: 200px;
  position: relative;
  margin-bottom: 20px;
}
.prod-card p{
  margin: 0;
}
.prod-name {
  -webkit-line-clamp: 2;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  height: 60px;
  line-height: 30px;
  text-align: left;
  padding: 0 10px;
}
.prod-img{
  width: 100%;
  height: 200px;
  border-bottom: 1px solid #eee;
}
.prod-price{
  text-align: left;
  padding-left:10px ;
  color: #e01515;
  font-weight: 600;
  font-size: 18px;
}
</style>
