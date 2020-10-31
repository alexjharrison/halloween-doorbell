import express from 'express'

interface Store {
  isSomeoneThere: boolean
  volumeThreshold: number
}

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

const state = {
  isSomeoneThere: false,
  volumeThreshold: 100,
}

app.get('/', (_req, res) => {
  res.json(state)
})

app.post('/', (req, res) => {
  state.isSomeoneThere = req.body.isSomeoneThere
  state.volumeThreshold = req.body.volumeThreshold
  console.log({ state })
  res.send(state)
})

export const handler = app
export const path = '/api/'
