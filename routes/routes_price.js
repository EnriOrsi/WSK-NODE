module.exports = function (app) {
    var md5 = require('md5');
    const usuarioBanco = require('../infra/bancoUsuario');
    const priceBanco = require('../infra/bancoPrice');

    app.get('/price', function (req, res) {
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
                        'page': 'price'
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

    app.post('/price', function (req, res) {
        var sess = req.session;
        var dados = req.body;

        if (sess.logado) {
            if (sess.logado == 1) {

                async function prereq(dados) {
                    result = await priceBanco.prereq(dados);

                    if (typeof result != 'undefined') {
                        class prereq {
                            peca
                            pma
                            wsk
                            wskStatus
                            ebsMaster
                            ebsB04
                            sekUF
                            partsPrice
                            sekPrice
                            fob
                        }

                        if (typeof dados.cdMaterial == 'string') {
                            prereq.peca = result[0][0];
                            prereq.pma = result[0][1];
                            prereq.wsk = result[0][2];
                            prereq.wskStatus = result[0][3];
                            prereq.ebsMaster = result[0][4];
                            prereq.ebsB04 = result[0][5];
                            prereq.sekUF = result[0][6];
                            data = JSON.stringify(result[0][7]).split('-');
                            data = data[2].charAt(0) + data[2].charAt(1) + '/' + data[1] + '/' + data[0].replace('"', '');
                            prereq.partsPrice = data;

                            data1 = JSON.stringify(result[0][8]).split('-');
                            data1 = data1[2].charAt(0) + data1[2].charAt(1) + '/' + data1[1] + '/' + data1[0].replace('"', '');
                            prereq.sekPrice = data1;

                            prereq.fob = result[0][9];
                        } else {
                            prereq.peca = [];
                            prereq.pma = [];
                            prereq.wsk = [];
                            prereq.wskStatus = [];
                            prereq.ebsMaster = [];
                            prereq.ebsB04 = [];
                            prereq.sekUF = [];
                            prereq.partsPrice = [];
                            prereq.sekPrice = [];
                            prereq.fob = [];
                            for (i = 0; i < dados.cdMaterial.length; i++) {
                                prereq.peca.push(result[i][0][0]);
                                prereq.pma.push(result[i][0][1]);
                                prereq.wsk.push(result[i][0][2]);
                                prereq.wskStatus.push(result[i][0][3])
                                prereq.ebsMaster.push(result[i][0][4])
                                prereq.ebsB04.push(result[i][0][5])
                                prereq.sekUF.push(result[i][0][6])

                                data = JSON.stringify(result[i][0][7]).split('-');
                                data = data[2].charAt(0) + data[2].charAt(1) + '/' + data[1] + '/' + data[0].replace('"', '');
                                data1 = JSON.stringify(result[i][0][8]).split('-');
                                data1 = data1[2].charAt(0) + data1[2].charAt(1) + '/' + data1[1] + '/' + data1[0].replace('"', '');


                                prereq.partsPrice.push(data);
                                prereq.sekPrice.push(data1);
                                prereq.fob.push(result[i][0][9]);
                            }
                        }

                        return prereq;
                    }
                }

                class user {
                    id
                    user_name
                    user_enable
                }

                user.id = sess.user_id;
                user.user_name = sess.user_name;
                user.user_enable = sess.user_enable;
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
                    var usuario = await buscaUsuario(user);
                    var permissao = await permissaoUsuario(user);
                    var peca = await prereq(dados);

                    res.render('index.ejs', {
                        'dados': usuario,
                        'permissao': permissao,
                        'peca': peca,
                        'page': 'prereq'
                    });
                    return;
                }
                renderizar();

            } else {
                res.redirect('/')
            }
        } else {
            res.redirect('/')
        }
    });
}