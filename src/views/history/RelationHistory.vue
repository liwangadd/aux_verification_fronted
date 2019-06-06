<template>
  <a-card :bordered="false">
    <s-table ref="table" size="default" rowKey="key" :columns="columns" :data="loadData">

        <span slot="status" slot-scope="text">
          <a-badge :status="text | statusTypeFilter" :text="text | statusFilter" />
        </span>

        <span slot="pdfUrl" slot-scope="text, record">
            <template>
                <a :href="record.pdfUrl">{{ record.pdfUrl }}</a>
            </template>
        </span>

      <span slot="action" slot-scope="text, record">
        <template>
          <a @click="handleModify(record)">修改</a>
        </template>
      </span>
    </s-table>
    <relation-modify-modal ref="relationModifyModal" @ok="handleOk"/>
  </a-card>
</template>

<script>
import moment from "moment";
import { STable } from "@/components";
import RelationModifyModal from "./modules/RelationModifyModal";
import { listRelations } from "@/api/user"
import { timeFormat } from '@/utils/util'
import { getEntityLabels } from '@/api/verify'

const statusMap = {
  // 0: {
  //   status: 'default',
  //   text: '关闭'
  // },
  2: {
    status: 'processing',
    text: '已通过'
  },
  0: {
    status: 'success',
    text: '未审核'
  },
  1: {
    status: 'error',
    text: '未通过'
  }
}

export default {
  name: 'EntityHistory',
  components: {
    STable,
    RelationModifyModal
  },
  data () {
    return {
      EntityButtonList: [],
      mdl: {},
      // 查询参数
      queryParam: {},
      //表头
      columns: [
        {
          title: '文本内容',
          dataIndex: 'content'
        },
        {
          title: '状态',
          dataIndex: 'passed',
          width: '100px',
          scopedSlots: { customRender: 'status' }
        },
        {
          title: '关系名称',
          dataIndex: 'relationName',
          width: '100px'
        },
        {
          title: 'PDF文件',
          dataIndex: 'pdfUrl',
          scopedSlots: {customRender: 'pdfUrl'}
        },
        {
          title: 'PDF页码',
          dataIndex: 'pdfNo',
          width: '100px'
        },
        {
          title: '审核日期',
          dataIndex: 'verDate',
          width:'120px',
          customRender: (text) => timeFormat(text)
        },
        {
          title: '操作',
          dataIndex: 'action',
          width: '150px',
          scopedSlots: { customRender: 'action' }
        }
      ],
      // 加载数据方法 必须为 Promise 对象
      loadData: parameter => {
        console.log ('loadData.parameter', parameter)
        Object.assign (this.queryParam, parameter)
        return listRelations (this.queryParam)
        .then ((res)=>{
          return res.result
        })
      }
    }
  },
  filters: {
    statusFilter (type) {
      return statusMap[type + 1].text
    },
    statusTypeFilter (type) {
      return statusMap[type + 1].status
    }
  },
  created () {
    // getRoleList({ t: new Date() });
    getEntityLabels()
      .then(res => {
        this.$data.EntityButtonList = res.result.entityList
      })
      .catch(err => {
        this.$notification['error']({
          message: '错误',
          description: '获取实体按钮错误' + err,
          duration: 1
        })
      })
  },
  methods: {
    handleModify (record) {
      record["buttonList"] = this.EntityButtonList
      this.$refs.relationModifyModal.edit(record)
    },
    handleOk () {
      this.$refs.table.refresh()
    }
  }
}
</script>
