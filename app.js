const fs = require("fs")

const express = require("express")
const morgan = require("morgan")
const {
  createObjectID,
} = require("mongo-object-reader")

const app = express()

//middleware express
app.use(express.json())

app.use(morgan("dev"))

// our own middleware function
app.use((req, res, next) => {
  console.log(
    "hallo fsw2di middleware kita sendiri"
  )
  next()
})

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString()
  next()
})

const port = process.env.port || 3000

const tours = JSON.parse(
  fs.readFileSync(
    `${__dirname}/dev-data/data/tours-simple.json`
  )
)
const users = JSON.parse(
  fs.readFileSync(
    `${__dirname}/dev-data/data/users.json`
  )
)

//handler tour
const getAllTours = (req, res) => {
  res.status(200).json({
    status: "success",
    requestTime: req.requestTime,
    data: {
      tours,
    },
  })
}

const getTourById = (req, res) => {
  const id = req.params.id * 1
  const tour = tours.find((el) => el.id === id)

  if (!tour) {
    return res.status(404).json({
      status: "failed",
      message: `data with ${id} not found`,
    })
  }

  res.status(200).json({
    status: "success",
    data: {
      tour,
    },
  })
}

const createTour = (req, res) => {
  const newId = tours[tours.length - 1].id + 1
  const newData = Object.assign(
    { id: newId },
    req.body
  )

  tours.push(newData)
  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(tours, null, 2),
    (err) => {
      res.status(201).json({
        status: "success",
        data: {
          tour: newData,
        },
      })
    }
  )
}

const editTour = (req, res) => {
  const id = req.params.id * 1
  const tourIndex = tours.findIndex(
    (el) => el.id === id
  )

  if (tourIndex === -1) {
    return res.status(404).json({
      status: "failed",
      message: `data with ${id} not found`,
    })
  }
  tours[tourIndex] = {
    ...tours[tourIndex],
    ...req.body,
  }

  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(tours, null, 2),
    (err) => {
      res.status(200).json({
        status: "success",
        message: `Tour with id ${id} edited`,
        data: {
          tour: tours[tourIndex],
        },
      })
    }
  )
}
const deleteTour = (req, res) => {
  const id = req.params.id * 1
  const tourIndex = tours.findIndex(
    (el) => el.id === id
  )

  if (tourIndex === -1) {
    return res.status(404).json({
      status: "failed",
      message: `data with ${id} not found`,
    })
  }

  tours.splice(tourIndex, 1)

  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(tours, null, 2),
    (err) => {
      res.status(200).json({
        status: "success",
        message: `berhasil di delete`,
        data: null,
      })
    }
  )
}

//handler users
const getAllUsers = (req, res) => {
  res.status(200).json({
    status: "success",
    requestTime: req.requestTime,
    data: {
      users,
    },
  })
}

const getUserById = (req, res) => {
  const id = req.params.id
  console.log(id)
  const user = users.find((el) => el._id === id)

  if (!user) {
    return res.status(404).json({
      status: "failed",
      message: `data with ${id} not found`,
    })
  }

  res.status(200).json({
    status: "success",
    data: {
      user,
    },
  })
}
const createUser = (req, res) => {
  const newId = createObjectID()
  console.log(newId)
  const newData = Object.assign(
    { _id: newId },
    req.body
  )

  users.push(newData)
  fs.writeFile(
    `${__dirname}/dev-data/data/users.json`,
    JSON.stringify(users, null, 2),
    (err) => {
      res.status(201).json({
        status: "success",
        data: {
          user: newData,
        },
      })
    }
  )
}
const editUser = (req, res) => {
  const id = req.params.id
  const userIndex = users.findIndex(
    (el) => el._id === id
  )

  if (userIndex === -1) {
    return res.status(404).json({
      status: "failed",
      message: `data with ${id} not found`,
    })
  }
  users[userIndex] = {
    ...users[userIndex],
    ...req.body,
  }

  fs.writeFile(
    `${__dirname}/dev-data/data/users.json`,
    JSON.stringify(users, null, 2),
    (err) => {
      res.status(200).json({
        status: "success",
        message: `Tour with id ${id} edited`,
        data: {
          user: users[userIndex],
        },
      })
    }
  )
}
const deleteUser = (req, res) => {
  const id = req.params.id
  const userIndex = users.findIndex(
    (el) => el._id === id
  )

  if (userIndex === -1) {
    return res.status(404).json({
      status: "failed",
      message: `data with ${id} not found`,
    })
  }

  users.splice(userIndex, 1)

  fs.writeFile(
    `${__dirname}/dev-data/data/users.json`,
    JSON.stringify(users, null, 2),
    (err) => {
      res.status(200).json({
        status: "success",
        message: `berhasil di delete`,
        data: null,
      })
    }
  )
}

const toursRouter = express.Router()
const usersRouter = express.Router()

//tours router
toursRouter
  .route("/")
  .get(getAllTours)
  .post(createTour)

toursRouter
  .route("/:id")
  .get(getTourById)
  .patch(editTour)
  .delete(deleteTour)

//router users
usersRouter
  .route("/")
  .get(getAllUsers)
  .post(createUser)
usersRouter
  .route("/:id")
  .get(getUserById)
  .patch(editUser)
  .delete(deleteUser)

app.use("/api/v1/tours", toursRouter)
app.use("/api/v1/users", usersRouter)

app.listen(port, () => {
  console.log(`App running on port ${port}...`)
})
