<template>
  <a-modal title="实体修改" :width="840" :visible="visible" @ok="handleSubmit" @cancel="handleCancel">
    <a-spin :spinning="confirmLoading">
      <a-form :form="form">
        <a-form-item label="文本内容" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-textarea
            ref="contextarea"
            v-decorator="['content', {rules:[{required: true, message: '文本内容不能为空'}]}]"
            :autosize="{minRows:2, maxRows:6}"
          ></a-textarea>
          <EntityButtons :buttonList="buttonList" :inObj="this.$refs.contextarea"
                  @addEntity="handleAddEntity"/>
        </a-form-item>
        <a-form-item label="PDF文件" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a :href="mdl.pdfUrl">{{ mdl.pdfUrl }}</a>
        </a-form-item>
        <a-form-item label="PDF页码" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <p>{{ mdl.pdfNo }}</p>
        </a-form-item>
        <a-form-item label="审核意见" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-auto-complete v-decorator="['description']" @select="onSelect" @search="handleSearch" :dataSource="opinionSources"/>
        </a-form-item>
        <a-form-item label="审核" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-select
            v-decorator="['passed', {rules: [{required: true}]}]"
            placeholder="请选择"
            initialValue="1"
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
import EntityButtons from '@/custom/components/EntityButtons.vue';

export default {
  components: {
    EntityButtons,
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
    edit(record) {
      this.visible = true;
      this.buttonList = record.buttonList
      this.mdl = Object.assign({}, record)
      this.$nextTick(() => {
        this.form.setFieldsValue({ ...record })
      });
    },
    handleSubmit() {
      const {
        form: { validateFields }
      } = this;
      const validateFieldsKey = ['content', 'description', 'passed'];
      this.confirmLoading = true;
      validateFields((errors, values) => {
        if (!errors) {
          console.log('values', values)
          const verifyParams = { ...values }
          verifyParams.statId = this.mdl.statId
          verifyParams.id = this.mdl.id
          dealEntity(verifyParams)
          .then((res)=>{
            this.visible = false
            this.confirmLoading = false
            this.$emit('ok', values)
          })
          .catch((err)=>{
            this.confirmLoading = false
          })
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
};
</script>

