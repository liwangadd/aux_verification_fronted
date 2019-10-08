<template>
  <a-layout-content>
    <a-row :gutter="24" type="flex" align="middle" justify="center" >
      <a-col :span="12" :style="{ marginBottom: '24px' }">
        <a-card :loading="loading" title="实体标注情况">
          <p>通过：<number>{{ entityCount.passedCount || "统计中..." }}</number> 条</p>
          <p>拒绝：<number>{{ entityCount.rejectCount || "统计中..." }}</number> 条</p>
          <p>未审核：<number>{{ entityCount.remainCount || "统计中..." }}</number> 条</p>

          <a-button
          slot="extra" type="primary"
          ><router-link to='/admin/list/entity-list'>查看</router-link></a-button>

        </a-card>
      </a-col>
      <a-col :span="12" :style="{ marginBottom: '24px' }">
        <a-card :loading="loading" title="关系标注情况">
          <a-button
          slot="extra" type="primary"
          ><router-link to='/admin/list/relation-list'>查看</router-link></a-button>

          <p>通过：<number>{{ relationCount.passedCount || "统计中..." }}</number> 条</p>
          <p>拒绝：<number>{{ relationCount.rejectCount || "统计中..." }}</number> 条</p>
          <p>未审核：<number>{{ relationCount.remainCount || "统计中..." }}</number> 条</p>

        </a-card>
      </a-col>
    </a-row>
  </a-layout-content>
</template>

<script>
import moment from 'moment'
import { ChartCard, Trend} from '@/components'
import { mixinDevice } from '@/utils/mixin'
import { getEntityCount, getRelationCount} from '@/api/admin/statistic'


export default {
  name: 'Analysis',
  mixins: [mixinDevice],
  components: {
    ChartCard,
    Trend
  },
  data () {
    return {
      loading: true,
      entityCount:{},
      relationCount:{},
    }
  },
  created () {
    setTimeout(() => {
      this.loading = !this.loading
    }, 1000)

    getEntityCount().then(res => {
      this.entityCount = res.result
    })

    getRelationCount().then(res => {
      this.relationCount = res.result
    })
  }
}
</script>

<style lang="less" scoped>
number{
  font-size: 24px;
  font-weight: bold;
}
</style>
