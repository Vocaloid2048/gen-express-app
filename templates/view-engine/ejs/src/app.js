import express from 'express';
import path from 'path';
import { __dirname } from "../.express/__dirname.js"

import createError from 'http-errors';
import cookieParser from 'cookie-parser';
import logger from 'morgan';

import usersRouter from './routers/users.js';

// app
const app = express();

// view engine setup
app.set('views', path.join(__dirname(import.meta.url), 'views'));
app.set('view engine', 'ejs');

// plugins
app.use(logger(process.env.NODE_ENV === "production" ? "common" : "dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname(import.meta.url), "../", 'public')));

/** You write your code here */



// routers
app.get("/", (req, res) => {
  res.render("index", { title: 'Express' })
})
app.use('/users', usersRouter);



/** You write your code here */

// error handler
app.use((req, res, next) => {
  next(createError(404));
});

app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = process.env.NODE_ENV === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});


export default app;
