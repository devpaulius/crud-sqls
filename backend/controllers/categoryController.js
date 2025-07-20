const cats = require('../models/categoryRepo');

exports.getAll = (_,res) => cats.all().then(r=>res.json(r));

exports.create = (req,res) =>
  cats.create(req.body.name.trim()).then(r=>res.json(r));

exports.update = (req,res) =>
  cats.update(parseInt(req.params.id), req.body.name.trim())
      .then(()=>res.json({ message:'Updated' }));

exports.delete = (req,res) =>
  cats.delete(parseInt(req.params.id)).then(()=>res.json({ message:'Deleted' }));
