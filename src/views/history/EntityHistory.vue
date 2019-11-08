<template>
  <a-card :bordered="false">
    <s-table ref="table" size="default" rowKey="key" :columns="columns" :data="loadData">

      <span slot="status" slot-scope="text">
        <a-badge :status="text | statusTypeFilter" :text="text | statusFilter" />
      </span>

      <span slot="pdfUrl" slot-scope="text, record">
        <template>
          <a target="_blank" :href="'/static/pdf/' + record.pdfUrl + '.pdf#page=' + record.pdfNo"> {{ record.pdfUrl }}</a>
        </template>
      </span>

      <span slot="action" slot-scope="text, record">
        <template>
          <a @click="handleEdit(record)">修改</a>
        </template>
      </span>
    </s-table>

    <verify-modal 
      ref="verifyModal" 
      :ctx="propsToVerify"
      :visible="verifyModalVisible"
      :entityLabelList="entityButtonList"
      @ok="handleOk"
      @cancel="handleModalCancel"
      />
  </a-card>
</template>

<script>
import { STable } from "@/components";
import verifyModal from '@/custom/verifyModel/verifyModal.vue'
import { listEntities } from "@/api/user";
import { timeFormat } from '@/utils/util'
import {getEntityLabels} from "@/api/verify"

const statusMap = {
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
    verifyModal,
  },
  data() {
    return {
      // 实体标注按钮
      entityButtonList: [],
      // 查询参数
      queryParam: {},
      // 待传入模态框的审核内容
      propsToVerify: {},
      // 模态框显示
      verifyModalVisible: false,
      //表头
      columns: [
        {
          title: '序号',
          dataIndex: 'statId',
        },
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
          title: 'PDF文件',
          dataIndex: 'pdfUrl',
          width: '5%',
          scopedSlots: { customRender: 'pdfUrl' }
        },
        {
          title: 'PDF页码',
          dataIndex: 'pdfNo',
          width: '100px'
        },
        {
          title: '审核日期',
          dataIndex: 'verDate',
          width: '120px',
          customRender: (text) => timeFormat(text)
        },
        {
          title: '操作',
          dataIndex: 'action',
          width: '100px',
          scopedSlots: { customRender: 'action' }
        }
      ],
      // 加载数据方法 必须为 Promise 对象
      loadData: parameter => {
        Object.assign(this.queryParam, parameter)
        this.queryParam["statid"] = -1
        return listEntities(this.queryParam).then(res => {
          return res.result
        });
      }
    };
  },
  filters: {
    statusFilter (type) {
      if (type === undefined){
        return statusMap[0].text
      }
      return statusMap[type + 1].text
    },
    statusTypeFilter (type) {
      if (type === undefined){
        return statusMap[0].status
      }
      return statusMap[type + 1].status
    }
  },
  created() {
    // 获取实体按钮
    getEntityLabels()
      .then(res => {
        this.entityButtonList = res.result.entityList
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
    // 审核信息
    handleEdit(record) {
      record.type = 0
      record.history = 1
      this.propsToVerify = record
      this.verifyModalVisible = true
    },

    // 信息审核提交
    handleOk () {
      // 关闭模态框
      this.handleModalCancel()
      // 刷新列表
      this.$refs.table.refresh()
    },

    // 模态框关闭
    handleModalCancel(refresh) {
      this.verifyModalVisible = false
      this.propsToVerify = {}
    },
  }
}
</script>
