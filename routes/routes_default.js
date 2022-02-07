module.exports = function (app) {
    var md5 = require('md5');
    const usuarioBanco = require('../infra/bancoUsuario');

    app.get('/', function (req, res) {
        var sess = req.session;
        class dados {
            id
            user_name
            user_enable
        }
        if (sess.logado) {
            if (sess.logado == 1) {
                dados.id = sess.user_id;
                dados.user_name = sess.user_name;
                dados.user_enable = sess.user_enable;
                async function buscaUsuario(dados) {
                    result = await usuarioBanco.buscaUsuario(dados);
                    if (typeof result[0] != 'undefined') {
                        class resultado {
                            display_name
                            user_name
                            user_mail
                            user_enable
                        }
                        resultado.id = result[0][0]
                        resultado.display_name = result[0][1];
                        resultado.user_name = result[0][2];
                        resultado.user_mail = result[0][3];
                        resultado.user_enable = result[0][4];

                        return resultado;
                    } else {
                        console.log(dados);
                        res.redirect('/erro');
                    }
                    return;
                }
                async function permissaoUsuario(dados) {
                    var result = await usuarioBanco.permissaoUsuario(dados);

                    if (typeof result != 'undefined') {
                        return result;
                    } else {
                        res.redirect('/erro');
                    }
                    return;
                }
                async function renderizar() {
                    var resultado = await buscaUsuario(dados);
                    var resposta = await permissaoUsuario(dados);
                    res.render('index.ejs', {
                        'dados': resultado,
                        'permissao': resposta,
                        'page': 'home'
                    });
                    return;
                }
                renderizar();
            } else {
                res.redirect('/login');
            }
        } else {
            res.redirect('/login');
        }
    });

    app.get('/login', function (req, res) {
        var sess = req.session;

        if (sess.logado) {
            if (sess.logado == 1) {
                res.redirect('/');
            } else {
                res.render('login.ejs');
            }
        } else {
            res.render('login.ejs');
        }
    });

    app.get('/logout', function (req, res) {
        var sess = req.session;
        sess.logado = 0;
        sess.destroy();
        res.redirect('/');
    });

    app.get('/teste', function (req, res) {});
    

    /*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ Rotas Post ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

    app.post('/login', async (req, res) => {
        var sess = req.session;
        var dados = req.body;

        // dados.user_password = md5(dados.user_password);

        async function login(dados) {
            result = await usuarioBanco.login(dados);
            if (typeof result[0] != 'undefined') {
                sess.logado = 1;
                sess.user_id = result[0][0];
                sess.user_name = result[0][2];
                sess.user_enable = result[0][6];
                res.redirect('/');
            } else {
                res.render('login.ejs', {
                    'erro': 1
                });
            }
            return;
        }

        login(dados);

    });
}