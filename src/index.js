// const { ipcEscPosCommand } = require('../print-label/tools')
// import { ipcEscPosCommand } from './print-label/tools.js'
import {
    drawFunction
} from './print-label/common.js'

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
    const ipcID = "generateUUID('ipc-')"
    const printerName = 'XP-58 (副本 5)'
    const usbDevicePath = await window.electronAPI.onGetUsbDevicePath(printerName, ipcID)
    const base64Data = drawFunction(drawDataList, 500)
    console.log('xxx', base64Data)

    await window.electronAPI.onSendPrintTask(usbDevicePath, base64Data)
});
