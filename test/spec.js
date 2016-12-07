/*global describe, it */

(function () {
    'use strict';
    var assert = require('assert'),
        eaz = require('../lib/eazorm').eaz,
        mysql = require('mysql'),
        fysislem = {},
        config,
        func = {},
        connection;
    config = {
    //    databaseUrl : "46.252.193.250/atlas",
        //server : "213.136.92.107",
        server : "localhost",
      //  databaseUrl : "213.136.92.107/atlas",
        //databaseUrl : " mongodb://apyondbuser:49981704@ds055772.mongolab.com:55772/heroku_954p15xd",
        databaseUrl : "127.0.0.1/atlas",
        //databaseUrl : "192.168.1.23/atlas",
        serverport : 8181,
        //serverport : 3000,
        staticdirs : ["/css", "/js", "/img", "/ui", "/themes", "/static"],
        emailuser : 'veganavi@yandex.com',
        emailpassword : 'v1e2g3a4',
        db: {
            host: '127.0.0.1',
            user: 'root',
            password: '',
            database: 'fystest',
            multipleStatements: true
        }
    };
    connection = mysql.createConnection(config.db);
    connection.connect(function (err) {
        if (err) {
            config.db.database = 'mysql';
            connection = mysql.createConnection(config.db);
            connection.connect();
        }
    });
    eaz.setConnection(connection);

    eaz.coverLists(fysislem, ['SigortaTur', 'Firma', 'Surucu', 'Arac', 'KazaTur', 'CezaTur', 'ServisTip', 'AracTur', 'AracCins', 'AracTip', 'AracGrup', 'YakitTip', 'Bolge', 'Departman', 'DonanimTip', 'MuayeneTip', 'Il', 'Ilce', 'Ekipman', 'FirmaTip']);
    fysislem.delaracTurListeitem = function (req) {
        return eaz.baseDelObj('AracTur', req.query.id);
    };
    eaz.coverObjects(fysislem, ['Arac', 'Surucu', 'AracTur', 'Firma', 'AracMuayene', 'AracKaza', 'AracCeza', 'AracSigorta', 'AracMasraf', 'YakitFis', 'Departman', 'Bolge', 'Personel']);

    eaz.coverAllObjects(func);
    describe('Basic library test', function () {
        it('Dep control from test db', function (done) {
            this.timeout(10000);
            console.dir(fysislem);
            fysislem.loadDepartman({query: {id: 1}}).then(function (o) {
                console.log('o', o.obj);
                assert.equal(o.obj.DepartmanAdi, 'das');
                done();
            }, function (err) {
                console.log('rejected', err);
            });
        });
        it('coverAllObjects', function (done) {
            func.loaddepartman({query: {id: 1}}).then(function (o) {
                console.log('o', o.obj);
                assert.equal(o.obj.DepartmanAdi, 'das');
                done();
            }, function (err) {
                console.log('rejected', err);
            });
        });
    });
}());