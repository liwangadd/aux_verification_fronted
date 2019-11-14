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
export default {
  name: "entityButtons",
  props: ["buttonList", "content", "inObj"],
  methods:{
    // 点击插入
    insertAtCursor(myValue) {
      const self = this
      // change myValue: </tag> -> tag
      const tag = myValue.substring(2, myValue.length-1)
      // 获取div及其内容, 内容包含标签
      const myField = this.inObj
      const htmlContent = myField.innerHTML
      // 判断是否选中
      const selectText = window.getSelection().toString()
      if (selectText === ""){
        return
      }

      // 因为实体可能有重叠的情况，因此遍历文本
      // 先获得所有实体开始与结束坐标, 按从小到大排列
      const regTagBegin = /<\/?[a-z]+>/g
      let entPos = [];
      var match;
      while ((match = regTagBegin.exec(htmlContent)) != null) {
        entPos.push(match.index)
      }

      // 寻找所有实体位置
      let legalPos = 0;
      let indexPos = 0;
      // 所有候选插入位置
      let insertCandidates = []
      while(legalPos != -1 && indexPos < htmlContent.length){
        legalPos = htmlContent.indexOf(selectText, indexPos)
        if (legalPos != -1){
          insertCandidates.push(legalPos)
          indexPos = legalPos + 1
        }
      }
      // console.log(entPos)
      // console.log(insertCandidates)

      // 对每个insert位置做判断
      let insertLegals = []
      let compareIndex = 0
      for (let index = 0; index < insertCandidates.length; index++) {
        const insertPos = insertCandidates[index];
        // 当插入位置小于某个已有实体位置时结束
        while(insertPos >= entPos[compareIndex] && compareIndex < entPos.length){
          compareIndex += 1
        }

        // 偶数表明插入位置在一个tag end之后，合法(数组第一个是0)
        if (compareIndex % 2 === 0){
          insertLegals.push(insertPos)
        }
      }

      // 插入实体
      let insertLength = 0
      let newHtml = htmlContent
      // console.log("origin:", newHtml)
      for (let index = 0; index < insertLegals.length; index++) {
        const insertPos = insertLegals[index];
        newHtml = newHtml.substring(0, insertPos+insertLength)
              + "<" + tag + ">"
              + selectText
              + "</" + tag + ">"
              + htmlContent.substring(insertPos+selectText.length)
        insertLength += 5 + tag.length * 2
        // console.log(index, newHtml)
      }

      this.$emit("addEntity", newHtml)

    },

    setStyle(v){
      return 'background-color:' + v.color;
    }
  }
}
</script>

