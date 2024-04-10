import {
    printJson2CanvasBase64
} from 'json2canvas.base64'

function preloadImageFn (src) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = src;
    });
}
const imgSrc = 'https://bpic.588ku.com/element_origin_min_pic/01/37/31/24573c46572f507.jpg'
const imageData = await preloadImageFn(imgSrc)
const printJson = [
    {
        type: "text",
        fontSize: "28",
        fontWeight: "bold",
        textAlign: "start",
        content: `hello! 你好！`,
        wrapText: true,
    },
    {
        type: "barcode",
        content: '3405896708324023',
        width: 200, // 条形码宽度，根据实际需求调整
        height: 100, // 条形码高度，根据实际需求调整
        displayValue: true, // 显示条形码下方的文本（订单号）
        text: `平台订单号：3405896708324023`,
        format: "CODE128", // 条形码格式
        fontSize: "20", // 条形码文本字体大小
        textMargin: 5, // 文本与条形码的间距
        textAlign: "center" // 文本对齐方式
    },
    {
        type: "image",
        src: imgSrc,
        width: 200, // 图片宽度，根据需要调整
        height: 200 // 图片高度，根据需要调整
    }
]

const getPathBtnEl = document.getElementById('print-btn')
getPathBtnEl.addEventListener('click', async () => {
    const printerName = 'XP-58 (副本 5)'
    const usbDevicePath = await window.electronAPI.onGetUsbDevicePath(printerName)
    const base64Data = printJson2CanvasBase64(printJson, 400, imageData)
    console.log('xxx', base64Data)

    await window.electronAPI.onSendPrintTask(usbDevicePath, base64Data)
});
