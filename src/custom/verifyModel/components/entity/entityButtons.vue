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
      // 获取div及其内容, 内容不包含标签
      const myField = this.inObj
      let content = myField.innerText
      let htmlContent = myField.innerHTML
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

      // 多次尝试寻找实体，得到一个合法的位置
      let legalPos = 0;
      let indexPos = 0;
      while(true){
        legalPos = htmlContent.indexOf(selectText, indexPos)
        // 如果 没找到直接返回
        if (legalPos === -1){
          this.$error({content:"实体之间不能相互包含"})
          return
        }

        // 找到了，验证其是否在已标注的实体内
        let insertIndex = 0;
        for (let index = 0; index < entPos.length; index++) {
          if (legalPos < entPos[index]){
            insertIndex = index;
            break
          }
        }
        // 如果 insertIndex 是一个偶数，则可以插入，否则就重新找
        if (insertIndex % 2 === 0){
          break
        }

        // 继续寻找下一个实体
        indexPos += legalPos + 1;
        if (indexPos >= htmlContent.length){
          this.$error({content:"没有找到相关实体"})
          return
        }

        continue;
      }

      // 插入实体
      let newHtml = htmlContent.substring(0, legalPos)
              + "<" + tag + ">"
              + selectText
              + "</" + tag + ">"
              + htmlContent.substring(legalPos + selectText.length)

      this.$emit("addEntity", newHtml)

    },

    setStyle(v){
      return 'background-color:' + v.color;
    }
  }
}
</script>

