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
        <a-form-item label="文本内容" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <div id="contentarea" v-html="mdl.content"></div>
          <!-- 实体插入 button -->
          <EntityButtons :buttonList="buttonList" :content="mdl.content" :inObj="this.$refs.contextarea"
                  @addEntity="handleAddEntity"/>
        </a-form-item>
        <a-form-item label="标注类型" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input v-if="mdl.type === 0" disabled value="实体标注"/>
          <a-input v-if="mdl.type === 1" disabled value="关系标注"/>
        </a-form-item>
        <a-form-item label="审核意见" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-auto-complete
            v-decorator="['description']"
            @select="onSelect"
            @search="handleSearch"
            :dataSource="opinionSources"
          />
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
import { dealEntity, prefixOpinion } from '@/api/verify'
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
      buttonList: [],
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
      const validateFieldsKey = ['content', 'description', 'passed']
      this.confirmLoading = true
      validateFields(validateFieldsKey, { force: true }, (errors, values) => {
        if (!errors) {
          console.log('values', values)
          const verifyParams = { ...values }
          verifyParams.statId = this.mdl.stateId
          verifyParams.id = this.mdl.id
          dealEntity(verifyParams)
            .then(res => {
              this.visible = false
              this.confirmLoading = false
              this.$emit('ok', values)
            })
            .catch(err => {
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
    handleAddEntity(content) {
      this.form.setFieldsValue({"content":content})
    },
    onSelect(value) {
      console.log(value)
    },

  }
}
</script>
