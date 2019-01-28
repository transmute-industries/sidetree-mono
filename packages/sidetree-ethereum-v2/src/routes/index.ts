import Router from 'koa-router';

import time from './time';

const router = new Router();

router.use(time.routes(), time.allowedMethods());

export default router;
