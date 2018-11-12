/**
 * 显示菜单
 */
import config from "./config"
import fetch from '@system.fetch'

function showMenu () {
  const prompt = require('@system.prompt')
  const router = require('@system.router')
  const appInfo = require('@system.app').getInfo()
  prompt.showContextMenu({
    itemList: ['保存桌面', '关于', '取消'],
    success: function (ret) {
      switch (ret.index) {
      case 0:
        // 保存桌面
        createShortcut()
        break
      case 1:
        // 关于
        router.push({
          uri: '/About',
          params: {
            name: appInfo.name,
            icon: appInfo.icon
          }
        })
        break
      case 2:
        // 取消
        break
      default:
        prompt.showToast({
          message: 'error'
        })
      }
    }
  })
}

/**
 * 创建桌面图标
 * 注意：使用加载器测试`创建桌面快捷方式`功能时，请先在`系统设置`中打开`应用加载器`的`桌面快捷方式`权限
 */
function createShortcut () {
  const prompt = require('@system.prompt')
  const shortcut = require('@system.shortcut')
  shortcut.hasInstalled({
    success: function (ret) {
      if (ret) {
        prompt.showToast({
          message: '已创建桌面图标'
        })
      } else {
        shortcut.install({
          success: function () {
            prompt.showToast({
              message: '成功创建桌面图标'
            })
          },
          fail: function (errmsg, errcode) {
            prompt.showToast({
              message: `${errcode}: ${errmsg}`
            })
          }
        })
      }
    }
  })
}

/**
 * 发送请求
 */
function request (url, data, successBack, faileBack, method="POST",) {
  console.log("引入的config:", config);
  let apiUrl = config.config.apiUrl;
  fetch.fetch({
    url: apiUrl + url,
    data: JSON.stringify(data),
    header: {
      'Content-Type': 'application/json;charset=UTF-8', // 默认值
    },
    method: method,
    success: function (response) {
      let data = JSON.parse(response.data);
      console.log("接口返回数据:", data);
      if (data.code != 200) {
        faileBack(data.msg);
      } else {
        successBack(data.data)
      }
    },
    fail: function (err, code) {
      console.log(`handling fail, code = ${code}`)
      faileBack(err);
    }
  })
}
function login (data, successBack, faileBack) {
  console.log("login接口上送参数:", data);
  request("user/login", data, successBack, faileBack);
}

export default {
  showMenu,
  createShortcut,
  login,
  
}
