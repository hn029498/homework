<template>
  <div>
    <Button @click="newGoal">新增目标</Button>
    <Table style="width: 1200px" row-key="id" :columns="columns" :data="dataList" border>
      <template #action="{ row, index }">
        <Button type="primary" size="small" style="margin-right: 5px" @click="breakGoal(index)" v-if="!row.isChild&&!row.finish_time">分解目标</Button>
        <Button @click="stopOrOpen(index)" size="small" style="margin-right: 5px" v-if="!row.finish_time">{{row.state === 2 ? '开启':'暂停'}}</Button>
        <Button size="small" style="margin-right: 5px" @click="taskClick">计划管理</Button>
        <Button type="success" size="small" @click="finish(index)" v-if="!row.finish_time">完成</Button>
<!--        <Button type="error" size="small" @click="remove(index)">Delete</Button>-->
      </template>
    </Table>
    <Modal v-model="modal"
    title="新建目标"
    @on-ok="ok"
    @on-cancel="cancel">
      <Form ref="form" :model="formData"  :label-width="80">
        <FormItem label="目标名称" prop="name">
          <i-input v-model="formData.name" placeholder="请输入" clearable>
          </i-input>
        </FormItem>
        <FormItem label="有效期限" prop="date">
          <DatePicker v-model="date"
                      format="yyyy-MM-dd"
                      type="daterange"
                      placement="bottom-end"
                      placeholder="选择期限"
                      style="width: 200px" />
        </FormItem>
        <FormItem label="具体内容" prop="desc">
          <Input v-model="formData.desc" type="textarea" :rows="4" placeholder="请选择" />
        </FormItem>
      </Form>
    </Modal>
<!--    计划管理-->
    <Modal v-model="taskModal" title="计划管理" width="800">
<!--      <div>-->
<!--        <Button size="small" type="primary">新建计划</Button>-->
<!--      </div>-->
<!--      <Card class="task-card"></Card>-->
      <task></task>
    </Modal>
  </div>
</template>

<script lang="ts">
import { defineComponent,ref,getCurrentInstance,reactive} from 'vue';
import {columns} from "./index"
import task from '../lesson3.vue'
export default defineComponent({
  components: {task},
  setup() {
    // 获取全局方法
    const _this = getCurrentInstance().appContext.config.globalProperties
    const {proxy} = getCurrentInstance()
    // 状态类型
    enum stateEnum {
      已创建,
      进行中,
      暂停,
      完成,
      未完成
    }
    // 定义目标类型
    interface goalType {
      name: String // 名称
      term: String // 时限
      create_time?: String // 创建时间
      state?:stateEnum //状态
      stateStr?: String
      children?: Array<goalType> // 子目标
      desc?: String // 描述
      finish_time?:String // 完成时间
      isChild?: Number
    }
    // 定义目标类
    class goalClass implements goalType{
      name: String // 名称
      term: String // 时限
      create_time?: String // 创建时间
      state?:stateEnum //状态
      stateStr?: String
      children?: Array<goalType> // 子目标
      desc?: String // 描述
      isChild?: Number
      // finish_time?:String // 完成时间
      constructor(row:goalType) {
        this.isChild = row.isChild || 0
        this.name = row.name
        this.term = row.term
        this.create_time = row.create_time || _this.$Date().format('YYYY-MM-DD HH:mm:ss')
        this.state = row.state || stateEnum.已创建
        this.stateStr = stateEnum[0]
        this.children = row.children
        this.desc = row.desc
      }
    }
    // 定义新建子目标类
    class goalChildClass extends goalClass{

      // constructor(row:goalType) {
      //   super(row);
        // this.isChild = 0
        // this.create_time = ''
        // this.create_time = _this.$Date().format('YYYY-MM-DD HH:mm:ss')
      // }
      createChild(row:goalType) {
        row.isChild = 1
        let child = new goalClass(row)
        if(this.children) {
          this.children.unshift(child)
        } else {
          this.children = [child]
        }
      }
    }
    // 定义完成目标类
    class goalFinishClass extends goalClass {
      finish_time?:String // 完成时间
      finish() {
        this.finish_time = _this.$Date().format('YYYY-MM-DD HH:mm:ss')
        this.state = stateEnum.完成
        this.stateStr = stateEnum[3]
      }
      unFinish() {
        this.state = stateEnum.未完成
      }
    }
    // 定义暂停/开启目标类
    class goalStopOrOpenClass extends goalClass {
      stop() {
        this.state = stateEnum.暂停
        this.stateStr = stateEnum[2]
      }
      open() {
        this.state = stateEnum.进行中
        this.stateStr = stateEnum[1]
        // this.term = term
      }
    }
    // 定义变量
    let dataList:Array<goalType> = reactive([])
    let formData:goalType = reactive({
      name: '',
      term: '',
    })
    let modal = ref(false)
    let date = ref([])
    let taskModal = ref(false)
    let currentChild = {},currentIndex = 0,isChild = 0
    /*
    * 方法*/
    function filterData() {
      let dateArr= []
      if (date.value) {
        dateArr = date.value.map(item => {
          return _this.$Date(item).format('YYYY-MM-DD')
        })
      }
      let obj = {
        term: dateArr.join('至'),
      }
      formData = Object.assign(formData,obj)
    }
    // 分解方法
    function breakGoal(i:number) {
      newGoal()
      currentIndex = i
      isChild = 1
    }
    // 暂停或开启
    function stopOrOpen(i:number) {
      let childGoal = new goalStopOrOpenClass(dataList[i])
      // console.log(childGoal.state)
      // if (childGoal.state === 2) {
      //   childGoal.open()
      // } else {
      //   childGoal.stop()
      // }
      childGoal.state === 2 ? childGoal.open() :childGoal.stop()
      dataList[i] = childGoal
    }
    // 完成
    function finish(i:number) {
      let childGoal = new goalFinishClass(dataList[i])
      childGoal.finish()
      dataList[i] = childGoal
    }
    // 确定新增
    function ok() {
      filterData()
      if (isChild) { // 子目标新增
        let childGoal = new goalChildClass(dataList[currentIndex])
        childGoal.createChild(formData)
        dataList[currentIndex] = childGoal
      } else { // 目标新增
        let goal = new goalClass(formData)
        dataList.unshift(goal)
      }
    }
    function cancel() {
      modal.value = false
    }
    function taskClick() {
      taskModal.value = true
    }
    // 新增目标
    function newGoal() {
      modal.value = true
      proxy.$refs['form'] && proxy.$refs['form'].resetFields()
      isChild = 0
      date.value = []
    }
    return{
      formData,
      dataList,
      columns,
      modal,
      date,
      taskModal,
      newGoal,
      breakGoal,
      stopOrOpen,
      ok,
      cancel,
      finish,
      taskClick
    }
  }

})
</script>

<style scoped>
.task-card{
  width: 200px;
}
</style>