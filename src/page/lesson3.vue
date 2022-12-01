<script lang="ts">
import { defineComponent,ref,getCurrentInstance } from 'vue';
export default defineComponent({
  setup() {
    // 获取全局方法
    const _this = getCurrentInstance().appContext.config.globalProperties
    interface itemType{
      name: string|undefined
      state: string|number
      create_time: string
      finish_time:string
    }
    interface planType extends itemType{
      list:Array<itemType>
    }
    class itemClass implements itemType{
      name: string|undefined
      state: number
      create_time:string
      finish_time: string
      constructor(name?:string|undefined) {
        this.create_time =  _this.$Date().format('YYYY-MM-DD HH:mm:ss')
        this.name  = name || this.name
        this.state = 1
        this.finish_time = ''
      }
      finish() {
        this.finish_time = _this.$Date().format('YYYY-MM-DD HH:mm:ss')
        this.state = 0
      }
    }
    class planClass implements planType{
      name: string|undefined
      state: number
      create_time:string
      finish_time: string
      list: Array<itemType>
      constructor(name?:string|undefined,list?:Array<itemType>) {
        this.create_time =  _this.$Date().format('YYYY-MM-DD HH:mm:ss')
        this.name  = name || this.name
        this.state = 1
        this.finish_time = ''
        this.list = list || []
      }
      finish() {
        this.finish_time = _this.$Date().format('YYYY-MM-DD HH:mm:ss')
        this.state = 0
      }
    }
    // 新增计划
    let newPlan = () =>{
      let plan = new planClass('')
      planData.value.push(plan)
    }
    // 新增事项
    let newItem = (index:number) =>{
      let plan = new itemClass('')
      planData.value[index].list.push(plan)
    }
    //
    let radioChange = (pid:number,lid:number,name:string) => {
      let item = new itemClass(name)
      item.finish()
      planData.value[pid].list[lid] = item
    }
    // 完成计划
    let finishPlanClick = (pid:number,name:string,list:Array<itemType>) => {
      let plan = new planClass(name,list)
      plan.finish()
      planData.value[pid] = plan
    }
    // 定义输出数据
    let planData:Array<object> = ref<Array<object>>([])
    return{
      planData,
      newPlan,
      newItem,
      radioChange,
      finishPlanClick
    }
  },
})
</script>
<template>
  <div>
    <Button @click="newPlan">新增计划</Button>
    <div  class="plan">
      <Card class="plan-card" v-for="(plan,pid) in planData">
        <template #title>
          <input :class="{'finish':plan.finish_time}" type="text" v-model="plan.name" placeholder="请输入..." :readonly="plan.finish_time!=''">
          <span class="title-extra" v-if="plan.finish_time">{{plan.finish_time}}</span>
          <Button class="title-extra" type="success" @click="finishPlanClick(pid,plan.name,plan.list)" v-else>完成</Button>
        </template>
        <List class="item-list" v-if="plan.list.length">
          <template v-for="(item,lid) in plan.list">
            <ListItem style="display: flex;justify-content: space-between">
              <div>
                <radio v-model="item.state" :true-value="0" :false-value="1" @change.stop="radioChange(pid,lid,item.name)">
                </radio>
                <input v-if="item.state" type="text" v-model="item.name" placeholder="请输入...">
                <span class="finish" v-else>{{item.name}}</span>
              </div>
              <template #extra>
<!--                <span class="extra">-->
                  {{item.finish_time}}
<!--                </span>-->
              </template>
            </ListItem>
          </template>
          <template #footer>

          </template>
        </List>
        <Button @click="newItem(pid)">新增事项</Button>
      </Card>
    </div>
  </div>
</template>
<style>
.plan{
  /*display: flex;*/
}
.plan-card{
  margin-top: 20px;
  margin-right: 20px;
  width: 300px;
  display: inline-block;
}
.plan-card input{
  border: 0;
}
.finish{
  /*text-decoration:;*/
  text-decoration: line-through;
  color: #999;
}
.title-extra{
  float: right;
  height: 24px;
  /*margin-top: -8px;*/
}

</style>