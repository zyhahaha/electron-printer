import { queryUsbDevicePathFn, ipcTsplCommand, ipcEscPosCommand } from 'escpos-tspl.electron'
import WebSocket from 'ws'
let wss

function run() {
  wss = new WebSocket.Server({ port: 12345 })

  wss.on('connection', function connection(ws) {
    console.log('Client connected')

    ws.on('message', function incoming(message) {
      try {
        const messageData = JSON.parse(message)
        console.log(messageData)
        const printCommand = messageData.command
        const printerName = messageData.printerName
        const printData = messageData.data
        let base64Data = ''
        if (typeof printData === 'string') {
          base64Data = printData
        }
        queryUsbDevicePathFn(printerName, (usbDevicePath) => {
          console.log(usbDevicePath)
          if (!usbDevicePath) return 'No printer found'

          if (printCommand === 'tspl') {
            ipcTsplCommand(usbDevicePath, base64Data)
          } else if (printCommand === 'escpos') {
            ipcEscPosCommand(usbDevicePath, base64Data)
          }
        })
      } catch (error) {
        console.log(error)
      }
    })

    ws.send('Hello, client!')
  })
}

export default run
