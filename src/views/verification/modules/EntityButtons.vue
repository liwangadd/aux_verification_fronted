<template>
  <a-row>
    <a-col :span="24" class="button-row">
      <a-button v-for="b in buttonList" :key="b.name" 
        type="primary" @click="insertAtCursor(b.value)" >{{b.name}}</a-button>
    </a-col>
  </a-row>
</template>

<script>
export default {
  name: "EntityButtons",
  props: ["buttonList", "content"],
  methods:{
    // 点击插入
    async insertAtCursor(myValue) {
      const self = this
      // 获取编辑器
      const myField = document.querySelector('#content')

      if (myField.selectionStart || myField.selectionStart === 0) {
        // 获取头尾焦点
        var startPos = myField.selectionStart
        var endPos = myField.selectionEnd
        // 增加焦点
        self.content = myField.value.substring(0, startPos) + myValue + myField.value.substring(endPos, myField.value.length)

        // 提交
        this.$emit("addEntity", self.content)

        // 待提交后重获焦点
        await this.$nextTick() // 这句是重点, 圈起来
        myField.focus()
        myField.setSelectionRange(endPos + myValue.length, endPos + myValue.length)
      } else {
        self.content += myValue
        this.$emit("addEntity", self.content)
      }


    },
  }
}
</script>

