module.exports = (req, res, next) => {
    if (!req.user) {
        let query = "";
        if (req.originalUrl) {
            query = `?retUrl=${req.originalUrl}`;
        }

        res.redirect(`/account/sign-in${query}`);
    } else next();
};