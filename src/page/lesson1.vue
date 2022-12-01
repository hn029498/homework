<script setup lang="ts">
import { ref, resolveComponent,getCurrentInstance } from 'vue'
import {type} from "os";
// 获取全局方法
const _this = getCurrentInstance().appContext.config.globalProperties
// 定义接口
interface personType{
  name: string,
  count: number
}
// 自定义类型
type countType = {
  id: number,
  label: string,
  count: number,
  disabled?:boolean
}

//定义成员类
class person {
  name: string
  count: number
  create_time: string
  constructor(row:personType) {
    this.create_time = _this.$Date().format('YYYY-MM-DD HH:mm:ss')
    this.name = row.name
    this.count = row.count
  }
  counter(count: number) {
    this.count = this.count + count
  }
}
//
// 双向绑定数据
let modal = ref(false) // 弹窗显隐
let checkedCount:Array<number> = ref([]) // 所选中的分数
let logList:Array<object> = ref([])
let logModal = ref(false)
let dataList:Array<object> = ref() // 表格数据
let columns:Array<object> = ref() // 表格配置
let currentIndex:number = null // 当前选中索引
let countData:Object<countType> = ref() // 分数枚举
dataList.value = [
  {
    name: '丁宁红',
    count:0
  },
  {
    name: '尹思俣',
    count:0
  },
  {
    name: '刘国强',
    count:0
  },
  {
    name: '谭杰红',
    count:0
  },
  {
    name: '胡李聪',
    count:0
  },
  {
    name: '施俊',
    count:0
  }
]
columns.value = [
    {
      title: '姓名',
      width: 100,
      key: 'name'
    },
    {
      title: '学分',
      width: 100,
      key: 'count'
    },
    {
      title: '更新时间',
      width: 180,
      key: 'create_time'
    },
    {
      title: '操作',
      key: 'action',
      fixed: 'right',
      width: 100,
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
            onClick:() => {
              console.log(params)
              currentIndex = params.index
              modal.value = true
            },
          }, {
            default() {
              return '编辑'
            }
          })
        ])
      }

    }
  ]
countData.value = {
  1: {
    id: 1,
    label: '学习任务完成',
    count:5
  },
  2: {
    id: 2,
    label: '课后作业完成',
    count:5
  },
  3: {
    id: 3,
    label: '讲解加分',
    count:3
  },
  4: {
    id: 4,
    label: '分享学习经验加分',
    count:2
  },
  5: {
    id: 5,
    label: '创意加分',
    count:2
  },
  6: {
    id: 6,
    label: '不交作业或胡乱应付作业',
    count:-5
  }
}
//    编辑提交方法
let ok = function () {
  // console.log(JSON.parse(JSON.stringify(checkedCount.value)))
  let checkedCountIdArr = JSON.parse(JSON.stringify(checkedCount.value))
  if (checkedCountIdArr.length) {
    let p = new person(dataList.value[currentIndex])
    let sum:number = 0
    checkedCountIdArr.forEach(item => {
      sum+= countData.value[item].count

    })
    p.counter(sum)
    dataList.value[currentIndex] = p
    logList.value.unshift(p)
    checkedCount.value = []
  }
  // console.log(123)
}
// 编辑取消方法
let cancel = function () {
}
// 查看日志的方法
let showLogClick = () => {
  logModal.value = true
}
</script>

<template>
  <div>
<!--    {{dataList}}{{count}}-->
    <i-button @click="showLogClick" style="margin-bottom: 10px;">日志</i-button>
    <i-table stripe class="lesson-table" :columns="columns" :data="dataList"></i-table>
    <Modal
        v-model="modal"
        title="编辑"
        @on-ok="ok"
        @on-cancel="cancel">
      <CheckboxGroup v-model="checkedCount">
        <Checkbox class="checkbox-item" v-for="item in countData" :label="item.id" border>{{item.label}}</Checkbox>
      </CheckboxGroup>
    </Modal>
    <Modal
        v-model="logModal"
        title="日志">
      <List border v-if="logList&&logList.length">
        <ListItem v-for="item in logList">
          {{item.create_time}} {{item.name}}变更了学分，现在学分总数为{{item.count}}
        </ListItem>
      </List>
      <p style="text-align: center" v-else>暂无记录</p>
    </Modal>
  </div>
</template>

<style scoped>
.read-the-docs {
  color: #888;
}
.lesson-table{
  width: 100%;
}
.checkbox-item{
  margin-top: 10px;
}
</style>
