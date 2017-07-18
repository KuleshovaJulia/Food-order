const User = require('../models/user'); // Import User Model Schema
const Blog = require('../models/blog'); // Import Blog Model Schema
const jwt = require('jsonwebtoken'); // Compact, URL-safe means of representing claims to be transferred between two parties.
const config = require('../config/database'); // Import database configuration

module.exports = (router) => {


  router.post('/newBlog', (req, res) => {
    if (!req.body.title) {
      res.json({ success: false, message: 'Заголовок обязательный' }); 
    } else {
      if (!req.body.body) {
        res.json({ success: false, message: 'Текст обязательный' }); 
      } else {
        if(!req.body.price){
          res.json({ success: false, message: 'Цена обязательна'});
        } else {
          if (!req.body.createdBy) {
          res.json({ success: false, message: 'Ошибка' }); 
        } else {
          const blog = new Blog({
            title: req.body.title, 
            body: req.body.body, 
            price: req.body.price, 
            createdBy: req.body.createdBy 
          });
          // Save into database
          blog.save((err) => {
            if (err) {
              if (err.errors) {
                if (err.errors.title) {
                  res.json({ success: false, message: err.errors.title.message }); 
                } else {
                    if(err.errors.price){
                      res.json({ success: false, message: err.errors.price.message});
                    } else{
                      if (err.errors.body) {
                    res.json({ success   : false, message: err.errors.body.message }); 
                  } else {
                    res.json({ success: false, message: err }); 
                  }
                }
                }
              } else {
                res.json({ success: false, message: err }); 
              }
            } else {
              res.json({ success: true, message: 'Пост сохранен!' }); 
            }
          });
        }
        }

      }
    }
  });

  router.get('/allBlogs', (req, res) => {
    // Search database for all posts
    Blog.find({}, (err, blogs) => {
      if (err) {
        res.json({ success: false, message: err }); 
      } else {
        // Check if blogs were found in database
        if (!blogs) {
          res.json({ success: false, message: 'Пост не найден' }); 
        } else {
          res.json({ success: true, blogs: blogs }); 
        }
      }
    }).sort({ '_id': -1 }); 
  });


  router.get('/singleBlog/:id', (req, res) => {
    // Check if id is present in parameters
    if (!req.params.id) {
      res.json({ success: false, message: 'Ошибка' }); 
    } else {
      Blog.findOne({ _id: req.params.id }, (err, blog) => {
        if (err) {
          res.json({ success: false, message: 'Нет такого id' }); 
        } else {
          if (!blog) {
            res.json({ success: false, message: 'Пост не найден' }); 
           
                  } else {
                    res.json({ success: true, blog: blog }); 
          }
        }
      });
    }
  });

  router.put('/updateBlog', (req, res) => {
    if (!req.body._id) {
      res.json({ success: false, message: 'Ошибка' }); 
    } else {
      // Check if id exists in database
      Blog.findOne({ _id: req.body._id }, (err, blog) => {
        if (err) {
          res.json({ success: false, message: 'Нет такого id' }); 
        } else {
          // Check if id was found in the database
          if (!blog) {
            res.json({ success: false, message: 'Пост не найден' }); 
          } else {
            User.findOne({ _id: req.decoded.userId }, (err, user) => {
              // Check if error was found
              if (err) {
                res.json({ success: false, message: err }); 
              } else {
                if (!user) {
                  res.json({ success: false, message: 'Не удалось аутентифицировать пользователя' }); 
                } else {
                  if (user.name !== blog.createdBy) {
                    res.json({ success: false, message: 'Вы не можете изменять пост. Авторизируйтесь' }); 
                  } else {
                    blog.title = req.body.title; // Save latest title
                    blog.body = req.body.body; 
                    blog.price = req.body.price;
                    blog.save((err) => {
                      if (err) {
                        if (err.errors) {
                          res.json({ success: false, message: 'Пожалуйста, убедитесь, что форма заполнена должным образом' });
                        } else {
                          res.json({ success: false, message: err }); 
                        }
                      } else {
                        res.json({ success: true, message: 'Пост изменен!' }); 
                      }
                    });
                  }
                }
              }
            });
          }
        }
      });
    }
  });


  return router;
};