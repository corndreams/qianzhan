var express = require('express');
var router = express.Router();
const { Article } = require('../../models')
const { Op } = require('sequelize')
const { success, failure } = require('../../utils/response')
const { NotFoundError} = require('../../utils/error')

/* GET home page. */
// router.get('/', async function (req, res, next) {
//   try {
//     const condition = {
//       order: [['id', 'DESC']]
//     }
//     const articles = await Article.findAll(condition);
//     res.json({
//       status: '200',
//       message: '成功',
//       data: {
//         articles
//       }
//     });
//   } catch (error) {
//     res.json({
//       status: '500',
//       message: '失败',
//       data: {
//         error: [error.message]
//       }
//     })
//   }
// });

router.get('/:id', async function (req, res, next) {
  try {
    const article = await getArticle(req)
    success(res, '成功', { article })
  } catch (error) {
    failure(res, error)
  }
});

router.post('/', async function (req, res, next) {
  try {
    const body = filterBody(req)
    const article = await Article.create(body)
    success(res, '成功', { article }, 201)
  } catch (error) {
    failure(res, error)
  }
});

router.delete('/:id', async function (req, res, next) {
  try {
    const article = await getArticle(req)
    await article.destroy()
    success(res, '成功')
  }
  catch (error) {
    failure(res, error)
  }
});

router.put('/:id', async function (req, res, next) {
  try {
    const body = filterBody(req)
    const article = await getArticle(req)
    await article.update(body)
    success(res, '成功', { article })
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
      order: [['id', 'DESC']],
      limit: pageSize,
      offset: offset
    }
    if (query.title) {
      condition.where = {
        title: {
          [Op.like]: `%${query.title}%`
        }
      }
    }
    const { count, rows } = await Article.findAndCountAll(condition)
    success(res, '成功', {
      articles: rows,
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

async function getArticle(req) {
  const { id } = req.params
  const article = await Article.findByPk(id)
  if (!article) {
    throw new NotFoundError(`ID:${id}的文章未找到。`)
  }else{
    return article
  }
}

function filterBody(req) {
  return {
    title: req.body.title,
    content: req.body.content
  }
}
module.exports = router;