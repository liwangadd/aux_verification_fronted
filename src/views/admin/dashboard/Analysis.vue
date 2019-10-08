<template>
  <a-layout-content>
    <a-row :gutter="24" type="flex" align="middle" justify="center" >
      <a-col :span="12" :style="{ marginBottom: '24px' }">
        <chart-card :loading="loading" title="关系标注" total="统计中...">
        </chart-card>
      </a-col>
      <a-col :span="12" :style="{ marginBottom: '24px' }">
        <chart-card :loading="loading" title="实体标注" total="统计中...">
        </chart-card>
      </a-col>
    </a-row>
  </a-layout-content>
</template>

<script>
import moment from 'moment'
import { ChartCard, Trend} from '@/components'
import { mixinDevice } from '@/utils/mixin'


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
    }
  },
  created () {
    setTimeout(() => {
      this.loading = !this.loading
    }, 1000)
  }
}
</script>

<style lang="less" scoped>
  .extra-wrapper {
    line-height: 55px;
    padding-right: 24px;

    .extra-item {
      display: inline-block;
      margin-right: 24px;

      a {
        margin-left: 24px;
      }
    }
  }

  .antd-pro-pages-dashboard-analysis-twoColLayout {
    position: relative;
    display: flex;
    display: block;
    flex-flow: row wrap;

    &.desktop div[class^=ant-col]:last-child {
      position: absolute;
      right: 0;
      height: 100%;
    }
  }

  .antd-pro-pages-dashboard-analysis-salesCard {
    height: calc(100% - 24px);
    /deep/ .ant-card-head {
      position: relative;
    }
  }

  .dashboard-analysis-iconGroup {
    i {
      margin-left: 16px;
      color: rgba(0,0,0,.45);
      cursor: pointer;
      transition: color .32s;
      color: black;
    }
  }
  .analysis-salesTypeRadio {
    position: absolute;
    right: 54px;
    bottom: 12px;
  }
</style>
