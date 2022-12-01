<script lang="ts" setup>
import {ref, getCurrentInstance, resolveComponent} from "vue";
import {stat} from "fs";
// 获取全局方法
const _this = getCurrentInstance().appContext.config.globalProperties
const {proxy} = getCurrentInstance()
// console.log(getCurrentInstance().ctx.$refs,proxy.$refs['form'])
// 定义状态 枚举值类型
enum StateEnum {
  UNHD = '未处理',
  HDIG = '处理中',
  FN = '已完成',
  DL='延期处理',
  FZ='冻结',
  KP='存档'
}
enum TypeEnum {
  FST = '又忘记纪念日了',
  GF = '忘记备礼物了',
  EX = '你为什么还和前任联系',
  DYL = '什么家务都不干',
  MY = '彩礼给多少',
  FM = '你家里人不喜欢我'
}
// 定义提交表单类型类
interface clashType {
  name: string
  type: TypeEnum|string
  desc: string
}
interface handleType{
  handle_time: string
  state: StateEnum|string
  remark: string
}
//  提取
class clashClass implements clashType {
  'name':string
  'type': string
  'desc': string
  'state': StateEnum|string
  'create_time': string
  'create_user': string
  constructor(row:clashType) {
    this.create_time = row.create_time || _this.$Date().format('YYYY-MM-DD HH:mm:ss')
    this.state = '未处理'
    this.create_user = '小明'
    this.name = row.name
    this.type = row.type
    this.desc = row.desc
  }
}
// 继承类
// 更新
class updateClashClass extends clashClass {
  update(row:clashType) {
    this.name = row.name
    this.type = row.type
    this.desc = row.desc
  }
}
// 处理
class handleClashClass extends clashClass{
  'handle_time': string
  'remark': string
  handle(row:handleType) {
    this.handle_time = _this.$Date().format('YYYY-MM-DD HH:mm:ss')
    this.state = row.state
    this.remark = row.remark
  }
}
// 定义数据
let newModal = ref(false) // 创建矛盾弹窗
let handleModal = ref(false) // 处理矛盾弹窗
let typeObj = ref(TypeEnum) // 类型对象
let stateObj = ref(StateEnum) // 处理数据类型
let currentIndex:number= ref(null) // 当前变更的索引
let columns:Array<object> = ref() // 表格配置
let dataList:Array<object> = ref([]) // 表格数据
let ruleValidate:object = ref({})
let formItem:clashType = ref({})
let handleItem:handleType = ref({})
let handleRuleValidate:object = ref({})
// dataList.value = [{
//   name: '1'
// }]
columns.value=[
  {
    title: '矛盾类型',
    width: 100,
    key: 'type'
  },{
    title: '矛盾名称',
    width: 100,
    key: 'name'
  },
  {
    title: '处理进度',
    width: 100,
    key: 'state'
  },
  {
    title: '创建人',
    width: 200,
    key: 'create_user'
  },
  {
    title: '创建时间',
    width: 200,
    key: 'create_time'
  },
  {
    title: '解决时间',
    width: 200,
    key: 'handle_time'
  },
  {
    title: '操作',
    key: 'action',
    width: 200,
    render: (h, params) => {
      return h('div', [
        h(resolveComponent('Button'), {
          props: {
            type: 'text',
            size: 'small'
          },
          style: {
            marginRight: '5px'
          },
          onClick: () => {
            console.log(params)
            currentIndex.value = params.index
            formItem.value = params.row
            newModal.value = true
          }
        },{
          default() {
            return '编辑'
          }
        }),
        h(resolveComponent('Button'), {
          props: {
            type: 'primary',
            size: 'small'
          },
          style: {
            marginRight: '5px'
          },
          onClick: () => {
            handleModal.value = true
            currentIndex.value = params.index
          }
        },{
          default() {
            return '处理'
          }
        }),
      ])
    }
  }
]
ruleValidate.value = {
  type: [
    { required: true, message: '你为什么生气呢', trigger: 'blur' }
  ],
  name: [
    { required: true, message: '给你的气愤起个名字吧', trigger: 'blur' }
  ],
}
handleRuleValidate.value = {
  state: [{ required: true, message: '请立马处理，我生气了！', trigger: 'blur' }]
}
// 方法
function newClick() {
  newModal.value = true
}
// 取消
function cancel() {
  newModal.value = false
}
// 确定
function ok(){
  proxy.$refs['form'].validate((valid:boolean) => {
    if (valid) {
      if (formItem.value.create_time) {
        let clash = new updateClashClass(formItem.value)
        clash.update(formItem.value)
        dataList.value[currentIndex.value] = clash
      } else {
        let clash = new clashClass(formItem.value)
        dataList.value.unshift(clash)
      }
      formItem.value = {}
      newModal.value = false
    }

  })
}
// 处理确定
function handleConfirm() {
  proxy.$refs['handle'].validate((valid:boolean) => {
    if (valid) {
      let clash = new handleClashClass(dataList.value[currentIndex.value])
      console.log(proxy.$refs['handle'])
      clash.handle(handleItem.value)
      dataList.value[currentIndex.value] = clash
      console.log(dataList.value[currentIndex.value])
      handleItem.value = {}
      handleModal.value = false
    }
  })
}
</script>

<template>
  <div class="lesson2" >
    <i-button @click="newClick" style="margin-bottom: 10px;">记录矛盾</i-button>
    <i-table stripe class="lesson-table" :columns="columns" :data="dataList"></i-table>
  </div>
  <Modal v-model="newModal" title="记录矛盾"
         footer-hide>
    <Form ref="form" :model="formItem" :label-width="80" :rules="ruleValidate">
      <FormItem label="选择类型" prop="type">
        <i-select v-model="formItem.type" clearable>
          <i-option v-for="(item,i) in typeObj" :value="item">{{item}}</i-option>
        </i-select>
      </FormItem>
      <FormItem label="矛盾名称" prop="name">
        <i-input type="text" v-model="formItem.name" placeholder="请输入矛盾名称" clearable></i-input>
      </FormItem>
      <FormItem label="事情经过" prop="desc">
        <i-input type="textarea" v-model="formItem.desc" placeholder="写个小作文吧" clearable maxlength="100" show-word-limit></i-input>
      </FormItem>
    </Form>
    <div style="text-align: right">
      <i-button style="margin-right: 10px" @click="cancel">取消</i-button>
      <i-button type="primary" @click="ok">确定</i-button>
    </div>
  </Modal>
  <Modal v-model="handleModal" title="处理矛盾"
         footer-hide>
    <Form ref="handle" :model="handleItem" :label-width="80" :rules="handleRuleValidate">
      <FormItem label="选择类型" prop="state">
      <i-select v-model="handleItem.state" clearable>
        <i-option v-for="item in stateObj" :value="item">{{item}}</i-option>
      </i-select>
      </FormItem>
      <FormItem label="备注" prop="remark">
        <i-input type="textarea" v-model="handleItem.remark"></i-input>
      </FormItem>
    </Form>
    <div style="text-align: right">
      <i-button style="margin-right: 10px" @click="handleModal=false">取消</i-button>
      <i-button type="primary" @click="handleConfirm">确定</i-button>
    </div>
  </Modal>

</template>

<style scoped>

</style>