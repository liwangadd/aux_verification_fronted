<template>
  <a-modal
    title="标注审核"
    :width="840"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="handleSubmit"
    @cancel="handleCancel"
  >
    <a-spin :spinning="confirmLoading">
      <a-form :form="form" @submit="handleSubmit">
        <a-form-item label="文本内容" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-textarea 
            ref="contextarea"
            v-decorator="['content', {rules: [{required: true, message: '文本内容不能为空'}]}]"
            :autosize="{minRows:2,maxRows:6}"
          />
        </a-form-item>
        <a-form-item label="标注类型" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input v-if="mdl.type === 0" disabled value="实体标注"/>
          <a-input v-if="mdl.type === 1" disabled value="关系标注"/>
        </a-form-item>
        <a-form-item label="关系类型" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-select
            v-decorator="['relationId', {rules: [{required: true}]}]" placeholder="请选择">
            <a-select-option v-for="reflect in mdl.reflects" :key="reflect.relationId" 
            :value="reflect.relationId">{{ reflect.relationName }}</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="审核意见" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-auto-complete v-decorator="['description']" @select="onSelect" @search="handleSearch" :dataSource="opinionSources"/>
        </a-form-item>
        <a-form-item label="审核" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-select
            v-decorator="['passed', {rules: [{required:true}]}]"
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
import { dealRelation, prefixOpinion } from '@/api/verify'
// import EntityButtons from '@/custom/components/EntityButtons.vue';

export default {
  components:{
    // EntityButtons,
  },
  data() {
    return {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 7 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 13 }
      },
      visible: false,
      confirmLoading: false,
      form: this.$form.createForm(this),
      mdl: {},
      opinionSources: [],
      buttonList:[],
    }
  },
  methods: {
    add() {
      this.visible = true
    },
    edit(record) {
      this.visible = true
      this.buttonList = record.buttonList
      this.mdl = Object.assign({}, record)
      this.$nextTick(() => {
        this.form.setFieldsValue({ ...record })
        if (record.passed === -1){
          this.form.setFieldsValue({passed: undefined})
        }
      })
    },
    handleSubmit() {
      const {
        form: { validateFields }
      } = this
      const validateFieldsKey = ['content', 'relationId', 'description', 'passed']
      this.confirmLoading = true

      validateFields((errors, values) => {
        if (!errors) {
          console.log('values', values)
          const verifyParams = { ...values }
          verifyParams.statId = this.mdl.stateId
          verifyParams.id = this.mdl.id
          dealRelation(verifyParams)
          .then((res)=>{
            this.visible = false
            this.confirmLoading = false
            this.$emit('ok', values)
          })
          .catch((err)=>{
            this.confirmLoading = false
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
    handleCancel() {
      this.visible = false
    },
    handleSearch (value) {
      // this.opinionSources = !value?[]:[
      //   value,
      //   value + value,
      //   value + value + value
      // ]
      prefixOpinion({ prefix: value })
      .then((res) => {
        this.opinionSources = res.result
      })
      .catch(err => {
        this.opinionSources = []
      })
    },
    handleAddEntity(content) {
      this.form.setFieldsValue({"content":content})
    },
    onSelect (value) {
        console.log(value)
    }
  }
}
</script>
