module.exports = function (app) {
    var md5 = require('md5');
    const usuarioBanco = require('../infra/bancoUsuario');
    const pedidoBanco = require('../infra/bancoPedido');

    app.get('/orderDetail', function (req, res) {
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
                        'page': 'orderDetail'
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

    app.post('/orderDetail', function (req, res) {
        var sess = req.session;
        var dados = req.body;
        var fromDate = dados.fromDate.split('-');
        var toDate = dados.toDate.split('-');
        dados.toDate = toDate[2] + '/' + toDate[1] + '/' + toDate[0];
        dados.fromDate = fromDate[2] + '/' + fromDate[1] + '/' + fromDate[0];
        if (dados.cdMaterial == '') {
            dados.cdMaterial = null;
        }
        if (dados.cdDealer == 'Todos') {
            dados.cdDealer = null;
        }
        if (dados.cdPedido == '') {
            dados.cdPedido = null;
        }
        if (sess.logado) {
            if (sess.logado == 1) {
                async function orderDetail(dados) {
                    var result = await pedidoBanco.orderDetail(dados);
                    if (typeof result != 'undefined') {
                        var resultado = await usuarioBanco.buscaUsuario(sess);
                        if (typeof resultado != 'undefined') {
                            class info {
                                display_name
                                user_name
                                user_mail
                                user_enable
                            }
                            info.id = resultado[0][0]
                            info.display_name = resultado[0][1];
                            info.user_name = resultado[0][2];
                            info.user_mail = resultado[0][3];
                            info.user_enable = resultado[0][4];

                            class order {
                                cdPedido
                                sequencia
                                dtPedido
                                tpPedido
                                cdCliente
                                CFOP
                                cdMaterial
                                cdMaterialAlt
                                requi
                                canc
                                si
                                bo
                                enviado
                                nf
                            }

                            order.cdPedido = []
                            order.sequencia = []
                            order.dtPedido = []
                            order.tpPedido = []
                            order.cdCliente = []
                            order.CFOP = []
                            order.cdMaterial = []
                            order.cdMaterialAlt = []
                            order.requi = []
                            order.canc = []
                            order.si = []
                            order.bo = []
                            order.enviado = []
                            order.nf = []

                            for (i = 0; i < result.length; i++) {
                                order.cdPedido.push(result[i][0]);
                                order.sequencia.push(result[i][1]);
                                diaPedido = JSON.stringify(result[i][2]).split('-');
                                diaPedido = diaPedido[2][0] + diaPedido[2][1] + '/' + diaPedido[1] + '/' + diaPedido[0].replace('"', '');
                                order.dtPedido.push(diaPedido);
                                order.tpPedido.push(result[i][3]);
                                order.cdCliente.push(result[i][4]);
                                order.CFOP.push(result[i][5]);
                                order.cdMaterial.push(result[i][6]);
                                order.cdMaterialAlt.push(result[i][7]);
                                order.requi.push(result[i][8]);
                                order.canc.push(result[i][9]);
                                order.si.push(result[i][10]);
                                order.bo.push(result[i][11]);
                                order.enviado.push(result[i][12]);
                                order.nf.push(result[i][13]);
                            }

                            var resposta = await usuarioBanco.permissaoUsuario(info);

                            if (typeof resposta != 'undefined') {
                                res.render('index.ejs', {
                                    'dados': info,
                                    'order': order,
                                    'permissao': resposta,
                                    'page': 'orderDetail'
                                });
                            } else {
                                res.redirect('/erro');
                            }

                        }
                    } 
                    return;
                }
                orderDetail(dados);
            }
        }
    });
}