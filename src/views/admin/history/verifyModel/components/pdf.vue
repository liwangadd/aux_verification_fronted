<template>
  <div>
    <a-form-item label="PDF文件" :labelCol="labelCol" :wrapperCol="wrapperCol">
      <a
        target="_blank"
        :href="'/static/pdf/' + pdfUrl + '.pdf#page=' + pdfNo "
      >{{ pdfUrl }}</a>
    </a-form-item>
    <a-form-item label="PDF页码" :labelCol="labelCol" :wrapperCol="wrapperCol">
      <p>{{ pdfNo }}</p>
    </a-form-item>
  </div>
</template>

<script>
export default {
  props: ["pdfUrl", "pdfNo"],
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
    }
  }
  
}
</script>

