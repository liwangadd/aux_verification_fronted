<template>
  <div>
    <context-menu id="testingctx" ref="ctx" @ctx-open="onCtxOpen" >
        <li class="ctx-header">{{ targetText }}</li>
        <li class="ctx-item" @click="deleteNER(contextTarget)">删除实体</li>
    </context-menu>
    <v-style>
      <slot v-for="b in buttonList">
        {{b.value.substring(2,b.value.length-1)}} {
          background-color: {{b.color}};
        }
      </slot>
    </v-style>
    <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol">
      <span slot="label">
        文本内容
        <a-tooltip title="拉选文本点击对应标签进行标注<br>右键点击已标注实体进行删除">
          <a-icon type="info-circle" />
        </a-tooltip>
      </span>
      <div v-html="displayContent" ref="contextarea" 
          @contextmenu.prevent="$refs.ctx.open($event, $event)" ></div>
      <!-- <a-textarea
        ref="contextarea"
        v-decorator="['content', {
                                  rules:[{required: true, message: '文本内容不能为空'}],
                                  initialValue: content,
                                  }]"
        :autosize="{minRows:2, maxRows:6}"
      ></a-textarea> -->
      <!-- 实体插入 button -->
      <slot name="button"></slot>
    </a-form-item>
  </div>
</template>

<script>
import contextMenu from 'vue-context-menu'
// 自动生成 style
import Vue from "vue"
Vue.component('v-style', {
  render: function (createElement) {
    return createElement('style', this.$slots.default)
  }
})
export default {
  components: { contextMenu},
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

      // 右键菜单临时实体节点储存
      contextTarget: {},
      targetText: ""
    }
  },
  props: ['buttonList', 'content'],
  methods: {
    // 显示右键菜单
    onCtxOpen(e) {
      const parentNode = this.$refs.contextarea;
      if (parentNode === e.target || !parentNode.contains(e.target)){
        this.$refs.ctx.ctxVisible = false
        return false
      }

      this.contextTarget = e.target
      this.targetText = e.target.innerText
    },

    deleteNER(e){
      let eNode = e.outerHTML
      let content = this.$refs.contextarea.innerHTML
      let ePos = content.indexOf(eNode)
      let newcontent = content.substring(0, ePos)
              + e.innerText
              + content.substring(ePos + eNode.length)

      this.$emit("update", newcontent)
    }
  },
  computed: {
    displayContent() {
      return this.content
    }
  }
}
</script>

