import pgPromise from 'pg-promise'
import { dbConfig } from '../config/config'

const pg = pgPromise()
export const db = pg(dbConfig)