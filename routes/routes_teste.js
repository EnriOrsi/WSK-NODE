module.exports = function (app) {
    const priceBanco = require('../infra/bancoPrice');

    app.get('/teste', function (req, res) {
        res.render('teste.ejs');
    });

    app.post('/teste', function(req,res){
        var dados = req.body;

        async function selectPartsPrice(dados){
            var result = await priceBanco.selectPartsPrice(dados);

            if (typeof result != 'undefined'){
                return result;
            } else {
                res.redirect('/erro');
            }
            return;
        }

        async function renderizar() {
            var resultado = await selectPartsPrice(dados);

            res.render('teste1.ejs', {'dados':resultado});
        }

         renderizar();
    });

}