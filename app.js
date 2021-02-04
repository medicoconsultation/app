const express=require('express')
const app=express()
const bodyparser=require('body-parser')
const path=require('path')
const mongoose=require('mongoose')
const bcrypt=require('bcrypt')
const {google} = require('googleapis')

const {OAuth2} = google.auth
const oAuth2Client = new OAuth2(
    '807868814761-oc8a2a33qql8c92nm4m6p6na4j73c4sg.apps.googleusercontent.com',
    'fFz_A2QGLM584Xu0qWYNJP_s'
  )
  
  // Call the setCredentials method on our oAuth2Client instance and set our refresh token.
  oAuth2Client.setCredentials({
    refresh_token: '1//04JK4BhVLBHvICgYIARAAGAQSNwF-L9Ir_fgT98TUrtNWC8w6LgQB-Ru38P-7Bo0fYRuANVsDNvrElBErF5Wwx9EKJp_45B6Ktcc',
  })
  
  // Create a new calender instance.
  const calendar = google.calendar({ version: 'v3', auth: oAuth2Client })
  
const Patient=require('./model/patient')
const Doctor=require('./model/doctor')


app.use(bodyparser.urlencoded({extended:false}))
app.use(bodyparser.json())
app.use(express.static('public'))




app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')


mongoose.connect(
    'mongodb+srv://db1:MN138VqlKJ0z0cZG@cluster0.dvktu.mongodb.net/db1?retryWrites=true&w=majority',
    {
        useNewUrlParser:true,
        useUnifiedTopology:true
    }
)



app.get('/',(req,res)=>{
    res.sendFile(path.join(__dirname,'./public','https://app-git-master.medicoconsultation.vercel.app/index.html'))
    
})



app.post('/patient-register',(req,res)=>{
    
    
     
     if(!req.body.password.match(/^.{5,10}$/)){
           
            
            res.render('error.ejs', {
                status:409,
                message:"Invalid input",
                info:"Password length should be 5-10"
            })
        
            } 
     
    else {
  
  
  
      Patient.find({email:req.body.email})
      .exec()
      .then(user=>{
          if(user.length>0){
            res.render('error.ejs', {
                status:409,
                message:"User exists",
                info:"Try another email"
            })
          }
  
          else{
              bcrypt.hash(req.body.password,10,(err,hash)=>{
  
                  if(err){
                    res.render('error.ejs', {
                        status:500,
                        message:"Oops",
                        info:"Please try again later"
                    })
                  }
          
                  else{
                              const patient=new Patient({
                              _id:new mongoose.Types.ObjectId(),
                              name:req.body.name,
                              email:req.body.email,
                              password:hash
                                
              }); 
          
              patient.save()
                  .then(result=>{
                      console.log(result);
                      
                      res.sendFile(path.join(__dirname,'./public','https://app-git-master.medicoconsultation.vercel.app/patient-dashboard.html'))
                      
                    
                  })
                  .catch(err=>{
                      console.log(err);
                      res.status(500).json({
                          error:err,
                          message:err.message
                      });
          
                  });
          }
              });
          }
      }) 
    
  
  
  }
      
    
       

})

app.post('/doctor-register',(req,res)=>{



    if(!req.body.password.match(/^.{5,10}$/)){
           
            
        res.render('error.ejs', {
            status:409,
            message:"Invalid input",
            info:"Password length should be 5-10"
        })
    
        } 
 
else {



  Doctor.find({email:req.body.email})
  .exec()
  .then(user=>{
      if(user.length>0){
        res.render('error.ejs', {
            status:409,
            message:"User exists",
            info:"Try another email"
        })
      }

      else{
          bcrypt.hash(req.body.password,10,(err,hash)=>{

              if(err){
                res.render('error.ejs', {
                    status:500,
                    message:"Oops",
                    info:"Please try again later"
                })
              }
      
              else{
                          const doctor=new Doctor({
                          _id:new mongoose.Types.ObjectId(),
                          name:req.body.name,
                          email:req.body.email,
                          password:hash
                            
          }); 
      
          doctor.save()
              .then(result=>{
                  console.log(result);
                  
                  res.sendFile(path.join(__dirname,'./public','https://app-git-master.medicoconsultation.vercel.app/doctor-dashboard.html'))
                  
                
              })
              .catch(err=>{
                  console.log(err);
                  res.status(500).json({
                      error:err,
                      message:err.message
                  });
      
              });
      }
          });
      }
  }) 



}
  


})


