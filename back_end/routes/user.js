const express = require('express');
const { query } = require('../helpers/db.js');
const bcrypt = require('bcrypt');

const userRouter = express.Router();

//Register
userRouter.post("/register", async (req, res) => {
    bcrypt.hash(req.body.password, 10, async (err, hash) => {
        if(!err) {
            const user_name = req.body.user_name;
            const email = req.body.email;
            const password = hash;
            try {
                const sql = 'INSERT INTO users (user_name, password, email, avatar) VALUES ($1, $2, $3, (SELECT id FROM avatars ORDER BY random() LIMIT 1)) RETURNING *'
                const result = await query(sql, [user_name, password, email]);
                const rows = result.rows ? result.rows : [];
                res.status(200).json({ user_id: rows[0].user_id, user_name: user_name, email: email, avatar: rows[0].avatar })
            } catch (error) {
                console.log(error)
                res.statusMessage = error
                res.status(500).json({ error: error.message })
            }
        } else {
            res.statusMessage = err
            res.status(500).json({ error: err.message })
        }
    });
});

//Login to an account:
userRouter.post("/users/login", async(req,res) => {
    console.log(req.body);
    try {
        const sql = "SELECT users.*, avatars.link FROM users INNER JOIN avatars ON users.avatar=avatars.id WHERE email=$1";
        const result = await query(sql,[req.body.email]);
        console.log(result.rowCount)
        console.log(req.body.password);
        console.log("This " + result.rows[0].password);
        if (result.rowCount === 1) {
            bcrypt.compare(req.body.password,result.rows[0].password, (err, bcrypt_res) => {
                if (!err) {
                    console.log('ok')
                    console.log(bcrypt_res)
                    if (bcrypt_res === true) {
                        const user = result.rows[0];
                        res.status(200).json({ "user_id": user.user_id,"email": user.email, "user_name": user.user_name, "avatar": user.avatar, "link": user.link })
                    } else {
                        res.statusMessage = 'Invalid login';
                        res.status(401).json({ error: 'Invalid login '})
                    }
                } else {
                    res.statusMessage = err;
                    res.status(500).json({error: err})
                }
            })
        } else {
            res.statusMessage = 'Invalid login';
            res.status(401).json({error: 'Invalid login'})
        }
    } catch (error) {
        res.statusMessage = error;
        res.status(500).json({error: error})
    }
})

// Change password
userRouter.put("/users/password", async(req, res) => {
    console.log(req.body);
    try {
        const sql = 'SELECT * FROM users WHERE user_id=$1';
        const result = await query(sql,[req.body.user_id]);
        console.log(result.rowCount);
        console.log(req.body.password);
        console.log("This : " + result.rows[0].password);
        
        if (result.rowCount === 1) {
            const user = result.rows[0];
            const passwordMatch = await bcrypt.compare(req.body.password, user.password);
            if (passwordMatch) {
                const hashedPassword = await bcrypt.hash(req.body.new_pass, 10);
                const new_sql = 'UPDATE users SET password = $1 WHERE user_id = $2 RETURNING *';
                const newResult = await query(new_sql, [hashedPassword, req.body.user_id]);
                console.log(newResult.rows[0])
                res.status(200).json({ "user_name": newResult.rows[0].user_name, message: 'Password updated successfully' });
            } else {
                res.status(401).json({ error: 'Incorrect password' });
            }
        } else {
            res.status(401).json({ error: 'User ID not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// User page 
userRouter.get("/user/:user_id", async (req, res) => {
    const user_id = Number(req.params.user_id);
    try {
        const userResult = await query('SELECT users.*, avatars.link FROM users INNER JOIN avatars ON users.avatar=avatars.id WHERE user_id = $1', [user_id]);
        const postResult = await query('SELECT post_id FROM posts WHERE user_id = $1', [user_id]);
        
        const userData = userResult.rows ? userResult.rows[0] : {};
        const postIds = postResult.rows ? postResult.rows.map(post => post.post_id) : [];

        res.status(200).json({ user: userData, posts: postIds });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = { userRouter };
