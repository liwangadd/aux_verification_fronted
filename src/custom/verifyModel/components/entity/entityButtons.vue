<template>
  <a-row>
    <a-col :span="24" class="button-row">
      <a-button v-for="b in buttonList" :key="b.name" 
        type="primary" @click="insertAtCursor(b.value)"
        :style="setStyle(b)" >{{b.name }}</a-button>
    </a-col>
  </a-row>
</template>

<style scoped>
.button-row button{
  margin-right:5px;
  min-width: 45%;
}
</style>

<script>
import { HTMLEncode } from '@/utils/util'
export default {
  name: "entityButtons",
  props: ["buttonList", "content", "inObj"],
  methods:{
    // 点击插入
    insertAtCursor(myValue) {
      const self = this
      // change myValue: </tag> -> tag
      const tag = myValue.substring(2, myValue.length-1)
      // 获取div
      const cNode = this.inObj
      // 判断是否选中
      const selectText = window.getSelection().toString()
      if (selectText === ""){
        return
      }

      let newContent = ""
      // 遍历所有子节点，只有text节点可以被添加标签
      for (let index = 0; index < cNode.childNodes.length; index++) {
        const element = cNode.childNodes[index]
        // 只有text节点可以被添加标签
        if (element.nodeType === document.TEXT_NODE){
          // 寻找所有匹配的文本
          var pos_array = []
          var insertPos = 0
          let content = element.textContent
          while((insertPos = content.indexOf(selectText, insertPos)) !== -1) {
            pos_array.push(insertPos)
            insertPos += 1
          }
          // 找到了
          if (pos_array.length !== 0){
            let insertLength = 0
            for (let i = 0; i < pos_array.length; i++) {
              const pos = pos_array[i] + insertLength;
              insertLength += tag.length * 2 + 5
              content = content.substring(0, pos)
                          + "<"+tag+">" + selectText + "</"+tag+">"
                          + content.substring(pos + selectText.length)
            }
          }
          newContent += content
        }else{
          const tag = element.tagName.toLowerCase()
          newContent += "<"+tag+">" + element.innerText + "</"+tag+">"
        }
      }

      this.$emit("addEntity", newContent)

    },

    setStyle(v){
      return 'background-color:' + v.color;
    }
  }
}
</script>

