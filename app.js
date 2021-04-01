
const Koa = require('koa');
const app = new Koa();

const router = require('./router');

app.use(router.routes());

app.listen(process.env.PORT || 5000);