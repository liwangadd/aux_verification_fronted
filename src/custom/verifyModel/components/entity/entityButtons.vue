<template>
  <a-row>
    <a-col :span="24" class="button-row">
      <a-button v-for="b in buttonList" :key="b.name" 
        type="primary" @click="insertAtCursor(b.value)"
        :style="setStyle(b)" >{{b.name + b.value }}</a-button>
    </a-col>
  </a-row>
</template>

<style scoped>
.button-row button{
  margin-right: 5px;
  min-width: 200px;
}
</style>

<script>
export default {
  name: "entityButtons",
  props: ["buttonList", "content", "inObj"],
  methods:{
    // 点击插入
    async insertAtCursor(myValue) {
      const self = this
      const prefix = "</o>"
      // 获取编辑器
      const myField = this.inObj
      let content = this.inObj.value

      if (myField.$el.selectionStart || myField.$el.selectionStart === 0) {
        // 获取头尾焦点
        var startPos = myField.$el.selectionStart
        var endPos = myField.$el.selectionEnd

        // 增加焦点
        if (startPos === endPos){ // 没有选中, 直接在尾部加标签
          content = myField.value.substring(0, startPos) + myValue + myField.value.substring(endPos, myField.value.length)
        }else{
          // 文字被选中，在前后加标签
          content = myField.value.substring(0, startPos) + prefix 
                    + myField.value.substring(startPos, endPos)
                    + myValue + myField.value.substring(endPos, myField.value.length)
        }


        // 提交
        this.$emit("addEntity", content)

        // 待提交后重获焦点
        await this.$nextTick() // 这句是重点, 圈起来
        myField.focus()

        // 重获焦点位置
        if (startPos === endPos){
          myField.$el.setSelectionRange(endPos + myValue.length, endPos + myValue.length)
        }else{
          myField.$el.setSelectionRange(endPos + myValue.length + prefix.length, endPos + myValue.length+ prefix.length)
        }
      } else {
        console.log("no focus")
        content += myValue
        this.$emit("addEntity", content)
      }
    },

    setStyle(v){
      return 'background-color:' + v.color;
    }
  }
}
</script>

