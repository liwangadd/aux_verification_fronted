<template>
  <div>
    <a-form-item label="文本内容" :labelCol="labelCol" :wrapperCol="wrapperCol">
      <a-textarea
        ref="contextarea"
        v-decorator="['content', {
                                  rules:[{required: true, message: '文本内容不能为空'}],
                                  initialValue: content,
                                  }]"
        :autosize="{minRows:2, maxRows:6}"
      ></a-textarea>
      <!-- 实体插入 button -->
      <entitybuttons
        :buttonList="buttonList"
        :inObj="inObj"
        @addEntity="handleAddEntity"
      />
    </a-form-item>
  </div>
</template>

<script>
import entitybuttons from './entityButtons.vue'
export default {
  components: {entitybuttons},
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
  props: ['buttonList', 'content'],
  methods: {
    // 处理实体
    handleAddEntity(content) {
      this.$parent.form.setFieldsValue({"content": content})
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

