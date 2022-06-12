import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import User from './model/users'
dotenv.config();

const app: Express = express();
const port = process.env.PORT;

mongoose.connect('mongodb://localhost/pagination');
const db = mongoose.connection;
db.once('open', async ()=>{
    if(await User.countDocuments().exec() > 0) return

    Promise.all([
        User.create({name: 'User 1'}),
        User.create({name: 'User 2'}),
        User.create({name: 'User 3'}),
        User.create({name: 'User 4'}),
        User.create({name: 'User 5'}),
        User.create({name: 'User 6'}),
        User.create({name: 'User 7'}),
        User.create({name: 'User 8'}),
        User.create({name: 'User 9'}),
        User.create({name: 'User 10'}),
        User.create({name: 'User 11'}),
        User.create({name: 'User 12'}),
        User.create({name: 'User 13'}),
        User.create({name: 'User 14'}),
        User.create({name: 'User 15'}),
        User.create({name: 'User 16'}),

    ]).then(() => console.log('Added Users'))
})


app.get("/users", paginatedResults(User), (req:any, res:any) => {
  res.json(res.paginatedResults);
});



function paginatedResults(model:any) {
  return async (req:any, res:any, next:any) => {
    const page = Number(req.query.page);
    const limit = Number(req.query.limit);

    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    const results:any = {};

    if (endIndex < await model.countDocuments().exec()) {
      results.next = {
        page: page + 1,
        limit,
      };
    }

    if (startIndex > 0) {
      results.previous = {
        page: page - 1,
        limit,
      };
    }
    try{
        results.results = await model.find().limit(limit).skip(startIndex).exec();
        res.paginatedResults = results;
        next();
    } catch (e:any) {
        res.status(500).json({message: e.message})
    }
  };
}




app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});