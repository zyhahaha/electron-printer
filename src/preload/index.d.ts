declare global {
  interface Window {
    electronAPI: {
      onGetUsbDevicePath: (printerName: string, ipcID: string) => string;
    }
  }
}
