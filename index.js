const express = require('express');
const { default: mongoose } = require('mongoose');
const { schema } = require('./emoto');
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
    , err => {
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


// ****************** filtre par prix **********************************

app.get('/byPrice', async (req, res) => {
    let min = req.query.min;   //query indique que la valeur à comparer/prendre en compte sera après le point d'intérogation
    let max = req.query.max;

    const dataRecup = await Emoto.find({ prix: { $gte: min, $lte: max } });
                                        //$gt: plus grand que,  $lt: plus petit que
    res.json(dataRecup);
    //renvoi ce qui a été recup
});

// µµµµµµµµµµµµµµµµµµµµµµµµµ fin    *****************************************




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


// get by permis or not µµµµµµµµµµµµµµµµµµµµµµµµµµµµµµµµµ

app.get('/vehicules', async (req, res) => { //app.get('/je choisie le nom de route ou lee type de recherche trouvait devra apparaitre !!!!!! ce nom de route sera à reporté dans la requete.service coté front ',   !!!!!!   POUR EVITER BUG CONFRONTATION AVEC ID PLACE LENSEMBLE CETTE METHODE APP.GET AVANT CELLE QUI ON BESOIN D'ID

    // UNE CONSTANTE QUE JE RECUP DANS MA REQUETE (req) grâce au query
    const permisbodyreq = req.query.permis
    // je fais une recherche find by (par critere) dans mon objet 
    const vehicules = await Emoto.find({
        permis: permisbodyreq
    })
    // j'envoie la reponse qui figure dans POSTMAN
    await res.json(vehicules)
})

// **********************************



// **********************************
// get by mot clé *******************************************

app.get('/keyWord', async (req, res) => { //app.get('/je choisie le nom de route ou lee type de recherche trouvait devra apparaitre !!!!!! ce nom de route sera à reporté dans la requete.service coté front ',   !!!!!!   POUR EVITER BUG CONFRONTATION AVEC ID PLACE LENSEMBLE CETTE METHODE APP.GET AVANT CELLE QUI ON BESOIN D'ID

    // UNE CONSTANTE QUE JE RECUP DANS MA REQUETE (req) grâce au query
    const param = req.query.motCles 
    // je fais une recherche find (par critere) dans mon objet 
    const keyWord = await Emoto.find({
        $or: [
            { 'permis': new RegExp(param , 'i' )},
            { 'titre': new RegExp(param , 'i' )},
            // { 'equivalent': new RegExp(param , 'i' )},
        ]
    
    })
    // j'envoie la reponse qui figure dans POSTMAN
    await res.json(keyWord)

    console.log("bodyreq = " , param);
    console.log(" /*/*/*/*/*/*/*/*/*/*/*/********++++++++++++++++++++55555555555/**/*/*/*/*/*/*/" );
    console.log("keyWord = " , keyWord);
})

// **********************************






app.get('/', async (req, res) => {
    const emotos = await Emoto.find()
    await res.json(emotos)
})

app.get('/:id', async (req, res) => {
    const id = req.params.id
    const emoto = await Emoto.findOne({ _id: id })
    res.json(emoto)
})

app.delete('/:id', async (req, res) => {
    const id = req.params.id
    const suppr = await Emoto.deleteOne({ _id: id })
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




// test PUT
// app.put('/:id', async (req, res) => {
//     const id = req.params.id
//     const emoto = await Emoto.findOne({ _id: id }) // on récupere le voiture pour pouvoir le modifier

//     // on récupère les valeurs potentiellement modifiées
//     const titrebody = req.body.titre; // récupération des variables du body
//     const autonomiebody = req.body.autonomie
//     const permisbody = req.body.permis
//     const prixbody = req.body.prix
//     const puissancebody = req.body.puissance
//     const equivalentbody = req.body.equivalent
//     const urlImagebody = req.body.urlImage


//     // on vérifie maintenant si les valeurs sont remplies, si elles le sont on modifie l'ancienne valeure par la nouvelle

//     if (titrebody) {
//         emoto.titre = titrebody
//     }
//     if (autonomiebody) {
//         emoto.autonomie = autonomiebody
//     }
//     if (permisbody) {
//         emoto.permis = permisbody
//     }
//     if (prixbody) {
//         emoto.prix = prixbody
//     }
//     if (puissancebody) {
//         emoto.puissance = puissancebody
//     }
//     if (equivalentbody) {
//         emoto.equivalent = equivalentbody
//     }
//     if (urlImagebody) {
//         emoto.urlImage = urlImagebody
//     }

//     await emoto.save() // on sauvegarde les modifications

//     res.json(emoto)

// })
