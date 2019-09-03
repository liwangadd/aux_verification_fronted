<template>
  <a-card :bordered="false">
    <!-- pdf 来源 -->
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
      size="large"
      type="default"
      class="login-button"
      @click="addNewRelation()"
    >添加关系</a-button>
    
    <a-button
      size="large"
      type="primary"
      htmlType="submit"
      class="login-button"
      @click="getNextStatement({completeLast:true})"
    >下一条</a-button>

    <verify-modal 
      ref="verifyModal" 
      :ctx="modelCtx"
      :visible="verifyModalVisible"
      :entityLabelList="entityLabelList"
      :entityPassed="entityPassed"
      @ok="handleOk"
      @cancel="handleModalCancel"
      />
  </a-card>
</template>

<style scoped>
button{
  margin-right: 10px
}

</style>

<script>
import { STable } from '@/components'
import verifyModal from '@/custom/verifyModel/verifyModal.vue'
import { getEntityLabels, getVerifyContents, openNextStatement } from '@/api/verify'
import { getRelationLabels } from '@/api/verify'

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
  name: 'TableList',
  components: {
    STable,
    verifyModal,
  },
  data () {
    return {
      // 实体标注按钮
      entityLabelList: [],
      // 关系类别
      relationLabelList: [],
      // 查询参数
      queryParam: {},
      // 待传入模态框的审核内容
      modelCtx: {},
      // 模态框显示
      verifyModalVisible: false,

      // pdf来源
      pdfUrl: '',
      pdfNo: -1,

      // 原始文本
      rawContent: '',
      statId:0,
      entityPassed: -1, // 实体是否被拒绝

      // 表格内容
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
        Object.assign(this.queryParam, parameter)
        return getVerifyContents(this.queryParam).then(res => {
          this.pdfUrl = res.result.pdfUrl
          this.pdfNo = res.result.pdfNo
          this.contents = res.result.data
          this.statId = res.result.id
          this.rawContent = res.result.rawContent
          // 保存实体数据判定状态
          this.entityPassed = this.contents[0].passed

          return res.result
        })
      }
    }
  },
  created () {
    // 获取实体按钮
    getEntityLabels()
      .then(res => {
        this.entityLabelList = res.result.entityList
      })
      .catch(err => {
        this.$notification['error']({
          message: '错误',
          description: '获取实体按钮错误' + err,
          duration: 1
        })
      })
    // 获取关系
    getRelationLabels()
      .then(res => {
        this.relationLabelList = res.result.relationList
      })
      .catch(err => {
        this.$notification['error']({
          message: '错误',
          description: '获取实体按钮错误' + err,
          duration: 1
        })
      })
    // 获取审核文本
    this.getNextStatement({completeLast:false})
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

  methods: {
    // 审核信息
    handleEdit(record) {
      this.modelCtx = record
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
      this.modelCtx = {}
    },

    // 新增关系
    addNewRelation(){
      if (this.entityPassed === 0){
        // 实体审核未通过禁止添加
        this.$error({
          title: '无效添加',
          content: '当前实体标注被拒绝,无法添加关系',
          centered: true
        });
        return;
      }
      // 构造一个record
      let record = {}
      record.type=1 // 关系类型
      record.statId = this.statId //聚类id
      record.content = this.rawContent   // 文本
      record.passed = 1 //自动同意
      record.id = 0 // 不要id
      record.relationId = null // 关系id
      record.relationName = ""  //关系名
      record.reflects = this.relationLabelList
      record.description = "" // 意见
      record.add = true //当前条目处于添加状态（切换api）

      this.handleEdit(record)
    },

    // 获取下一个信息
    getNextStatement(parameter) {
      // 判断审核是否完成
      for (let i = 0; i < this.contents.length; ++i) {
        if (this.contents[i].passed < 0 ) {
          this.$notification['warn']({
            message: '通知',
            description: '还有文本没有审核',
            duration: 1
          })
          return
        }
      }

      // 获取下一个审核
      openNextStatement(parameter)
        .then(res => {
          this.handleOk()
        })
        .catch(err => {
          this.$notification['info']({
            message: '通知',
            description: '没有需要审核的文本',
            duration: 1
          })
        })
    },
  }
}
</script>
