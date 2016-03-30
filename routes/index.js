var express = require('express');
var router = express.Router();
var crypto = require('crypto'); //加密密码用
User = require('../models/user');

/* GET home page. */
module.exports = function (app) {
    app.get('/', function (req, res) {
        res.render('index', {
            title: '主页',
            user: req.session.user,
            success: req.flash('success').toString(),
            error: req.flash('error').toString()
        });
    });

    app.get('/reg', function (req, res) {
        res.render('reg', {
            title: '注册',
            user: req.session.user,
            success: req.flash('success').toString(),
            error: req.flash('error').toString()
        });
    });

    app.post('/reg', function (req, res) {
        var name = req.body.name,
            password = req.body.password,
            password_re = req.body['password-repeat'];
            //判断用户两次输入是否一致
            if (password_re !== password) {
                req.flash('error', '两次输入的密码不一致');
                return res.redirect('/reg'); //返回用户注册页
            }
            //生成md5值
            var md5 = crypto.createHash('md5'),
                password = md5.update(req.body.password).digest('hex');
            var newUser = new User({
                name: req.body.name,
                password: password,
                email: req.body.email
            });
            //检查用户是否存在
            User.get(newUser.name, function (err, user) {
                if (err) {
                    req.flash('error', err);
                    return res.rmodule.jsedirect('/');
                }

                if (user) {
                    req.flash('error', '用户已存在');
                    return res.redirect('/reg'); //返回注册页
                }
                newUser.save(function (err, user) {
                    if (err) {
                        req.flash('error', err);
                        return res.redirect('/reg'); //注册失败返回注册页
                    }
                    req.session.user = user; //将用户信息存入session
                    req.flash('success', '注册成功!');
                    res.redirect('/');
                });
            });
    });

    app.get('/login', function (req, res) {
        res.render('login', {title: '登录'});
    });

    app.post('/login', function (req, res) {
        // 生成密码的md5值
        var md5 = crypto.createHash('md5'),
            password = md5.update(req.body.password).digest('hex');
        // 检查用户是否存在
        User.get(req.body.name, function (err,user) {
            if (!user) {
                req.flash('error','用户不存在!');
                // 当用户不存在跳转到登录页
                return res.redirect('/login');
            }
        })
    });

    app.get('/post', function (req, res) {
        res.render('post', {title: '发表'});
    });

    app.post('/post', function (req, res) {

    });

    app.get('/logout', function (req, res) {

    });

};
