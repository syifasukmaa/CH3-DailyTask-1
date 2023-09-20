const fs = require("fs")

const express = require("express")
const morgan = require("morgan")

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
    JSON.stringify(tours),
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
    JSON.stringify(tours),
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
    JSON.stringify(tours),
    (err) => {
      res.status(200).json({
        status: "success",
        message: `berhasil di delete`,
        data: null,
      })
    }
  )
}

//Routing
// app.get("/api/v1/tours", getAllTours)

// app.get("/api/v1/tours/:id", getTourById)

// app.post("/api/v1/tours", createTour)

// app.patch("/api/v1/tours/:id", editTour)

// app.delete("/api/v1/tours/:id", deleteTour)

app
  .route("/api/v1/tours")
  .get(getAllTours)
  .post(createTour)

app
  .route("/api/v1/tours/:id")
  .get(getTourById)
  .patch(editTour)
  .delete(deleteTour)

app.listen(port, () => {
  console.log(`App running on port ${port}...`)
})
