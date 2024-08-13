const { app, BrowserWindow, ipcMain } = require('electron/main')
const path = require('node:path')
const {
    queryUsbDevicePathFn,
    ipcTsplCommand,
    ipcEscPosCommand
} = require('escpos-tspl.electron')

const createWindow = () => {
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js')
        }
    })

    win.loadFile('index.html')

    ipcMain.handle('onGetUsbDevicePath', (event, printerName) => {
        return new Promise((resolve, reject) => {
            queryUsbDevicePathFn(printerName, (usbDevicePath) => {
                resolve(usbDevicePath)
            })
        })
    })

    ipcMain.on('onSendPrintTask', (event, usbDevicePath, base64Data) => {
        ipcTsplCommand(usbDevicePath, base64Data)
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
