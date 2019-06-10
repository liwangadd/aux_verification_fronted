<template>
  <a-card :bordered="false">
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="48">
          <a-col :md="8" :sm="24">
            <a-form-item label="PDF原文">
              <a target="_blank" :href="'/static/pdf/' + pdfUrl + '.pdf#page=' + pdfNo">
                <a-button type="primary">查看</a-button>
              </a>
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="24">
            <a-form-item label="PDF页码">{{ pdfNo }}</a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </div>

    <s-table
      ref="table"
      size="default"
      rowKey="id"
      :columns="columns"
      :data="loadData"
      :showSizeChanger="false"
      :pageSize="100"
    >
      <span slot="status" slot-scope="text">
        <a-badge :status="text | statusTypeFilter" :text="text | statusFilter" />
      </span>
      <span slot="action" slot-scope="text, record">
        <template>
          <a @click="handleEdit(record)">审批</a>
        </template>
      </span>
    </s-table>
    <a-button
      style="margin-top:24px float: right"
      size="large"
      type="primary"
      htmlType="submit"
      class="login-button"
      @click="getNextStatement({completeLast:true})"
    >下一条</a-button>
    <ver-entity-modal ref="verEntityModal" @ok="handleOk"/>
    <ver-relation-modal ref="verRelationModal" @ok="handleOk"/>
  </a-card>
</template>

<style>
.button-row button{
  margin-right: 5px
}
</style>

<script>
// import moment from 'moment'
import { STable } from '@/components'
import VerEntityModal from './modules/VerEntityModal'
import VerRelationModal from './modules/VerRelationModal'
import { getEntityLabels, getVerifyContents, openNextStatement } from '@/api/verify'

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
  name: 'TableList',
  components: {
    STable,
    VerEntityModal,
    VerRelationModal
  },
  data () {
    return {
      // 实体标注按钮
      EntityButtonList: [],
      mdl: {},
      // 查询参数
      queryParam: {},

      pdfUrl: '',

      pdfNo: -1,

      contents: {},
      // 表头
      columns: [
        {
          title: '标注类型',
          dataIndex: 'type',
          width: '100px',
          customRender: status => (status === 0 ? '实体标注' : '关系标注')
        },
        {
          title: '文本内容',
          dataIndex: 'content'
        },
        {
          title: '状态',
          dataIndex: 'passed',
          width: '100px',
          // customRender: status =>
          //   status === -1 ? '未审核' : status === 0 ? '未通过' : '已通过'
          scopedSlots: { customRender: 'status' }
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
        console.log('loadData.parameter', parameter)
        Object.assign(this.queryParam, parameter)
        return getVerifyContents(this.queryParam).then(res => {
          this.pdfUrl = res.result.pdfUrl
          this.pdfNo = res.result.pdfNo
          this.contents = res.result.data
          return res.result
        })
      }
    }
  },
  created () {
    // getRoleList({ t: new Date() })
    this.getNextStatement({completeLast:false})
  },
  filters: {
    statusFilter (type) {
      return statusMap[type + 1].text
    },
    statusTypeFilter (type) {
      return statusMap[type + 1].status
    }
  },
  methods: {
    handleEdit(record) {
      record["buttonList"] = this.$data.EntityButtonList
      if (record.type === 0) {
        this.$refs.verEntityModal.edit(record)
      } else {
        this.$refs.verRelationModal.edit(record)
      }
    },
    handleOk () {
      this.$refs.table.refresh()
    },
    getNextStatement(parameter) {
      for (let i = 0; i < this.contents.length; ++i) {
        if (this.contents[i].passed === -1) {
          this.$notification['warn']({
            message: '通知',
            description: '还有文本没有审核',
            duration: 1
          })
          return
        }
      }
      openNextStatement(parameter)
        .then(res => {
          console.log('初始化获取审核文本')
          this.handleOk()
        })
        .catch(err => {
          this.$notification['info']({
            message: '通知',
            description: '没有需要审核的文本',
            duration: 1
          })
        })

      // 获取实体按钮
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
    }
  }
}
</script>
