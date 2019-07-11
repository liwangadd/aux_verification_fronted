<template>
  <div>
    <content-display
      :content=entContent
      :buttonList=buttonList
      @update="updateContent"
      ref="cDiv"
      >
      <template v-slot:button>
        <entity-buttons
          :buttonList="buttonList"
          :inObj="contextObj"
          @addEntity="updateContent"
        />
      </template>
    </content-display>
  </div>
</template>

<script>
import entityButtons from './entityButtons.vue'
import contentDisplay from '../contentDisplay.vue'
export default {
  components: {entityButtons, contentDisplay},
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
      // 文本框
      contextObj: this.$refs.contextarea,

      // 右键菜单临时实体节点储存
      contextTarget: null
    }
  },
  props: ['buttonList', 'content'],
  methods: {
    // 更新实体标注
    updateContent(content) {
      // this.entContent = content
      this.$emit("update",content)
    },
  },
  computed: {
    entContent() {
      return this.content
    }
  },
  mounted(){
    // 延迟更新
    this.$nextTick(() => {
      this.contextObj = this.$refs.cDiv.$refs.contextarea
    })
  },

}
</script>

