<template>
  <a-row>
    <a-col :span="24" class="button-row">
      <a-button v-for="b in buttonList" :key="b.name" 
        type="primary" @click="insertAtCursor(b.value)"
        :style="setStyle(b)" >{{b.name}}</a-button>
    </a-col>
  </a-row>
</template>

<style scoped>
.button-row button{
  margin-right: 5px;
  min-width: 200px;
  color: black;
}
</style>

<script>
export default {
  name: "relationButtons",
  data() {
    return {
      buttonList: [
        {
          color: "deepskyblue",
          name: "实体一",
          value: "e1",
        },
        {
          color: "palegreen",
          name: "实体二",
          value: "e2",
        }
      ]

    }
  },
  props: ["inObj"],
  methods:{
    // 点击插入
    insertAtCursor(entV) {
      const self = this
      const startTag = "<" + entV + ">"
      const endTag = "</" + entV + ">"

      // 获取div及其内容, 内容是包含标签的
      const myField = this.inObj
      let content = myField.innerHTML

      // 判断是否选中
      const selectText = window.getSelection().toString()
      if (selectText === ""){
        return
      }      

      // 去除原选中标签
      content = content.replace(startTag, "")
      content = content.replace(endTag, "")

      // 将新标签插入
      const insertPos = content.indexOf(selectText)
      content = content.substring(0, insertPos) 
            + startTag + selectText + endTag
            + content.substring(insertPos + selectText.length)
      
      this.$emit("addEntity", content)
    },

    setStyle(v){
      return 'background-color:' + v.color;
    }
  }
}
</script>

