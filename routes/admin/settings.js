var express = require('express');
var router = express.Router();
const { Setting } = require('../../models')
const { success, failure } = require('../../utils/response')
const { NotFoundError } = require('../../utils/error')

router.put('/', async function (req, res, next) {
  try {
    const body = filterBody(req)
    const setting = await getSetting();
    await setting.update(body)
    success(res, '成功', { setting })
  } catch (error) {
    failure(res, error)
  }
});

router.get('/', async function (req, res) {
  try {
    const setting = await getSetting();
    success(res, '查询系统设置成功。', { setting });
  } catch (error) {
    failure(res, error);
  }
});

/**
 * 公共方法：查询当前系统设置
 */
async function getSetting() {
  const setting = await Setting.findOne();
  if (!setting) {
    throw new NotFoundError('初始系统设置未找到，请运行种子文件。')
  }
  return setting;
}


function filterBody(req) {
  return {
    name: req.body.name,
    icp: req.body.icp,
    copyright: req.body.copyright
  };
}
module.exports = router;