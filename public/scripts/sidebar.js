function pedido(){
    if (document.getElementById('pedido').classList[2] == 'fa-chevron-circle-right'){
        var elemento = document.getElementById('pedido');
        elemento.classList.remove('fa-chevron-circle-right');
        elemento.classList.add('fa-chevron-circle-down');
    } else if (document.getElementById('pedido').classList[2] == 'fa-chevron-circle-down'){
        var elemento = document.getElementById('pedido');
        elemento.classList.remove('fa-chevron-circle-down');
        elemento.classList.add('fa-chevron-circle-right');
    }
}
function ordem(){
    if (document.getElementById('ordem').classList[2] == 'fa-chevron-circle-right'){
        var elemento = document.getElementById('ordem');
        elemento.classList.remove('fa-chevron-circle-right');
        elemento.classList.add('fa-chevron-circle-down');
    } else if (document.getElementById('ordem').classList[2] == 'fa-chevron-circle-down'){
        var elemento = document.getElementById('ordem');
        elemento.classList.remove('fa-chevron-circle-down');
        elemento.classList.add('fa-chevron-circle-right');
    }
}
function pacote(){
    if (document.getElementById('pacote').classList[2] == 'fa-chevron-circle-right'){
        var elemento = document.getElementById('pacote');
        elemento.classList.remove('fa-chevron-circle-right');
        elemento.classList.add('fa-chevron-circle-down');
    } else if (document.getElementById('pacote').classList[2] == 'fa-chevron-circle-down'){
        var elemento = document.getElementById('pacote');
        elemento.classList.remove('fa-chevron-circle-down');
        elemento.classList.add('fa-chevron-circle-right');
    }
}
function faturamento(){
    if (document.getElementById('faturamento').classList[2] == 'fa-chevron-circle-right'){
        var elemento = document.getElementById('faturamento');
        elemento.classList.remove('fa-chevron-circle-right');
        elemento.classList.add('fa-chevron-circle-down');
    } else if (document.getElementById('faturamento').classList[2] == 'fa-chevron-circle-down'){
        var elemento = document.getElementById('faturamento');
        elemento.classList.remove('fa-chevron-circle-down');
        elemento.classList.add('fa-chevron-circle-right');
    }
}
function controle(){
    if (document.getElementById('controle').classList[2] == 'fa-chevron-circle-right'){
        var elemento = document.getElementById('controle');
        elemento.classList.remove('fa-chevron-circle-right');
        elemento.classList.add('fa-chevron-circle-down');
    } else if (document.getElementById('controle').classList[2] == 'fa-chevron-circle-down'){
        var elemento = document.getElementById('controle');
        elemento.classList.remove('fa-chevron-circle-down');
        elemento.classList.add('fa-chevron-circle-right');
    }
}
function inventario(){
    if (document.getElementById('inventario').classList[2] == 'fa-chevron-circle-right'){
        var elemento = document.getElementById('inventario');
        elemento.classList.remove('fa-chevron-circle-right');
        elemento.classList.add('fa-chevron-circle-down');
    } else if (document.getElementById('inventario').classList[2] == 'fa-chevron-circle-down'){
        var elemento = document.getElementById('inventario');
        elemento.classList.remove('fa-chevron-circle-down');
        elemento.classList.add('fa-chevron-circle-right');
    }
}
function compra(){
    if (document.getElementById('compra').classList[2] == 'fa-chevron-circle-right'){
        var elemento = document.getElementById('compra');
        elemento.classList.remove('fa-chevron-circle-right');
        elemento.classList.add('fa-chevron-circle-down');
    } else if (document.getElementById('compra').classList[2] == 'fa-chevron-circle-down'){
        var elemento = document.getElementById('compra');
        elemento.classList.remove('fa-chevron-circle-down');
        elemento.classList.add('fa-chevron-circle-right');
    }
}
function material(){
    if (document.getElementById('material').classList[2] == 'fa-chevron-circle-right'){
        var elemento = document.getElementById('material');
        elemento.classList.remove('fa-chevron-circle-right');
        elemento.classList.add('fa-chevron-circle-down');
    } else if (document.getElementById('material').classList[2] == 'fa-chevron-circle-down'){
        var elemento = document.getElementById('material');
        elemento.classList.remove('fa-chevron-circle-down');
        elemento.classList.add('fa-chevron-circle-right');
    }
}
function pacificacao(){
    if (document.getElementById('pacificacao').classList[2] == 'fa-chevron-circle-right'){
        var elemento = document.getElementById('pacificacao');
        elemento.classList.remove('fa-chevron-circle-right');
        elemento.classList.add('fa-chevron-circle-down');
    } else if (document.getElementById('pacificacao').classList[2] == 'fa-chevron-circle-down'){
        var elemento = document.getElementById('pacificacao');
        elemento.classList.remove('fa-chevron-circle-down');
        elemento.classList.add('fa-chevron-circle-right');
    }
}
function admin(){
    if (document.getElementById('admin').classList[2] == 'fa-chevron-circle-right'){
        var elemento = document.getElementById('admin');
        elemento.classList.remove('fa-chevron-circle-right');
        elemento.classList.add('fa-chevron-circle-down');
    } else if (document.getElementById('admin').classList[2] == 'fa-chevron-circle-down'){
        var elemento = document.getElementById('admin');
        elemento.classList.remove('fa-chevron-circle-down');
        elemento.classList.add('fa-chevron-circle-right');
    }
}
function relatorio(){
    if (document.getElementById('relatorio').classList[2] == 'fa-chevron-circle-right'){
        var elemento = document.getElementById('relatorio');
        elemento.classList.remove('fa-chevron-circle-right');
        elemento.classList.add('fa-chevron-circle-down');
    } else if (document.getElementById('relatorio').classList[2] == 'fa-chevron-circle-down'){
        var elemento = document.getElementById('relatorio');
        elemento.classList.remove('fa-chevron-circle-down');
        elemento.classList.add('fa-chevron-circle-right');
    }
}
function usuario(){
    if (document.getElementById('usuario').classList[2] == 'fa-chevron-circle-right'){
        var elemento = document.getElementById('usuario');
        elemento.classList.remove('fa-chevron-circle-right');
        elemento.classList.add('fa-chevron-circle-down');
    } else if (document.getElementById('usuario').classList[2] == 'fa-chevron-circle-down'){
        var elemento = document.getElementById('usuario');
        elemento.classList.remove('fa-chevron-circle-down');
        elemento.classList.add('fa-chevron-circle-right');
    }
}


