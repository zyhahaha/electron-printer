<template>
  <!-- <p class="tip">Please try pressing <code>F12</code> to open the devTool</p>
  <div class="actions">
    <div class="action">
      <a target="_blank" rel="noreferrer" @click="printHandle">Print Test</a>
    </div>
  </div> -->
  <table-lite
    :is-loading="table.isLoading"
    :columns="table.columns"
    :rows="table.rows"
    @is-finished="table.isLoading = false"
    :is-hide-paging="true"
  ></table-lite>
</template>

<script setup lang="ts">
import TableLite from 'vue3-table-lite'
import { printJson2CanvasBase64 } from 'json2canvas.base64'
import { reactive } from 'vue'

const printJson = [
  {
    type: 'text',
    fontSize: '28',
    fontWeight: 'bold',
    textAlign: 'start',
    content: `hello! 你好！`,
    wrapText: true
  },
  {
    type: 'barcode',
    content: '3405896708324023',
    width: 200, // 条形码宽度，根据实际需求调整
    height: 100, // 条形码高度，根据实际需求调整
    displayValue: true, // 显示条形码下方的文本（订单号）
    text: `平台订单号：3405896708324023`,
    format: 'CODE128', // 条形码格式
    fontSize: '20', // 条形码文本字体大小
    textMargin: 5, // 文本与条形码的间距
    textAlign: 'center' // 文本对齐方式
  }
  // {
  //   type: "image",
  //   src: imgSrc,
  //   width: 200, // 图片宽度，根据需要调整
  //   height: 200, // 图片高度，根据需要调整
  // },
]

const printHandle = async () => {
  const printerName = 'HPRT N41'
  const usbDevicePath = await window.electronAPI.onGetUsbDevicePath(printerName)
  const base64Data = printJson2CanvasBase64(printJson, 400)
  // console.log("----------->>>", usbDevicePath);

  // await window.electronAPI.onSendPrintTask(usbDevicePath, base64Data);
}

const table = reactive({
  isLoading: false,
  columns: [
    {
      label: '任务编号',
      field: 'id',
      width: '3%',
      isKey: true
    },
    {
      label: '状态',
      field: 'name',
      width: '3%'
    },
    {
      label: '打印机',
      field: 'email',
      width: '10%'
    },
    {
      label: '打印时间',
      field: 'email',
      width: '10%'
    }
  ],
  rows: [{}, {}, {}, {}, {}, {}]
})
</script>
<style lang="css">
.vtl-asc {
  background-image: none !important;
}
</style>
