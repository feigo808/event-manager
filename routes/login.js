var express = require('express');
var router = express.Router();
var db = require('../db/models/');

// Show Login Page
router.get('/', (req, res) => {
    res.render('login', { title: 'Sign In' })
});

// Post from Login page
router.post('/', async (req, res) => {
    // この書き方について理解する
    const { id, password } = req.body;

    // sessionを初期化する
    req.session.user = null;

    // チェックユーザ名とパスワード
    try {
        // Find User from DB
        const user = await db.User.findOne({
            where: {
                email: id,
                password: db.User.hashPwd(password),
            },
        });
        if (!user) {
            throw new Error('Invalid login');
        }
        // eslint-disable-next-line require-atomic-updates
        // ↑なんでここにこのコメントがある？
        req.session.user = user;
        res.redirect('/');
    } catch (err) {
        setTimeout(() => {
            res.render('login', { title: 'Login', message: 'Invalid login' });
        }, 3000);
    }
});

// Forgot password (処理実装未完成)
router.get('/reset', (req, res) => {
    res.render('reset', { title: 'Reset Password' });
});

// Create Account (処理実装未完成)
router.get('/createAcc', (req, res) => {
    res.render('createAcc', { title: 'Sign Up' })
});

// Logout
router.get('/logout', (req, res) => {
    // Sessionを殺して、ログイン画面に戻る
    req.session.destroy(() => {
        res.redirect('/');
    });
});

module.exports = router;
