<template>
  <div>
    <content-display
      :content=entContent
      :buttonList=buttonList
      @update="updateContent"
      ref="cDiv"
      >
      <template v-slot:button>
        <relation-buttons
          :inObj="inObj"
          @addEntity="updateContent"
        />
      </template>
    </content-display>
    <a-form-item label="关系类型" :labelCol="labelCol" :wrapperCol="wrapperCol">
      <a-select
        v-decorator="['relationId', {rules: [{required: true}], initialValue: ctx.relationId}]" 
        placeholder="请选择"
        @select="incrementHotKey"
        @dropdownVisibleChange="updateRelationSort"
        disabled>
        <a-select-option v-for="reflect in ctx.reflects" :key="reflect.relationId" 
        :value="reflect.relationId">{{ reflect.relationName }}</a-select-option>
      </a-select>
    </a-form-item>
  </div>
</template>

<style>
e1{
  background-color:deepskyblue;
}

e2{
  background-color:palegreen;
}

</style>


<script>
import relationButtons from './relationButtons.vue'
import contentDisplay from '../contentDisplay.vue'
import {mapActions} from 'vuex'

export default {
  components: {relationButtons, contentDisplay},
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
      inObj: null,
    }
  },
  props: ['buttonList', 'content', 'ctx'],
  methods: {
    ...mapActions([
      'increment', // 将 `this.increment()` 映射为 `this.$store.dispatch('increment')`
    ]),
    // 更新实体标注
    updateContent(content) {
      // this.entContent = content
      this.$emit("update",content)
    },
    // 更新关系热key
    incrementHotKey(value, option){
      this.increment(value)
    },
    // 更新关系排序
    updateRelationSort(){
      var keys = this.$store.state.relation.count
      this.ctx.relfects = this.ctx.reflects.sort((a, b) => {
        let a_num = keys[a.relationId]? keys[a.relationId]: 0;
        let b_num = keys[b.relationId]? keys[b.relationId]: 0;

        return a_num > b_num?-1:1
      })
    }
  },
  computed:{
    entContent() {
      return this.content
    }
  },

  mounted(){
    // 延迟更新
    this.$nextTick(() => {
      this.inObj = this.$refs.cDiv.$refs.contextarea
    })

  },

}
</script>

