module.exports = function (Model) {
    var express = require('express')
    var router = express.Router();

    router.post("/", async (req, res) => {
        try {
            var model = new Model(req.body);
            var result = await model.save();
            res.send(result);
        } catch (error) {
            res.status(500).send(error);
        }
    });

    router.get("/", async (req, res) => {
        try {
            let query = Model.find()
            query = populating(query, req)
            var result = await query.exec();
            res.send(result);
        } catch (error) {
            res.status(500).send(error);
        }
    });

    router.get("/:id", async (req, res) => {
        try {
            let query = Model.findById(req.params.id)
            query = populating(query, req)
            var model = await query.exec();
            res.send(model);
        } catch (error) {
            res.status(500).send(error);
        }
    });

    router.put("/:id", async (req, res) => {
        try {
            var model = await Model.findById(req.params.id).exec();
            model.set(req.body)
            var result = await model.save()
            res.send(result)
        } catch (error) {
            res.status(500).send(error);
        }
    });

    router.delete("/:id", async (req, res) => {
        try {
            var result = await Model.findById(req.params.id).exec();
            result.remove()
            res.send({status: 'Ok'});
        } catch (error) {
            res.status(500).send(error);
        }
    });

    function populating(query, req) {
        if (req.query.populate) {
            if (typeof req.query.populate === 'string') {
                query = query.populate(req.query.populate)
            } else {
                for (let i in req.query.populate) {
                    query = multiPopulate(query, req.query.populate[i])
                }
            }
        }
        return query

        function multiPopulate(query, populate) {
            let objPopulate = {}
            let curObj = objPopulate
            populates = populate.split('.')
            for(let i=0; i<populates.length; i++) {
                curObj.path = populates[i]
                if(populates[i+1]) {
                    curObj.populate = {}
                    curObj = curObj.populate
                }
            }

            return query.populate(objPopulate)
        }
    }

    return router
}