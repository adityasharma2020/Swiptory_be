/* 
  * we can define routes like router.post('/login',contollerfunction).
      but using router.route('/login').post(trimRequest.all, login)
      is more sophisticated way.
  * trimRequest.all to trim all the white spaces on the body,params and query objects from the requests.

*/

import express from 'express';
import trimRequest from 'trim-request';
import { login, logout, register } from '../controllers/auth.controller.js';


const router = express.Router();

router.route('/register').post(trimRequest.all, register);
router.route('/login').post(trimRequest.all, login);
router.route('/logout').post(trimRequest.all, logout);


export default router;
