module.exports = {
    port: 3000,
    session: {
        secret: 'express-blog',
        key: 'express-blog',
        maxAge: 2592000000
    },
    mongodb: 'mongodb://localhost:27017/express-blog'
};
