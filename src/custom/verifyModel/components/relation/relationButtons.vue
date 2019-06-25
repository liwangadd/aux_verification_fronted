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
        },
        {
          color: "white",
          name: "清除实体",
          value: "clear",
        }
      ]

    }
  },
  props: ["inObj"],
  methods:{
    // 点击插入
    insertAtCursor(entV) {
      const self = this
      // 获取div及其内容, 内容不包含标签
      const myField = this.inObj
      let content = myField.innerText

      // 清除实体
      if (entV === "clear"){
        this.$emit("addEntity", content)
        return
      }

      // 判断是否选中
      const selectText = window.getSelection().toString()
      if (selectText === ""){
        return
      }      


      // 另一个实体
      const oEnt = entV === "e1"? "e2" : "e1"
      const oEntObj = myField.querySelector(oEnt)
      if(oEntObj === null){
        // 没有另一个实体则直接拼接，跳过逻辑判断
        let insertPos = content.indexOf(selectText)
        let startTag = "<" + entV + ">"
        let endTag = "</" + entV + ">"
        content = content.substring(0, insertPos) 
              + startTag + selectText + endTag
              + content.substring(insertPos + selectText.length)

        this.$emit("addEntity", content)
        return
      }

      // 获取e1 e2实体
      let e1,e2
      if (entV === "e1"){
        e1 = selectText
        e2 = oEntObj.innerText
      }else{
        e2 = selectText
        e1 = oEntObj.innerText
      }
      // 实体位置
      const e1Pos = content.indexOf(e1) 
      const e2Pos = content.indexOf(e2)

      /** 一些逻辑判断 */
      // e1 e2 相对位置判断
      if (e1Pos > e2Pos){ // 或插入实体e2在e1之前
          this.$error({content:"实体1不能在实体2之后"})
          return
      }
      // e1 e2 包含关系判断
      if (e2Pos < (e1Pos + e1.length)){
          this.$error({content:"实体之间不能相互包含"})
          return
      }

      content = content.substring(0, e1Pos) 
            + "<e1>" + e1 + "</e1>"
            + content.substring(e1Pos+e1.length,e2Pos)
            + "<e2>" + e2 + "</e2>"
            + content.substring(e2Pos+e2.length)
      
      this.$emit("addEntity", content)
    },

    setStyle(v){
      return 'background-color:' + v.color;
    }
  }
}
</script>

