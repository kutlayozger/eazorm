/*global Promise, define */

/*jslint nomen:true */

(function (root, factory) {
    'use strict';
    if (typeof define === 'function' && define.amd) {
        define([], factory);
    } else {
        root.eaz = factory();
    }
}(this, function () {

    "use strict";
    var
        connection,
        keyFlds = {'Arac': 'Plaka'},
        dispFlds = {'Arac': 'Plaka'},
        defobj = {'Arac': {ModelYili: 2016, AracTur: 1, YakitTip: 1, AracCins: 1, Aktif: 1}},

        lib = {};
    lib.setConnection = function (con) {
        connection = con;
    };

    function fixobj(obj) {
        var i, o;
        for (i in obj) {
            if (obj.hasOwnProperty(i)) {
                o = obj[i];
                if (o === '0000-00-00 00:00:00') {
                    obj[i] = '';
                }
            }
        }
        return obj;
    }

    function baseListe(tblname, fldname, dispfld) {
        return new Promise(function (resolve, reject) {
            var r = [];
            fldname = fldname || 'Id';
            dispfld = dispfld || (tblname + 'Adi');
            connection.query("Select 0 id, '' text union SELECT " + fldname + " id, " + dispfld + " text from " + tblname, function (err, rows) {
                if (err) {
                    console.log('Query err', err);
                    reject(err);
                } else {
                    var i, o;
                    for (i = 0; i < rows.length; i += 1) {
                        o = rows[i];
                        r.push(fixobj(o));
                    }
                    resolve(r);
                }
            });
        });
    }
    lib.baseListe = baseListe;

    function baseGridListe(tblname) {
        return new Promise(function (resolve, reject) {
            var r = [];
            connection.query('SELECT * from ' + tblname, function (err, rows) {
                if (err) {
                    console.log('Query err', err);
                    reject(err);
                } else {
                    var i, o;
                    for (i = 0; i < rows.length; i += 1) {
                        o = rows[i];
                        r.push(fixobj(o));
                    }

                    resolve(r);
                }
            });
        });
    }
    lib.baseGridListe = baseGridListe;

    function baseObj(tblname, oid, keyfld, defobj) {
        defobj = defobj || {};
        console.log('loading', tblname, oid);
        return new Promise(function (resolve, reject) {
            var key = keyfld || 'Id', sql;
            sql = 'SELECT * from ' + tblname + ' where ' + key + ' = ?';
            console.log('sql', sql, oid);
            connection.query(sql, [oid], function (err, rows) {
                if (err) {
                    console.log('Query err', err);
                    reject(err);
                } else {
                    if (rows[0]) {
                        resolve({obj: fixobj(rows[0])});
                    } else {
                        resolve({obj: defobj});
                    }
                }
            });
        });
    }
    lib.baseObj = baseObj;

    function baseInsertObj(tblname, req) {
        return new Promise(function (resolve, reject) {
            var o, i, obj = JSON.parse(req.query.obj), flds = [], arr = [], vals = [], sql;
            for (i in obj) {
                if (obj.hasOwnProperty(i)) {
                    o = obj[i];
                    flds.push(i);
                    arr.push(o);
                    vals.push('?');
                }
            }
            flds = flds.join(',');
            vals = vals.join(',');
            sql = 'INSERT INTO ' + tblname + ' (' + flds + ') values (' + vals + ')';
            console.log('sql', sql);
            connection.query(sql, arr, function (err) {
                if (err) {
                    console.error('sql err', err);
                    reject(err);
                } else {
                    resolve({Mesaj: 'Kaydedildi'});
                }
            });
        });
    }
    lib.baseInsertObj = baseInsertObj;

    function baseUpdateObj(tblname, req, keyfld) {
        return new Promise(function (resolve, reject) {
            keyfld = keyfld || 'Id';
            var i, o, obj = JSON.parse(req.query.obj), flds = [], arr = [], sql, oid;
            oid = obj[keyfld];
            for (i in obj) {
                if (obj.hasOwnProperty(i)) {
                    o = obj[i];
                    if (i !== keyfld) {
                        flds.push(i + '= ?');
                        arr.push(o);
                    }
                }
            }
            arr.push(oid);
            flds = flds.join(',');
            sql = 'UPDATE ' + tblname + ' set ' + flds + ' where ' + keyfld + ' = ?';
            console.log('sql', sql);
            console.log('par', arr);
            connection.query(sql, arr, function (err) {
                if (err) {
                    console.error('sql err', err);
                    reject(err);
                } else {
                    resolve({Mesaj: 'Kaydedildi'});
                }
            });
        });
    }
    lib.baseUpdateObj = baseUpdateObj;

    function baseSaveObj(tblname, req, keyfld) {
        return new Promise(function (resolve, reject) {
            keyfld = keyfld || 'ID';

            var obj = JSON.parse(req.query.obj), kv = req.query.id;
            obj[keyfld] = kv;
            console.log('save obj', JSON.stringify(obj));
            req.query.obj = JSON.stringify(obj);
            lib.baseObj(tblname, kv, keyfld).then(function (oo) {
                console.log('oo', keyfld, JSON.stringify(oo));
                if (!oo.obj[keyfld]) {
                    console.log('inserting');
                    lib.baseInsertObj(tblname, req).then(resolve, reject);
                } else {
                    console.log('updating');
                    lib.baseUpdateObj(tblname, req, keyfld).then(resolve, reject);
                }
            });
        });
    }
    lib.baseSaveObj = baseSaveObj;

    function baseDelObj(tblname, id, keyfld) {
        return new Promise(function (resolve, reject) {
            keyfld = keyfld || 'ID';
            var sql = 'DELETE FROM ' + tblname + ' WHERE ' + keyfld + ' = ?';
            connection.query(sql, [id], function (err) {
                if (err) {
                    console.error('sql err', err);
                    reject(err);
                } else {
                    resolve({Mesaj: 'Kayıt silindi'});
                }
            });
        });
    }
    lib.baseDelObj = baseDelObj;

    function coverList(obj, tblname) {
        var fname = tblname[0].toLowerCase() + tblname.substr(1) + 'Liste';
        console.log(fname);
        obj[fname] = function () {
            console.log(tblname, defobj[tblname]);
            return lib.baseListe(tblname, keyFlds[tblname], dispFlds[tblname]);
        };
    }

    function coverLists(obj, tblnamearr) {
        var i, tblname;
        for (i = 0; i < tblnamearr.length; i += 1) {
            tblname = tblnamearr[i];
            coverList(obj, tblname);
        }
    }
    lib.coverLists = coverLists;

    function coverObject(obj, tblname) {
        obj['del' + tblname + 'item'] = function (req) {
            console.log('del', tblname, req.query.id);
            return lib.baseDelObj(tblname, req.query.id, keyFlds[tblname]);
        };
        obj['save' + tblname] = function (req) {
            console.log('save', tblname, req.query.id);
            return lib.baseSaveObj(tblname, req, keyFlds[tblname]);
        };
        obj['load' + tblname] = function (req) {
            console.log('load', tblname, req.query.id);
            return lib.baseObj(tblname, req.query.id, keyFlds[tblname], defobj[tblname]);
        };
        obj[tblname.toLowerCase() + 'GridListe'] = function (req) {
            console.log('GridListe', tblname, req.query.id);
            return lib.baseGridListe(tblname);
        };
    }

    function coverObjects(obj, tblnamearr) {
        var i, tblname;
        for (i = 0; i < tblnamearr.length; i += 1) {
            tblname = tblnamearr[i];
            coverObject(obj, tblname);
        }
    }

    lib.coverObjects = coverObjects;

    function coverAllObjects(obj) {
        connection.query('show tables', function (err, rows) {
            if (!err) {
                //console.log('show tables (objects)', rows);
                var i, o, k;
                for (i = 0; i < rows.length; i += 1) {
                    o = rows[i];
                    for (k in o) {
                        if (o.hasOwnProperty(k)) {
                            //console.log('obj:', o[k]);
                            coverObject(obj, o[k]);
                        }
                    }
                }
            }
        });
    }
    lib.coverAllObjects = coverAllObjects;

    return lib;
}));
