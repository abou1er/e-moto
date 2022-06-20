const express = require('express');
const { default: mongoose } = require('mongoose');
let app = express();
let port = 3333;

const Emoto = require('./emoto')

// app.get('/', function(rep, res){          // création de la route sous le verbe get
//     res.send('res renvoi.  Req recoit')
//     console.log('res renvoi.  Req recoit') ;  // envoi de hello world a l'utilisateur
// })
app.listen(port, () => {
    console.log('Server fonctionne cmd taper node index.js pour lancer le serveur');
})

mongoose.connect(
    'mongodb+srv://abou:1234@cluster0.vn3vc.mongodb.net/emoto?retryWrites=true&w=majority'
    ,err => {
        if (err) throw 'erreur est : ', err;
        console.log('connected to MongoDB')
    });


// Add headers before the routes are defined
app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');  //r.sH('....', '*' étoile permet la connexion de tous les serveur)
    // res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4200');  //<----Bonne pratique

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});



app.use(express.json()) //autorise utilisation format json
app.use(express.urlencoded({ extended: false }));


app.post('/', async (req, res) => {
    const titrebody = req.body.titre; // récupération des variables du body
    const autonomiebody = req.body.autonomie
    const permisbody = req.body.permis
    const prixbody = req.body.prix
    const puissancebody = req.body.puissance
    const equivalentbody = req.body.equivalent
    const urlImagebody = req.body.urlImage


    const nouveau_emoto = new Emoto({ // création d'un objet représentant notre nouveau voiture
        titre: titrebody,
        autonomie: autonomiebody,
        permis: permisbody,
        prix: prixbody,
        puissance: puissancebody,
        equivalent: equivalentbody,
        urlImage: urlImagebody,
    
    })

    await nouveau_emoto.save() // sauvegarde asynchrone du nouveau emoto
    res.json(nouveau_emoto)
    return

})

app.get('/', async (req, res) => {
    const emotos = await Emoto.find()
    await res.json(emotos)
})

app.get('/:id', async (req, res) => {
    const id = req.params.id
    const emoto = await Emoto.findOne({_id : id})
    res.json(emoto)
})

app.delete('/:id', async(req, res) => {
    const id = req.params.id
    const suppr = await Emoto.deleteOne({_id : id})
    res.json(suppr) 
})



app.patch('/:id', async (req, res) => {
    const id = req.params.id
    const emoto = await Emoto.findOne({ _id: id }) // on récupere le voiture pour pouvoir le modifier

    // on récupère les valeurs potentiellement modifiées
    const titrebody = req.body.titre; // récupération des variables du body
    const autonomiebody = req.body.autonomie
    const permisbody = req.body.permis
    const prixbody = req.body.prix
    const puissancebody = req.body.puissance
    const equivalentbody = req.body.equivalent
    const urlImagebody = req.body.urlImage


    // on vérifie maintenant si les valeurs sont remplies, si elles le sont on modifie l'ancienne valeure par la nouvelle

    if (titrebody) {
        emoto.titre = titrebody
    }
    if (autonomiebody) {
        emoto.autonomie = autonomiebody
    }
    if (permisbody) {
        emoto.permis = permisbody
    }
    if (prixbody) {
        emoto.prix = prixbody
    }
    if (puissancebody) {
        emoto.puissance = puissancebody
    }
    if (equivalentbody) {
        emoto.equivalent = equivalentbody
    }
    if (urlImagebody) {
        emoto.urlImage = urlImagebody
    }

    await emoto.save() // on sauvegarde les modifications

    res.json(emoto)

})