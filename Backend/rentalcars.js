const expressFunction = require("express");
const mongoose = require("mongoose");
var expressApp = expressFunction();

const url = "mongodb://localhost:27017/rentalcars";
const config = {
  autoIndex: true,
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

var Schema = require("mongoose").Schema;

//Cars Schema
const carsSchema = Schema({
  type: String,
  name: String,
  licensePlate: String,
  detail: String,
  quantity: Number,
  file: String,
  img: String
}, {
  collection: 'cars'
});

let Car
try {
  Car = mongoose.model('cars')
} catch (error) {
  Car = mongoose.model('cars', carsSchema);
}

//Reservations Schema
const reservationsSchema = Schema({
  car: String,
  detail: String,
  name: String,
  tel: String,
  start: String,
  end: String,
  option: String,
  other: String,
}, {
  collection: 'reservations'
});

let Reservation
try {
  Reservation = mongoose.model('reservations')
} catch (error) {
  Reservation = mongoose.model('reservations', reservationsSchema);
}

expressApp.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:4200");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "POST, GET, PUT, PATCH, DELETE, OPTIONS"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type, Option, Authorization"
  );

  return next();
});
expressApp.use(expressFunction.json());


expressApp.use((req, res, next) => {
  mongoose
    .connect(url, config)
    .then(() => {
      console.log("Connected to MongoDB...");
      next();
    })
    .catch((error) => {
      console.log("Cannot connect to MongoDB");
      res.status(501).send("Cannot connect to MongoDB");
    });
});



// Car
//-------------------------------------------------------------------------

const addCar = (carData) => {
  return new Promise((resolve, reject) => {
    var new_car = new Car(
      carData
    );
    new_car.save((err, data) => {
      if (err) {
        reject(new Error('Cannot insert Car to DB!'));
      } else {
        resolve({ message: 'Car added successfully' });
      }
    });
  });
}

const getCars = () => {
  return new Promise((resolve, reject) => {
    Car.find({}, (err, data) => {
      if (err) {
        reject(new Error('Cannot get cars!'));
      } else {
        if (data) {
          resolve(data)
        } else {
          reject(new Error('Cannot get cars!'));
        }
      }
    })
  });
}

const deleteCar = async (id) =>{
  console.log("delete id " + id)
  return new Promise((resolve, reject) => {
    console.log("delete")
    Car.deleteOne({_id: id}, (err, data) => {
      if (err) {
        reject(new Error(err + "Cannot Delete this Car"));
      } else {
        resolve({ message: "Car deleted successfully." });
      }
    });
  });
}

const updateCar = async (id, data) => {
  console.log("999 " + id)
  console.log("777 " + data)
  return new Promise((resolve, reject) => {
     if (id === undefined) {
      reject(new Error("Cannot update Cars"));
      console.log("000 " )
    } 
    Car.updateOne({ _id: id }, { $set: data }, (err, data) => {
      if (err) {
        reject(new Error("Cannot update Car"));
        console.log("111 " )
      } else {
        resolve({ message: "Car update successfully." });
        console.log("222 " )
      }
    });
  });
};


expressApp.route('/cars/deletecars/:id').delete( (req,res) => {
  console.log("delete")
  console.log(req.params.id)
  deleteCar(req.params.id)
  .then((result)=>{
    res.status(200).json(result)
    .catch((err)=>{
      res.status(404).send(String(err))
    })
  })
 
  
})

expressApp.post('/cars/addcars', (req, res) => {
  console.log('add');
  addCar(req.body)
    .then(result => {
      console.log(result);
      res.status(200).json(result);
    })
    .catch(err => {
      console.log(err);
    })
});

expressApp.get('/cars/get', (req, res) => {
  console.log('get');
  getCars()
    .then(result => {
      console.log(result);
      res.status(200).json(result);
    })
    .catch(err => {
      console.log(err);
    })
});

expressApp.put('/cars/updatecar/:id', (req, res ) =>{ 
 
  updateCar(req.params.id, req.body)
  .then((result) => {
    res.status(200).json(result);
  })
  .catch((err) => {
    res.status(400).send(String(err));
  });  
})



//-------------------------------------------------------------------------

//Reservations
const addReservation = (reservationData) => {
  return new Promise((resolve, reject) => {
    var new_reservation = new Reservation(
      reservationData
    );
    new_reservation.save((err, data) => {
      if (err) {
        reject(new Error('Cannot insert Reservation to DB!'));
      } else {
        resolve({ message: 'Reservation added successfully' });
      }
    });
  });
}

const getReservations = () => {
  return new Promise((resolve, reject) => {
    Reservation.find({}, (err, data) => {
      if (err) {
        reject(new Error('Cannot get reservation!'));
      } else {
        if (data) {
          resolve(data)
        } else {
          reject(new Error('Cannot get reservation!'));
        }
      }
    })
  });
}

expressApp.post('/reservations/addreservations', (req, res) => {
  console.log('add');
  addReservation(req.body)
    .then(result => {
      console.log(result);
      res.status(200).json(result);
    })
    .catch(err => {
      console.log(err);
    })
});

expressApp.get('/reservations/get', (req, res) => {
  console.log('get');
  getReservations()
    .then(result => {
      console.log(result);
      res.status(200).json(result);
    })
    .catch(err => {
      console.log(err);
    })
});

expressApp.use("/user", require("./routes/user"));
expressApp.use("/login", require("./routes/signin"));

expressApp.listen(3000, function () {
  console.log("Listening on port 3000");
});