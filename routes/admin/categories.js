var express = require('express');
var router = express.Router();
const { Category, Course } = require('../../models')
const { Op } = require('sequelize')
const { success, failure } = require('../../utils/response')
const { NotFoundError } = require('../../utils/error')

router.get('/:id', async function (req, res, next) {
  try {
    const category = await getCategory(req)
    success(res, '成功', { category })
  } catch (error) {
    failure(res, error)
  }
});

router.post('/', async function (req, res, next) {
  try {
    const body = filterBody(req)
    const category = await Category.create(body)
    success(res, '成功', { category }, 201)
  } catch (error) {
    failure(res, error)
  }
});


router.delete('/:id', async function (req, res) {
  try {
    const category = await getCategory(req);
    const count = await Course.count({ where: { categoryId: req.params.id } });
    if (count > 0) {
      throw new Error('当前分类有课程，无法删除。');
    }
    await category.destroy();
    success(res, '删除分类成功。');
  } catch (error) {
    failure(res, error);
  }
});

router.put('/:id', async function (req, res, next) {
  try {
    const body = filterBody(req)
    const category = await getCategory(req)
    await category.update(body)
    success(res, '成功', { category })
  } catch (error) {
    failure(res, error)
  }
});

router.get('/', async function (req, res, next) {
  try {
    const query = req.query
    const currentPage = Math.abs(Number(query.currentPage)) || 1;
    const pageSize = Math.abs(Number(query.pageSize)) || 10;
    const offset = (currentPage - 1) * pageSize
    const condition = {
      order: [['rank', 'ASC'], ['id', 'ASC']],
      limit: pageSize,
      offset: offset
    }
    if (query.name) {
      condition.where = {
        name: {
          [Op.like]: `%${query.name}%`
        }
      }
    }
    const { count, rows } = await Category.findAndCountAll(condition)
    success(res, '成功', {
      categorys: rows,
      pagination: {
        total: count,
        currentPage,
        pageSize,
      }
    });
  } catch (error) {
    failure(res, error)
  }
});

/**
 * 公共方法：查询当前分类
 */
async function getCategory(req) {
  const { id } = req.params;
  const condition = {
    include: [
      {
        model: Course,
        as: 'courses',
      },
    ]
  }
  const category = await Category.findByPk(id, condition);
  if (!category) {
    throw new NotFoundError(`ID: ${id}的分类未找到。`)
  }
  return category;
}

function filterBody(req) {
  return {
    name: req.body.name,
    rank: req.body.rank
  }
}
module.exports = router;