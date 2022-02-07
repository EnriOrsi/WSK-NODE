var Service = require('node-windows').Service;

var svc = new Service({
    name: 'WSK Node',
    description: 'WSK desenvolvido em node por Enri Orsi',
    script: 'C:\\Users\\enri_bernardi\\Desktop\\documentos\\Outros\\gits\\wsk-node\\index.js'
});

svc.on('install', function(){
    svc.start();
});

svc.install();