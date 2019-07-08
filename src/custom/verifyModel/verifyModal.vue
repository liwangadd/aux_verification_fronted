<template>
  <a-modal
    title="标注审核"
    :width="840"
    v-model="visible"
    :confirmLoading="confirmLoading"
    @ok="handleSubmit"
    @cancel="handleCancel"
  >
    <a-spin :spinning="confirmLoading">
      <a-form :form="form" @submit="handleSubmit">
        <a-form-item label="标注类型" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input v-if="ctx.type === 0" disabled value="实体标注"/>
          <a-input v-if="ctx.type === 1" disabled value="关系标注"/>
        </a-form-item>

        <!-- 根据传入类型决定 实体/关系 -->
        <component v-bind:is="ctxComponent"
                  :content="tempContent"
                  :ctx="ctx"
                  @update="updateContent"
                  :buttonList="entityButtonList" ></component>

        <!-- pdf 来源，未审核文本不显示 -->
        <pdf :pdfNo="ctx.pdfNo" :pdfUrl="ctx.pdfUrl" v-if="ctx.history"/>

        <!-- 审核意见部分 -->
        <a-form-item label="审核意见" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-auto-complete
            v-decorator="['description', {initialValue: ctx.description}]"
            @search="handleSearch"
            :dataSource="opinionSources"
          />
        </a-form-item>

        <a-form-item label="审核" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-select
            v-decorator="['passed', {rules: [{required:true}], initialValue: ctx.passed}]"
            placeholder="请选择"
          >
            <a-select-option :value="1">通过</a-select-option>
            <a-select-option :value="0">拒绝</a-select-option>
          </a-select>
        </a-form-item>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
import { dealEntity, prefixOpinion, dealRelation, addRelation } from '@/api/verify'
import entity from './components/entity/entity.vue'
import relation from './components/relation/relation.vue'
import pdf from './components/pdf.vue'

export default {
  props:[
    "visible",
    "example",
    "entityButtonList",
  ],
  components:{
    entity,
    relation,
    pdf
  },
  data() {
    return {
      // 标签样式
      labelCol: {
        xs: { span: 24 },
        sm: { span: 7 }
      },
      // 样式
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 13 }
      },
      // 加载
      confirmLoading: false,
      // 表单
      form: this.$form.createForm(this),
      opinionSources: [],
      tempContent: null,
    }
  },

  computed:{
    // 传入的上下文
    ctx() {
      let res = this.example
      if (this.example.passed === -1){
        res.passed = undefined
      }
      this.tempContent = this.example.content
      return res
    },
    // 展示的关系
    ctxComponent() {
      const component = this.example.type === 0 ? "entity" : "relation"

      return component
    },
  },
  methods: {
    // 上下文函数切换
    ctxFunction(param) {
      if (this.ctx.type === 0){
        return dealEntity(param) 
      }else{
        // 必要，表单没有存content
        param.content = this.tempContent
        if (param.hasOwnProperty('add')){
          return addRelation(param)
        }
        
        return dealRelation(param)
      }
    },
    // 提交
    handleSubmit() {
      const {
        form: { validateFields }
      } = this
      const validateFieldsKey = ['content', 'description', 'passed']
      // 对于关系的一些处理
      if (this.ctx.type === 1){
        if(this.tempContent.indexOf("e1") <= 0 || this.tempContent.indexOf("e2") <= 0){
          //  实体不全
          this.$error({content: "实体标注不全"})
          return
        }
        this.ctx.content = this.tempContent
        // 对关系的一些验证
        validateFieldsKey.push("relationId")
      }
      this.confirmLoading = true
      validateFields(validateFieldsKey, { force: true }, (errors, values) => {
        if (!errors) {
          const verifyParams = { ...values }
          verifyParams.statId = this.ctx.statId
          verifyParams.id = this.ctx.id
          if (this.ctx.hasOwnProperty('add')){
            verifyParams.add = true
          }

          this.ctxFunction(verifyParams)
            .then(res => {
              this.confirmLoading = false
              this.form.resetFields()
              this.$emit('ok', values)
            })
            .catch(err => {
              let data = err.response.data
              this.confirmLoading = false
              this.$error({title: data.message, content: data.result})
            })
          // setTimeout(() => {
          //   this.visible = false
          //   this.confirmLoading = false
          //   this.$emit('ok', values)
          // }, 1500)
        } else {
          this.confirmLoading = false
        }
      })
    },
    // 关闭模态框
    handleCancel() {
      this.form.resetFields()
      this.$emit("cancel")
    },
    // 搜索
    handleSearch(value) {
      // this.opinionSources = !value?[]:[
      //   value,
      //   value + value,
      //   value + value + value
      // ]
      prefixOpinion({ prefix: value })
        .then(res => {
          this.opinionSources = res.result
        })
        .catch(err => {
          this.opinionSources = []
        })
    },

    // 零时保存新的content
    updateContent(c) {
      this.tempContent = c
    }
  }
}
</script>
