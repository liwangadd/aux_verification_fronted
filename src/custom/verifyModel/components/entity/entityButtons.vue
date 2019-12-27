<template>
  <a-row>
    <a-col :span="24" class="button-row">
      <a-button v-for="b in buttonList" :key="b.name" 
        type="primary" @click="showDetailModel(b)"
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
  data() {
    return {
      selectValue: null
    }
  },
  methods:{

    // 二级判断
    showDetailModel(b){
      const self = this
      // 判断是否选中
      const selectText = window.getSelection().toString()
      if (selectText === ""){
        return
      }
      
      function setSelectValue(e, value){
        e.$refs.secondSelect.value = value
        self.selectValue = value
      }

      self.selectValue = b.value
      const model = this.$info({
          title: '选择二级类型',
          okText: "确定",
          content: (
            <a-select ref="secondSelect" style="width: 200px" maxTagCount={6} value={self.selectValue} onChange={(v) => setSelectValue(this, v)} >
              <a-select-option key={b.name} value={b.value}> {b.name} </a-select-option>
              {
                self.buttonList.map(item => {
                  if (item == b) return;
                  return <a-select-option key={b.name} value={item.value}> {item.name} </a-select-option>
                })
              }
            </a-select>
          ),
          onOk() {
            self.insertAtCursor(self.selectValue);
          },
          onCancel() {},
          maskClosable: true,
          destroyOnClose: true,
          centered: true,
          class: "secondSelectModel"
      });

      // 对模态框的任何多余操作都会导致选中文本失焦，因此直接关闭文本框
      document.getElementsByClassName("secondSelectModel")[0].addEventListener("click", (e) => {
        e.preventDefault();
        model.destroy();
      });

      document.getElementsByClassName("secondSelectModel")[0].addEventListener("contextmenu",(e) =>{
        e.preventDefault();
        model.destroy();
      });


    },


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

