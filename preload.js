const { contextBridge, ipcRenderer } = require('electron/renderer')

contextBridge.exposeInMainWorld('electronAPI', {
    onGetUsbDevicePath: (printerName, ipcID) => ipcRenderer.invoke('onGetUsbDevicePath', printerName, ipcID),
    onSendPrintTask: (usbDevicePath, base64Data) => ipcRenderer.send('onSendPrintTask', usbDevicePath, base64Data)
})
