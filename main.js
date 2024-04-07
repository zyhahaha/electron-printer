const { app, BrowserWindow, ipcMain } = require('electron/main')
const path = require('node:path')
const { queryUsbDevicePathFn } = require('./electron/usb')
const { ipcEscPosCommand } = require('./electron/print')

const createWindow = () => {
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js')
        }
    })

    win.loadFile('index.html')

    ipcMain.handle('onGetUsbDevicePath', (event, printerName, ipcID) => {
        return new Promise((resolve, reject) => {
            queryUsbDevicePathFn(printerName, (usbDevicePath) => {
                // win.webContents.send(`runPrintCommand_${ipcID}`, usbDevicePath);
                resolve(usbDevicePath)
            })
        })
    })

    ipcMain.on('onSendPrintTask', (event, usbDevicePath, base64Data) => {
        ipcEscPosCommand(usbDevicePath, base64Data)
    })
}

app.whenReady().then(() => {
    createWindow()

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow()
        }
    })
})

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})