app.post('/patient-login',(req,res)=>{


    Patient.find({email:req.body.email})
        .exec()
        .then(user=>{
            if(user.length<1){
                res.render('error.ejs', {
                    status:500,
                    message:"User doesnot exist",
                    info:"Use correct email"
                })
            }
            bcrypt.compare(req.body.password,user[0].password,(err,result)=>{
                if(err){
                    res.render('error.ejs', {
                        status:500,
                        message:"Incorrect password",
                        info:"Use correct password"
                    })
                }
                if(result){

                 
                    res.sendFile(path.join(__dirname,'./public','https://app-git-master.medicoconsultation.vercel.app/patient-dashboard.html'))
                }
                else{
                    res.render('error.ejs', {
                        status:500,
                        message:"Incorrect password",
                        info:"Use correct password"
                    })
                }
                
            })
        })
        .catch(err=>{
            console.log(err);
            res.status(500).json({
                error:err
            });
        });


})

app.post('/doctor-login',(req,res)=>{


    Doctor.find({email:req.body.email})
        .exec()
        .then(user=>{
            if(user.length<1){
                res.render('error.ejs', {
                    status:500,
                    message:"User doesnot exist",
                    info:"Use correct email"
                })
            }
            bcrypt.compare(req.body.password,user[0].password,(err,result)=>{
                if(err){
                    res.render('error.ejs', {
                        status:500,
                        message:"Incorrect password",
                        info:"Use correct password"
                    })
                }
                if(result){

                 
                    res.sendFile(path.join(__dirname,'./public','https://app-git-master.medicoconsultation.vercel.app/doctor-dashboard.html'))
                }
                else{
                    res.render('error.ejs', {
                        status:500,
                        message:"Incorrect password",
                        info:"Use correct password"
                    })
                }
                
            })
        })
        .catch(err=>{
            console.log(err);
            res.status(500).json({
                error:err
            });
        });



})

app.post('/forget-password',(req,res)=>{

})

app.patch('/update-doctor',(req,res)=>{

})

app.patch('/update-patient',(req,res)=>{
    
})

app.post('/patient-med',(req,res)=>{
console.log(req.body.medname,req.body.time,req.body.startdate,req.body.enddate)
// Create a new instance of oAuth and set our Client ID & Client Secret.

  // // Create a new event start date instance for temp uses in our calendar.
  // const eventStartTime = new Date()
  // eventStartTime.setDate(eventStartTime.getDay() + 2)
  
  // // Create a new event end date instance for temp uses in our calendar.
  // const eventEndTime = new Date()
  // eventEndTime.setDate(eventEndTime.getDay() + 4)
  // eventEndTime.setMinutes(eventEndTime.getMinutes() + 45)
  
  // Create a dummy event for temp uses in our calendar

  let st= req.body.startdate.substring(6,10)+'-'+req.body.startdate.substring(3,5)+'-'+req.body.startdate.substring(0,2)+'T'+req.body.time+':00-18:30',ed=req.body.enddate.substring(6,10)+'-'+req.body.enddate.substring(3,5)+'-'+req.body.enddate.substring(0,2)+'T'+req.body.time+':00-18:30'
  const event = {
    summary: req.body.medname,
    description: `Medical Remainder by medico`,
    colorId: 1,
    start: {
      dateTime: st,     // Format: '2015-05-28T09:00:00-07:00'
    timeZone: 'Asia/Calcutta',
  },
  end: {
      dateTime: ed,
      timeZone: 'Asia/Calcutta',
  },
  reminders: {
    useDefault: false,
    overrides: [
        {method: 'popup', 'minutes': 1},
    ],
  }}
  
  // Check if we a busy and have an event on our calendar for the same time.
  calendar.freebusy.query(
    {
      resource: {
        timeMin: st,
        timeMax: ed,
        timeZone: 'Asia/Calcutta',
        items: [{ id: 'primary' }],
      },
    },
    (err, res) => {
      // Check for errors in our query and log them if they exist.
    //   if (err) return console.error('Free Busy Query Error: ', err)
  
      // Create an array of all events on our calendar during that time.
      const eventArr = res.data.calendars.primary.busy
  
      // Check if event array is empty which means we are not busy
      if (eventArr.length === 0)
        // If we are not busy create a new calendar event.
        return calendar.events.insert(
          { calendarId: 'primary', resource: event },
          err => {
            // Check for errors and log them if they exist.
            // if (err) return console.error('Error Creating Calender Event:', err)
            // Else log that the event was created.
            // return console.log('Calendar event successfully created.')
          }
        )
  
    //   return console.log(`Sorry I'm busy...`)
    }
  )
res.sendFile(path.join(__dirname,'./public','https://app-git-master.medicoconsultation.vercel.app/patient-dashboard.html'))

})

app.use((req,res,next)=>{
    const error= new Error('Not found');
    error.status(404);
    
    next(error);
})

app.use((error,req,res,next)=>{
    
      res.status(error.status|| 500);
      res.render('error.ejs', {
        status:404,
        message:"Page not found",
        info:""
    })

})


module.exports=app