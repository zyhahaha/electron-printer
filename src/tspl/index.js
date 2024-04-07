const { exec } = require('child_process');
const { ipcEscPosCommand } = require('../print-label/tools')

const extractDeviceID = (deviceInfo) => {
    if (!deviceInfo) return null;
    // console.log('deviceInfo', deviceInfo)
    const match = deviceInfo.match(/USB\\VID_[\w&]+\\[\w]+/i);
    return match ? match[0].replace(/\\+/g, '#').toLowerCase() : null;
};

const getPrinter = () => {
    const wmic = require('wmic-js');
    return new Promise((resolve, reject) => {
        wmic()
            .alias('printer')
            .get('Name', 'printerState', 'printerStatus', 'WorkOffline', 'PortName')
            .then((data) => {
                resolve(data);
            })
            .catch(err => {
                reject(err);
            });
    });
}

const printPortMap = () => {
    return new Promise((resolve, reject) => {
        exec('wmic path Win32_USBControllerDevice get Dependent /format:list', (err, stdout) => {
            if (err) {
                reject(err);
                return;
            }
            const usbList = [];
            const map = {};
            const lines = stdout.split('\r\r\n');
            // console.log('lines', lines)
            lines.forEach((line) => {
                if (line.startsWith('Dependent=')) {
                    const usb = line.replace('Dependent=', '');
                    usbList.push(usb);
                }
            });
            // console.log('usbList', usbList)
            for (let i = 0; i < usbList.length; i++) {
                if (usbList[i].indexOf('USBPRINT') > -1) {
                    const line = usbList[i].replace(/"/g, '');
                    const portName = line.substr(line.length - 6);
                    const usbPath = usbList[i - 1].replace(/&amp;/g, '&');
                    if (portName.indexOf('USB') > -1) {
                        map[portName] = usbPath;
                    }
                }
            }
            resolve(map);
        });
    });
};

async function queryUsbDevicePathFn (printerName, callbackFn) {
    const printList = await getPrinter();
    const escpos2 = require('node-escpos-win');

    const portMap = await printPortMap();
    // 这里获取到的usbList里就会有跟portMap中usbPath一样的设备
    const usb = escpos2.GetDeviceList('USB');
    const usbList = usb.list.filter(
        (item) => item.service === 'usbprint' || item.name === 'USB 打印支持'
    );
    printList.forEach(item => {
        // console.log('item', item)
        // console.log('printerName', printerName)
        if (item.Name === printerName) {
            // console.log('找到了, 开始打印', item.Name)
            const usbDevice = usbList.find(usbItem => {
                const deviceID = extractDeviceID(portMap[item.PortName]);
                const simplifiedPath = usbItem.path.replace(/\\+/g, '#').toLowerCase();
                return simplifiedPath.includes(deviceID);
            })
            // console.log(usbDevice && usbDevice.path)
            /**
             * TODOSimoon: 这里有问题
             * 1. 正常打印的时候，关闭打印机之后，再次发送指令，不再打印，且所有数据正常，没有报错
             * 2. 重启项目之后可以再次打印，这里的问题是：为什么重启之后可以和打印机再次链接？？？？
             *  */ 
            callbackFn && callbackFn(usbDevice && usbDevice.path)
            // printTest(usbDevice && usbDevice.path)
        }
    })
}

async function printTest(usbDevicePath) {
    const printData = {
        "order_id":9527,
        "oms_no":9186,
        "data":{
            "oms_no":9186,
            "order_no":9186,
            "pay_time":1707015465,
            "consignee":"蓟善",
            "mobile":"1770467444",
            "store":"测试店铺邻医店",
            "buyers_remark":"这是一个买家的备注信息这是一个买家的备注信息这是一个买家的备注信息这是一个买家的备注信息这是一个买家的备注信息这是一个买家的备注信息",
            "province":"台湾省",
            "city":"屏东县",
            "area":"万丹乡",
            "address":" 复兴路20号测试地址",
            "seller_remark":"地址错误,ww",
            "origin_order_no":[
                "te9763800328434272",
                "te9763800328434273",
                "te9763800328434274",
                "te9763800328434274",
                "te9763800328434274",
                "te9763800328434274",
                "te9763800328434274",
            ],
            "origin_order_invoice":[
                {
                    "invoice_title":"安徽邻医网络科技有限公司",
                    "taxpayer_id":"91340111MA2UER980B",
                    "invoice_price":"-1.00"
                }
            ],
            "product":[
                {
                    "goods_name":"[艾之灵]他达拉非片10mg*8片/盒[艾之灵]他达拉非片10mg*8片/盒[艾之灵]他达拉非片10mg*8片/盒",
                    "sku_name":"0.1g",
                    "goods_price":"0.01",
                    "goods_count":10,
                    "sku":"Y027420",
                    "upc":"6905227007686",
                    "cargo":"货架AAAA货架AAAA货架AAAA货架AAAA货架AAAA货架AAAA货架AAAA货架AAAA",
                    "manufacturer":"东北制药集团沈阳第一制药有限公司东北制药集团沈阳第一制药有限公司东北制药集团沈阳第一制药有限公司东北制药集团沈阳第一制药有限公司",
                    "authorized_no":"国药准字H20223492",
                    "batches":[
                        {
                            "oms_product_id":15301,
                            "batch_no":"-",
                            "valid_date":"-",
                            "num":10
                        },
                        {
                            "oms_product_id":15301,
                            "batch_no":"-",
                            "valid_date":"-",
                            "num":10
                        },
                        {
                            "oms_product_id":15301,
                            "batch_no":"-",
                            "valid_date":"-",
                            "num":10
                        },
                        {
                            "oms_product_id":15301,
                            "batch_no":"-",
                            "valid_date":"-",
                            "num":10
                        }
                    ]
                },
                {
                    "goods_name":"[艾之灵]他达拉非片10mg*8片/盒",
                    "sku_name":"0.1g",
                    "goods_price":"0.01",
                    "goods_count":10,
                    "sku":"Y027420",
                    "upc":"6905227007686",
                    "cargo":"-",
                    "manufacturer":"东北制药集团沈阳第一制药有限公司东北制药集团沈阳第一制药有限公司东北制药集团沈阳第一制药有限公司东北制药集团沈阳第一制药有限公司东北制药集团沈阳第一制药有限公司东北制药集团沈阳第一制药有限公司东北制药集团沈阳第一制药有限公司东北制药集团沈阳第一制药有限公司东北制药集团沈阳第一制药有限公司东北制药集团沈阳第一制药有限公司东北制药集团沈阳第一制药有限公司东北制药集团沈阳第一制药有限公司东北制药集团沈阳第一制药有限公司东北制药集团沈阳第一制药有限公司东北制药集团沈阳第一制药有限公司东北制药集团沈阳第一制药有限公司",
                    "authorized_no":"国药准字H20223492",
                    "batches":[
                        {
                            "oms_product_id":15301,
                            "batch_no":"-",
                            "valid_date":"-",
                            "num":10
                        }
                    ]
                },
                {
                    "goods_name":"[艾之灵]他达拉非片10mg*8片/盒",
                    "sku_name":"0.1g",
                    "goods_price":"0.01",
                    "goods_count":10,
                    "sku":"Y027420",
                    "upc":"6905227007686",
                    "cargo":"-",
                    "manufacturer":"东北制药集团沈阳第一制药有限公司东北制药集团沈阳第一制药有限公司东北制药集团沈阳第一制药有限公司东北制药集团沈阳第一制药有限公司东北制药集团沈阳第一制药有限公司东北制药集团沈阳第一制药有限公司东北制药集团沈阳第一制药有限公司东北制药集团沈阳第一制药有限公司",
                    "authorized_no":"国药准字H20223492",
                    "batches":[
                        {
                            "oms_product_id":15301,
                            "batch_no":"-",
                            "valid_date":"-",
                            "num":10
                        }
                    ]
                }
            ],
            "print_send_number":4
        }
    }

    const configData = {
        "order_no":1,
        "pay_time":1,
        "consignee":1,
        "mobile":1,
        "goods_name":1,
        "sku_name":1,
        "goods_count":1,
        "sku":1,
        "upc":1,
        "cargo":1,
        "store":1,
        "buyers_remark":1,
        "seller_remark":1,
        "origin_order_no":1,
        "origin_order_barcode":1,
        "origin_order_invoice":1,
        "batch_no":1,
        "valid_date":1,
        "authorized_no":1,
        "manufacturer": 1,
        "image": "",
        "image_intro": "",
        // "image":"https://oss-resource-test.lyky.com.cn/upload/b2c/file/2024-02-03/75282f98d73e0c82cf73a3e53eb2e37a.png",
        // "image_intro":"图片注释的文字信息",
        "custom":"custom123123123",
        "address":1,
        "print_type":"1"
    }

    // const { handlePrint } = require('../print-label/delivery/draw-delivery.js')
    // const base64Data = await handlePrint(printData, configData, 327, true)
    const base64Data = require('./base64.js')
    // console.log('xxx', base64Data, handlePrint)
    ipcEscPosCommand(usbDevicePath, base64Data)
}

module.exports = {
    queryUsbDevicePathFn
}