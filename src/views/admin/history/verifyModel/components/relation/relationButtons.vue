<template>
  <a-row>
    <a-col :span="24" class="button-row">
      <a-button v-for="b in buttonList" :key="b.name" 
        type="primary" 
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
import { getActualSelect } from "@/utils/select";
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
      // 获取div及其内容, 内容包含标签
      const myField = this.inObj
      const content = myField.innerText
      const contentHTML = myField.innerHTML

      // 判断是否选中
      const selectText = window.getSelection().toString()
      if (selectText === ""){
        return
      }      

      // 选中的开始结尾
      // 以 innerText 为准
      const [start, end] = getActualSelect(this.inObj);

      // 另一个实体
      const oEnt = entV === "e1"? "e2" : "e1"
      const oEntObj = myField.querySelector(oEnt)
      if(oEntObj === null){
        // 没有另一个实体则直接拼接，跳过逻辑判断
        let startTag = "<" + entV + ">"
        let endTag = "</" + entV + ">"
        const newContent = content.substring(0, start) 
              + startTag + selectText + endTag
              + content.substring(end)

        this.$emit("addEntity", newContent)
        return
      }
      // 得到另一个实体在 text 中的位置
      let oPos = 0;
      for (let index = 0; index < myField.childNodes.length; index++) {
          var cnode = myField.childNodes[index];
          if (oEntObj === cnode) break;
          // 找到的节点都需要加上 offset
          oPos += cnode.nodeType === document.TEXT_NODE ?
                  cnode.length : cnode.innerText.length;
      }

      // 获取e1 e2实体
      let e1,e2, e1Pos, e2Pos;
      if (entV === "e1"){
        e1 = selectText;
        e2 = oEntObj.innerText;
        e1Pos = start; 
        e2Pos = oPos;
      }else{
        e2 = selectText;
        e1 = oEntObj.innerText;
        e2Pos = start; 
        e1Pos = oPos;
      }

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

      let newcontent = content.substring(0, e1Pos) 
            + "<e1>" + e1 + "</e1>"
            + content.substring(e1Pos+e1.length,e2Pos)
            + "<e2>" + e2 + "</e2>"
            + content.substring(e2Pos+e2.length)
      
      this.$emit("addEntity", newcontent)
      return
    },

    setStyle(v){
      return 'background-color:' + v.color;
    }
  }
}
</script>

