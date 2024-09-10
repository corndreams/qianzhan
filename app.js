var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
require('dotenv').config();
const adminAuth = require('./middlewares/admin-auth');
const cors = require('cors')
require('dotenv').config();



var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var adminArticlesRouter = require('./routes/admin/articles');
var adminCategoriesRouter = require('./routes/admin/categories');
var adminSettingsRouter = require('./routes/admin/settings');
var adminUsersRouter = require('./routes/admin/users');
var adminAuthRouter = require('./routes/admin/auth');
var adminCoursesRouter = require('./routes/admin/courses');
var adminChaptersRouter = require('./routes/admin/chapters');
var adminChartsRouter = require('./routes/admin/charts');
var categoriesRouter = require('./routes/categories');
var coursesRouter = require('./routes/courses');
var app = express();
app.use(cors());
var chaptersRouter = require('./routes/chapters');
var articlesRouter = require('./routes/articles');
var settingsRouter = require('./routes/settings');
var searchRouter = require('./routes/search');
var authRouter = require('./routes/auth');

// ...

app.use('/auth', authRouter);
app.use('/search', searchRouter);
app.use('/settings', settingsRouter);
app.use('/articles', articlesRouter);
app.use('/chapters', chaptersRouter);

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/admin/articles', adminAuth, adminArticlesRouter);
app.use('/admin/categories', adminAuth, adminCategoriesRouter);
app.use('/admin/settings', adminAuth, adminSettingsRouter);
app.use('/admin/users', adminAuth, adminUsersRouter);
app.use('/admin/auth', adminAuthRouter);
app.use('/admin/courses', adminAuth, adminCoursesRouter);
app.use('/admin/chapters', adminAuth, adminChaptersRouter);
app.use('/admin/charts', adminAuth, adminChartsRouter);
app.use('/categories', categoriesRouter);
app.use('/courses', coursesRouter);

module.exports = app;
