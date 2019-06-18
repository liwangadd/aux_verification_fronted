<template>
  <div>
    <a-form-item label="文本内容" :labelCol="labelCol" :wrapperCol="wrapperCol">
      <div v-html="content" ref="contextarea" ></div>
      <!-- 实体插入 button -->
      <relationbuttons
        :inObj="inObj"
        @addEntity="handleAddEntity"
      />
    </a-form-item>
    <a-form-item label="关系类型" :labelCol="labelCol" :wrapperCol="wrapperCol">
      <a-select
        v-decorator="['relationId', {rules: [{required: true}], initialValue: ctx.relationId}]" placeholder="请选择">
        <a-select-option v-for="reflect in ctx.reflects" :key="reflect.relationId" 
        :value="reflect.relationId">{{ reflect.relationName }}</a-select-option>
      </a-select>
    </a-form-item>
  </div>
</template>

<style>
e1{
  background-color:deepskyblue;
}

e2{
  background-color:palegreen;
}

</style>


<script>
import relationbuttons from './relationButtons.vue'
export default {
  components: {relationbuttons},
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
      inObj: this.$refs.contextarea
    }
  },
  props: ['buttonList', 'content', 'ctx'],
  methods: {
    // 处理实体
    handleAddEntity(content) {
      this.content = content
      this.$refs.contextarea.innerHTML = content
      this.$emit("update",content)
    },
  },
  mounted(){
    // 延迟更新
    this.$nextTick(() => {
      this.inObj = this.$refs.contextarea
    })
  },

}
</script>

