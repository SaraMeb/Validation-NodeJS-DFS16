var express = require('express');
var createError = require('http-errors');
var router = express.Router();
const Mongo = require('../bin/mongo');
var uniqid = require('uniqid');
var multer  = require('multer');
const ObjectId = require('mongodb').ObjectId;


const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, __dirname + "/../uploads");
  },
  filename: function (req, file, cb) {
    let ext = file.originalname.substr(file.originalname.lastIndexOf('.'));
    let fileName = uniqid('pdfFile-') + ext ;
    console.log(fileName)
    cb(null, fileName);
  }
});
const upload = multer({storage: storage});


/* user avec formulaire login */
router.get('/', function(req, res, next) {
  if(req.session.user) {
    return next() ;
  }
});

router.use(function(req, res, next) {
  // si la session n'exite pas
  if(!req.session || !req.session.user) {
    return next(createError(403));
  }
  return next();
})

/* retourne le dashboard */
router.get('/', function(req, res, next) {
  Mongo.getInstance()
  .collection('rooms')
  .find()
  .toArray((err, rooms) => {
    Mongo.getInstance()
    .collection('users')
    .find()
    .toArray((err, users) => {
      // res.render('users/index', {title:"Liste des users", users:users, req: req});
      res.render('rooms/index', {title:"Liste des rooms", rooms:rooms, users:users, req: req});
    })
  })

});

/* creation d'une chatroom */

router.post('/', function(req, res, next) {
  let errors = [];
  if (!req.body.name) {
    errors.push('Nom de la room');
  }
  if (!req.body.status) {
    errors.push('Status');
  }
  if (!req.body.users) {
    errors.push('Users list');
  }

  if(errors.length) {
    return next(createError(412, "Merci de vérifier les champs : "+errors.join(', ')));
  }
  let datas = {
    name: req.body.name,
    status: req.body.status,
    owner: req.session.user._id,
    users: req.body.users,
  }
  Mongo.getInstance()
  .collection('rooms')
  .insertOne(datas,
    function(err, result) {
      if (err) {
        if(err.message.indexOf('duplicate key') !== -1){
          return  res.json({
            status : false,
            message: err.message
          })
        }
      }
      res.redirect('/rooms');
  })
});

/* detail d'un filpbook */
// router.get('/:id', function(req, res, next) {
//   let bookId = req.params.id;
//
//     Mongo.getInstance()
//     .collection('rooms')
//     .findOne({_id: ObjectId(bookId)}, function (err, result) {
//         if (err) {
//           return res.json({
//             status: false,
//             message: err.message
//           })
//         }
//         return res.json({status : true, result: result});
//     })
//   });


/* edition d'un filpbook */
// router.put('/:id', function(req, res, next) {
//   let errors = [];
//   if (!req.body.title) {
//     errors.push('Titre');
//   }
//   if (!req.body.description) {
//     errors.push('Description');
//   }
//
//   if(errors.length) {
//     return next(createError(412, "Merci de vérifier les champs : "+errors.join(', ')));
//   }
//   console.log(req.body);
//   let bookId = req.params.id;
//   let datas = {
//     title: req.body.title,
//     description: req.body.description,
//   }
//   Mongo.getInstance()
//   .collection('rooms')
//   .updateOne({_id : ObjectId(bookId)}, {$set:datas},
//     function(err, result) {
//       if (err) {
//           return  res.json({
//             status : false,
//             message: err.message
//           })
//
//       }
//       res.json({status : true});
//   })
//
// });

/* suppression d'un filpbook */
// router.delete('/:id', function(req, res, next) {
//   // console.log(req.params.id);
//   let bookId = req.params.id;
//   Mongo.getInstance()
//   .collection('rooms')
//   .deleteOne({_id : ObjectId(bookId)}, function(err, result) {
//       if (err) {
//           return  res.json({
//             status : false,
//             message: err.message
//           })
//       }
//       res.json({status : true});
//   })
// });

module.exports = router;
