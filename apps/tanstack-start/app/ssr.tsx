/// <reference types="vinxi/types/server" />
import { registerGlobalMiddleware } from '@tanstack/start';
import { getRouterManifest } from '@tanstack/start/router-manifest';
import {
  createStartHandler,
  defaultStreamHandler,
} from '@tanstack/start/server';

import { authMiddleware } from './middlewares/authMiddleware';
import { createRouter } from './router';

export default createStartHandler({
  createRouter,
  getRouterManifest,
})(defaultStreamHandler);

registerGlobalMiddleware({
  middleware: [authMiddleware],
});
