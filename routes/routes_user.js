module.exports = function (app) {
    var md5 = require('md5');
    const usuarioBanco = require('../infra/bancoUsuario');
    
    app.get('/config', function (req, res) {
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
                        'page': 'config'
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

    /*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ Rotas Post ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

    app.post('/config', function (req, res) {
        var dados = req.body;
        var sess = req.session;

        // dados.user_password = md5(dados.user_password);

        if (sess.logado) {
            if (sess.logado == 1) {
                async function teste(dados) {
                    var result = await usuarioBanco.updateUser(dados);

                    if (typeof result != 'undefined') {
                        if (result > 0) {
                            res.redirect('/logout');
                        } else {
                            res.redirect('/erro');
                        }
                    } else {
                        res.redirect('/erro');
                    }
                    return;
                }

                teste(dados);
            } else {
                res.redirect('/');
            }
        } else {
            res.redirect('/');
        }
    });
}