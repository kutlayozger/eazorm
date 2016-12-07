# eazorm

eazorm simple basic orm package


# install
npm install eazorm

# Sample (with express)
```
    var config,
        eaz = require("eazorm").eaz,
        express = require('express'),
        mysql = require('mysql'),
        connection,
        ormfuncs = {},
        app = express();

    config = {
        server : "localhost",
        serverport : 8181,
        db: {
            host: '127.0.0.1',
            user: 'root',
            password: '',
            database: 'mydatabase',
            multipleStatements: true
        }
    };


    connection = mysql.createConnection(config.db);
    connection.connect(function (err) {
        if (err) {
            console.error('Connection err');
        }
    });
    eaz.setConnection(connection);
    eaz.coverLists(ormfuncs, [
        'Table1',
        'Table2' //,...
    ]); /*cover as list funcs*/
    eaz.coverObjects(ormfuncs, [
        'OtherTable1',
        'OtherTable2'
        //, ...
        ]);

    app.all('/data', function (req, res) {
        if (!req.query.func) {
            res.json({id: 1, text: 'deneme'});
        } else {
            if (ormfuncs[req.query.func]) {
                ormfuncs[req.query.func](req).then(function (s) {
                    res.json(s);
                });
            } else {
                console.error('orm func not found');
                console.log(JSON.stringify(req.body));
                console.log(JSON.stringify(req.query));
            }
        }
    });

    http.listen(config.serverport, function () {
        log('listening on *:' + http.address().port);
    });

```

Rest Samples
```
http://localhost:8181/data?func=otherTable1GridListe
http://localhost:8181/data?func=delotherTable1item&id=1
http://localhost:8181/data?func=loadOtherTable1&id=1
http://localhost:8181/data?func=table1Liste

```

# Used Projects
* [apyon.net](http://apyon.net/) Turkish Apartment Management Software
* [aysi.net](http://aysi.net/) Fleet Management System


# License

The MIT License (MIT)

Copyright (c) 2013-2016 Kutlay Ozger

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.  IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.

