// const express =require('express');
// const app=express();

// const bodyparser=require('body-parser');
// const exhbs=require('express-handlebars');
// const dbo=require('./db');
// const ObjectID = dbo.ObjectID;

// app.use(bodyparser.urlencoded({ extended: true }));

// app.engine('hbs',exhbs.engine({layoutsDir:'views/',defaultLayout:'main',extname:'hbs'}));
// app.set('view engine','hbs');
// app.set('views','views');

// app.get('/',async(req,res) =>{
//     try{
//         let database=await dbo.getDatabase();
//         const collection =database.collection('books');
//         const cursor=collection.find({});
//         const books= await cursor.toArray();

//         let message='';
//         let edit_id;
//         let edit_book;

//         if(req.query.edit_id){
//             edit_id=req.query.edit_id;
//             edit_book=await collection.findOne({_id:new ObjectID(edit_id)});
//         }
//         if(req.query.delete_id){
//             await collection.deleteOne({_id: new ObjectID(req.query.delete_id)});
//             return res.redirect('/?status=3')
//         }

//         switch(req.query.status){
//             case '1':
//                 message='Inserted successfully';
//                 break;
//             case '2':
//                 message='Updated successfully';
//                 break;
//             case '3':
//                 message='Deleted successfully';
//                 break;
//             default:
//                 break;
//         }

//         res.render('main',{message,books,edit_id,edit_book});
//     }catch(err){
//         console.log("Error:",err);
//     }
// })
        
// app.post('/store-book',async(req,res)=>{
//     try{
//         let database=await dbo.getDatabase();
//         const collection =database.collection('books');
//         const books={title:req.body.title,author:req.body.author};
//         await collection.insertOne(books);
//         return res.redirect('/?status=1');
//     }catch(err){
//         console.log("Error:",err);
//     }
// })

// app.post('/update-book/:edit_id',async(req,res)=>{
//     try{
//         let database=await dbo.getDatabase();
//         const collection =database.collection('books');
//         const books={title:req.body.title,author:req.body.author};
//         const edit_id=req.params.edit_id;
//         await collection.updateOne({_id:new ObjectID(edit_id)},{$set:books});
//         return res.redirect('/?status=2');
//     }catch(err){
//         console.log("Error:",err);
//     }
// })

// app.listen(8000,()=>{console.log("Listening to port 8000");

// })
const express = require('express');
const session = require('express-session');
const app = express();

const bodyparser = require('body-parser');
const exhbs = require('express-handlebars');
const dbo = require('./db');
const ObjectID = dbo.ObjectID;

app.use(bodyparser.urlencoded({ extended: true }));

// Use session middleware
app.use(session({
    secret: 'Aabith', 
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 3000 } // Message disappears after 3 seconds
}));

app.engine('hbs', exhbs.engine({ layoutsDir: 'views/', defaultLayout: 'main', extname: 'hbs' }));
app.set('view engine', 'hbs');
app.set('views', 'views');

app.get('/', async (req, res) => {
    try {
        let database = await dbo.getDatabase();
        const collection = database.collection('books');
        const cursor = collection.find({});
        const books = await cursor.toArray();

        let edit_id;
        let edit_book;
        let message = req.session.message || '';  // Get message from session
        req.session.message = '';  // Clear message after displaying

        if (req.query.edit_id) {
            edit_id = req.query.edit_id;
            edit_book = await collection.findOne({ _id: new ObjectID(edit_id) });
        }

        res.render('main', { message, books, edit_id, edit_book });
    } catch (err) {
        console.log("Error:", err);
    }
});

app.post('/store-book', async (req, res) => {
    try {
        let database = await dbo.getDatabase();
        const collection = database.collection('books');
        const book = { title: req.body.title, author: req.body.author };
        await collection.insertOne(book);
        req.session.message = 'Inserted successfully'; // Set session message
        return res.redirect('/');
    } catch (err) {
        console.log("Error:", err);
    }
});

app.post('/update-book/:edit_id', async (req, res) => {
    try {
        let database = await dbo.getDatabase();
        const collection = database.collection('books');
        const books = { title: req.body.title, author: req.body.author };
        const edit_id = req.params.edit_id;
        await collection.updateOne({ _id: new ObjectID(edit_id) }, { $set: books });
        req.session.message = 'Updated successfully'; // Set session message
        return res.redirect('/');
    } catch (err) {
        console.log("Error:", err);
    }
});

app.get('/delete-book/:delete_id', async (req, res) => {
    try {
        let database = await dbo.getDatabase();
        const collection = database.collection('books');
        await collection.deleteOne({ _id: new ObjectID(req.params.delete_id) });
        req.session.message = 'Deleted successfully'; // Set session message
        return res.redirect('/');
    } catch (err) {
        console.log("Error:", err);
    }
});

app.listen(8000, () => {
    console.log("Listening to port 8000");
});
