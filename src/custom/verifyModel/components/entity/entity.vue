<template>
  <div>
    <context-menu id="testingctx" ref="ctx" @ctx-open="onCtxOpen" >
        <li class="ctx-header"></li>
        <li class="ctx-item" @click="deleteNER(contextTarget)">删除实体</li>
    </context-menu>
    <v-style>
      <slot v-for="b in buttonList">
        {{b.value.substring(2,b.value.length-1)}} {
          background-color: {{b.color}};
        }
      </slot>
    </v-style>
    <a-form-item label="文本内容" :labelCol="labelCol" :wrapperCol="wrapperCol">
      <div v-html="content" ref="contextarea" 
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
import contextMenu from 'vue-context-menu'
// 自动生成 style
import Vue from "vue"
Vue.component('v-style', {
  render: function (createElement) {
    return createElement('style', this.$slots.default)
  }
})
export default {
  components: {entitybuttons, contextMenu},
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
      inObj: this.$refs.contextarea,

      // 右键菜单临时实体节点储存
      contextTarget: null
    }
  },
  props: ['buttonList', 'content'],
  methods: {
    // 处理实体
    handleAddEntity(content) {
      this.content = content
      this.$refs.contextarea.innerHTML = content
      this.$emit("update",content)
    },

    // 显示右键菜单
    onCtxOpen(e) {
      const parentNode = this.inObj;
      if (parentNode === e.target || !this.inObj.contains(e.target)){
        this.$refs.ctx.ctxVisible = false
        console.log("error")
        return false
      }

      this.contextTarget = e.target
    },

    deleteNER(e){
      let eNode = e.outerHTML
      let content = this.inObj.innerHTML
      let ePos = content.indexOf(eNode)
      let newcontent = content.substring(0, ePos)
              + e.innerText
              + content.substring(ePos + eNode.length)

      this.handleAddEntity(newcontent)
    }
  },
  mounted(){
    // 延迟更新
    this.$nextTick(() => {
      this.inObj = this.$refs.contextarea
    })
  },

}
</script>

