import express from 'express';
import mongoose from 'mongoose';
import session from 'express-session';
import passport from 'passport';
import multer from 'multer';
import { handleValidationErrors, checkAuth } from './utils/index.js';
import { UserController, ProductController, NewsController, FAQController } from './controllers/index.js';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { productCreateValidation, productEditValidation, registerValidation, loginValidation  } from './validation/index.js';
import cors from 'cors';


const app = express();
const storage = multer.diskStorage({
  destination: (_,__, cb)=>{
    cb(null, 'uploads');
  },
  filename: (_, file, cb)=>{
    cb(null, file.originalname);
  },
});

const upload = multer({ storage});

app.use(express.json());
app.use(cors({
  origin: 'http://localhost:3000', // Замените на домен вашего фронтенда
  credentials: true,
}));
app.use(session({ secret: 'your-secret-key', resave: true, saveUninitialized: true }));

app.use(passport.initialize());
app.use(passport.session());
app.use('/uploads', express.static('uploads'));

mongoose.connect('mongodb://127.0.0.1:27017/furniture')
.then(()=>console.log('DB is Ok'))
.catch((err)=> console.log('DB is not Ok' + err));

const GOOGLE_CLIENT_ID = '468069840808-fvgn0qe52n2hsi0q9fqiog4lbdhg22oe.apps.googleusercontent.com';
const GOOGLE_CLIENT_SECRET = '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';

passport.use(new GoogleStrategy({
    clientID: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    callbackURL: 'http://localhost:3001/auth/google/callback'
  },
  (accessToken, refreshToken, profile, done) => {
      return done(null, profile);
  }
));


passport.serializeUser((user, done) => {
    done(null, user);
  });
  
  passport.deserializeUser((obj, done) => {
    done(null, obj);
  });
  

  app.get('/auth/google',
    passport.authenticate('google', { scope: ['profile', 'email'] })
  );
  
  app.get('/auth/google/callback',
    passport.authenticate('google', { failureRedirect: '/' }),
    async (req, res) => {
      console.log(req);
      let token = await UserController.getUserTokenByGoogle(req.user);
      res.redirect(`http://localhost:3000?token=${token}`);
    }
  );

  app.get('/',
    (req, res) => {
     
      res.redirect('http://localhost:3000');
    }
  );
  
  app.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/');
  });

  app.get('/api/current_user', (req, res) => {
    let userr = req.user;
    res.json({
      user: userr,
    });
  });

app.post('/auth/register', registerValidation, handleValidationErrors, UserController.register);
app.post('/auth/login', loginValidation, handleValidationErrors, UserController.login);
app.get('/auth/me', checkAuth, UserController.getMe);
app.get('/users/:id', UserController.getUserById);


app.get('/products', ProductController.getAllProducts);
app.get('/products/:id', ProductController.getOneProduct);
app.post('/products', checkAuth, productCreateValidation, handleValidationErrors, ProductController.createProduct);
app.delete('/products/:id', checkAuth, ProductController.removeProduct);
app.patch('/products/:id', checkAuth, productEditValidation, handleValidationErrors, ProductController.updateProduct);

app.get('/productTypes/:id', handleValidationErrors, ProductController.getProductTypeById);
app.get('/productTypes', handleValidationErrors, ProductController.getAllProductTypes);


app.get('/news', NewsController.getAllNews);
app.get('/faq', FAQController.getAllFAQ);

app.post('/upload', checkAuth, upload.single('image'), (req, res)=>{
  res.json({
    url:`/uploads/${req.file.originalname}`,
  })

});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