window.onload = function(){
    var pedido = $('#pedido-ul li').length;
    var ordem = $('#ordem-ul li').length;
    var pacote = $('#pacote-ul li').length;
    var faturamento = $('#faturamento-ul li').length;
    var controle = $('#controle-ul li').length;
    var inventario = $('#inventario-ul li').length;
    var compra = $('#compra-ul li').length;
    var material = $('#material-ul li').length;
    var pacificacao = $('#pacificacao-ul li').length;
    var relatorio = $('#relatorio-ul li').length;
    var admin = $('#admin-ul li').length;

    if (pedido < 1){
        $("#pedidoButao").attr("style", "display: none");
    }
    if (ordem < 1){
        $("#ordemButao").attr("style", "display: none");
    }
    if (pacote < 1){
        $("#pacoteButao").attr("style", "display: none");
    }
    if (faturamento < 1){
        $("#faturamentoButao").attr("style", "display: none");
    }
    if (controle < 1){
        $("#controleButao").attr("style", "display: none");
    }
    if (inventario < 1){
        $("#inventarioButao").attr("style", "display: none");
    }
    if (compra < 1){
        $("#compraButao").attr("style", "display: none");
    }
    if (material < 1){
        $("#materialButao").attr("style", "display: none");
    }
    if (pacificacao < 1){
        $("#pacificacaoButao").attr("style", "display: none");
    }
    if (relatorio < 1){
        $("#relatorioButao").attr("style", "display: none");
    }
    if (admin < 1){
        $("#adminButao").attr("style", "display: none");
    }
}