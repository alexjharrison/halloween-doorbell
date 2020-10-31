import express from 'express'
import { Store } from '~/store'

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

const state: Store = {
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
