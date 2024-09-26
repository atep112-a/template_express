const Express = require('express');
const userRoutes = require('./routes/userRoutes');
const mongoose = require('mongoose');

const app = Express();
const port = 3200;

app.use(require('cors')({
    origin: '*',
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}))

app.use(Express.json());


app.get('/', (req, res) => {
    var body = req.body; 
    console.log(body);
    res.status(200).json(body);  
});


app.use('/api', userRoutes);

// Koneksi ke MongoDB
mongoose.connect('mongodb+srv://atepriandipahmi:IFJClLnZzAyn075a@cluster0.xyd1y.mongodb.net/latcsmedia?retryWrites=true&w=majority',
).then(() => {
    console.log('Koneksi ke MongoDB berhasil');
}).catch(err => {
    console.error('Koneksi MongoDB gagal:', err);
});


app.listen(port, () => {
    console.log(`Server berjalan pada port ${port}`);
});
