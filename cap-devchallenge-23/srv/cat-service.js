const cds = require('@sap/cds')
module.exports = function () {
    this.on('CREATE', 'Holes', (req, next) => {
        if (req.data.score - req.data.par == -1) {
            req.data.result = 'birdie'
        }
        return next();
    });
};