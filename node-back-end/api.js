
import {getProductRow,getInfo,searchbar,searchpage,chartdata,GetProductByList,searchCategory,getOptionInfo} from './database.js'
import express from 'express'
import { GetUserList,UpdateUser,ChangePFollow,IncView, getMostViewed, getMostFollowed} from './firebase-db.js';


const router = express.Router();

router.get('/main', async (req, res) => {
    try {

        const p1 = getMostViewed();
        const p2 = getMostFollowed();

        const [data1,data2] = await Promise.all([p1,p2]);
        let result = [];
        result.push({name: "En çok incelenen ürünler", items: data1,slide : true});
        result.push({name: "En çok takip edilen ürünler", items: data2,slide : false});
        res.json(result)
    } catch(e) {
        console.log(e);
        res.status(404).send({error: 'error geting main api'});
    }
});

router.get('/product/info-head/:id', async (req, res) => {
    const id = req.params.id;
    const data = await getInfo(id);
    res.json(data)
});

router.get('/product-info-option/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const data = await getOptionInfo(id);
        res.json(data)
    }
    catch (e) {
        console.log(e);
        res.status(404).send({error:'product-info-option api error'});
    }
});

router.get('/search/:name', async (req, res) => {
    console.log("aaa");
    const name = req.params.name;
    const data = await searchbar(name);
    console.log(data);
    res.json(data)
});

router.get('/search-page/:name', async (req, res) => {
    const name = req.params.name;
    const data = await searchpage(name);
    res.json(data);
});

router.get('/category/:name', async (req, res) => {
    const name = req.params.name;
    const data = await searchCategory(name);
    console.log(('aaa'));
    console.log(data);
    res.json(data);
});

router.get('/chart-data/:id/:currency/:date', async (req, res) => {
    const id = req.params.id;
    const currency = req.params.currency;
    const date = req.params.date;
    const data = await chartdata(id,currency,date);
    res.json(data)
});

router.post('/get-user-list',async (req,res) => {
    try {
        const {id} = req.body;
        console.log(id);
        const list = await GetUserList(id);
        return res.json(list);
    } catch (e) {
        console.log('get-user-list');
        console.log(e);
        res.status(404).send({error:'ID not found'});
    }
});

router.post('/set-user-list',async (req,res) => {
    const {id,list} = req.body;

    try {
        UpdateUser(id,list);
        res.json({message: 'setting succesfull'});
    } catch (e) {
        console.log(e);
        res.status(404).send({error: 'ID not found unsuccesfull set-user event'});
    }
});

router.post('/get-products-by-list',async (req,res) => {
    const {list} = req.body;
    console.log('list:');
    console.log(list);
    try {
        const data = await GetProductByList(list);
        console.log('data');
        console.log(data);
        res.json(data);

    } catch (e) {
        console.log(e);
        res.status(404).send({error: 'error get product by list'});
    }
});

router.post('/change-product-view',async (req,res) => {
    const {id} = req.body;
    try {
        await IncView(id);
        res.status(200).send('Operation ChangePView completed');
    } catch (e) {
        console.log(e);
        res.status(404).send({error: 'error changing product view stats'});
    }
});

router.post('/change-product-follow',async (req,res) => {
    const {id,change} = req.body;
    try {
        await  ChangePFollow(id,change);
        res.status(200).send('Operation ChangePFollow completed');
    } catch (e) {
        console.log(e);
        res.status(404).send({error: 'error changing product follow stats'});
    }
});


export default router;