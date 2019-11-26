<template>
  <a-modal
    title="标注审核"
    :visible="visible"
    :width="840"
    :confirmLoading="confirmLoading"
    @ok="handleSubmit"
    @cancel="handleCancel"
  >
    <a-spin :spinning="confirmLoading">
      <a-form :form="form" @submit="handleSubmit">
        <a-form-item label="标注类型" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input v-if="model.type === 0" disabled value="实体标注"/>
          <a-input v-if="model.type === 1" disabled value="关系标注"/>
        </a-form-item>

        <!-- 根据传入类型决定 实体/关系 -->
        <component v-bind:is="ctxComponent" 
                  :content="model.content"
                  :ctx="model"
                  @update="updateContent"
                  :buttonList="entityLabelList" ></component>

        <!-- pdf 来源，未审核文本不显示 -->
        <pdf :pdfNo="model.pdfNo" :pdfUrl="model.pdfUrl" v-if="model.history"/>

        <!-- 审核意见部分 -->
        <a-form-item label="审核意见" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-auto-complete
            v-decorator="['description', {initialValue: model.description}]"
            @search="handleSearch"
            :dataSource="opinionSources"
          />
        </a-form-item>

        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" >
          <span slot="label">
            <a-tooltip title="该关系对应实体标注被拒绝！" 
                        v-if="entityPassed === 0 && model.type === 1"
                        :visible="true"
                        placement="left">
              <a-icon type="info-circle" theme="twoTone" twoToneColor="#eb2f96" />
            </a-tooltip>
            审核
          </span>
            <a-radio-group 
            v-decorator="['passed', {rules: [{required:true}], initialValue: model.passed}]"
            buttonStyle="solid">
              <a-radio-button :value="1"
                            :disabled="entityPassed === 0 && model.type === 1">
                            通过
              </a-radio-button>
              <a-radio-button :value="0">
                拒绝
              </a-radio-button>
            </a-radio-group>
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
import { HTMLEncode, HTMLDecode } from '@/utils/util'

export default {
  props:[
    "visible",  //可见
    "ctx",  // 传入数据上下文
    "entityLabelList",
    "entityPassed"
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
      // 意见自动查询
      opinionSources: [],
      // 临时文本(TODO)
      tempContent: null,
      // model 自身展示
      model: this.ctx,
    }
  },
  beforeCreate() {
    // 表单
    this.form = this.$form.createForm(this);
  },
  computed:{
    // 展示的关系
    ctxComponent() {
      const component = this.ctx.type === 0 ? "entity" : "relation"

      return component
    },
  },
  watch: {
    ctx(newCtx){
      this.model = Object.assign({},newCtx)
      // 当处于实体拒绝状态，且传入数据为关系,自动把通过状态设为拒绝
      if (this.model.type === 1 && this.entityPassed === 0){
        this.model.passed = 0;
      }
      if (this.model.passed === -1){
        this.model.passed = null;
      }
    }
  },

  methods: {
    // 上下文函数切换
    ctxFunction(param) {
      // 修改实体
      if (this.model.type === 0){
        return dealEntity(param) 
      }else{
        // 添加关系
        if (param.hasOwnProperty('add')){
          return addRelation(param)
        }
        // 修改关系
        return dealRelation(param)
      }
    },

    // 显示实体拒绝二次确认
    showEntityRejectConfirm(){
      return new Promise(resolve => {
        this.$confirm({
          title: '拒绝实体标注',
          content: '当拒绝实体标注后，所有关系标注将只能拒绝,请确认',
          onOk() {
            resolve(true)
          },
          onCancel() {
            resolve(false)
          },
        });
      })
    },

    // 提交前处理
    async handleSubmit() {
      const {
        form: { validateFields }
      } = this  // 获得 validateFields 函数

      // 一些必要的公共参数
      const validateFieldsKey = ['description', 'passed']
      // this.model.content = this.tempContent
      // 对实体的一些处理
      if (this.model.type === 0){
        if (this.form.getFieldValue("passed") === 0){ // 审核不通过
          // 给予提示
          let confirm = await this.showEntityRejectConfirm();
          if (!confirm){
            return
          }
        }
      }else if (this.model.type === 1){ // 对于关系的一些处理 
        if (this.form.getFieldValue("passed") === 1){ // 审核通过
          if((this.model.content.indexOf("e1") < 0 || this.model.content.indexOf("e2") < 0)){
            //  通过但是，实体不全
            this.$error({content: "实体标注不全"})
            return
          }
        }
        // 对关系的一些验证
        validateFieldsKey.push("relationId")
      }

      this.confirmLoading = true
      validateFields(validateFieldsKey, { force: true }, (errors, values) => {
        if (!errors) {
          const verifyParams = { ...values }
          // 给表单添加其他字段
          verifyParams.content = this.model.content
          verifyParams.statId = this.model.statId
          verifyParams.id = this.model.id
          if (this.ctx.hasOwnProperty('add')){
            verifyParams.add = true
          }

          // 发送请求
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
      this.model.content = c
    }
  },
}
</script>
