import {
    printJson2CanvasBase64
} from 'json2canvas.base64'

const drawDataList = [
    {
        type: "text",
        fontSize: "28",
        fontWeight: "bold",
        textAlign: "start",
        content: `卖家备注：test`,
        wrapText: true,
    }
]

const getPathBtnEl = document.getElementById('get-path-btn')
getPathBtnEl.addEventListener('click', async () => {
    const printerName = 'XP-58 (副本 5)'
    const usbDevicePath = await window.electronAPI.onGetUsbDevicePath(printerName)
    const base64Data = printJson2CanvasBase64(drawDataList, 500)
    console.log('xxx', base64Data)

    await window.electronAPI.onSendPrintTask(usbDevicePath, base64Data)
});
