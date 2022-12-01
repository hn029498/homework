export const columns = [
    {
        title: '目标名称',
        key: 'name',
        tree: true
    },
    {
        title: '有效期限',
        key: 'term'
    },
    {
        title: '状态',
        key: 'stateStr'
    },
    {
        title: '完成时间',
        key: 'finish_time'
    },
    {
        title: '创建时间',
        key: 'create_time'
    },
    {
        title: '操作',
        slot: 'action',
        width: 300,
        align: 'center'
    },

]