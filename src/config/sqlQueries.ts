import { ParameterizedQuery as PQ } from 'pg-promise'

//TODO move queries to repository structure
export const userIdExists = new PQ('SELECT user_id FROM users WHERE user_id = $1')
export const eventIdExists = new PQ('SELECT event_id FROM events WHERE event_id = $1')
export const teamIdExists = new PQ('SELECT team_id FROM teams WHERE team_id = $1')
export const insertBettingSlip = new PQ('INSERT INTO betting_slips(user_id,event_id, winning_team_id,amount) VALUES ($1, $2, $3, $4) RETURNING betting_slip_id')
export const getBettingSlipByIdAndUserId = new PQ('SELECT * FROM betting_slips WHERE betting_slip_id = $1 AND user_id = $2')
export const getAllBettingSlipsByUserId = new PQ('SELECT * FROM betting_slips WHERE user_id = $1')
export const updateBettingSlipAmountByIdAndUserId = new PQ('UPDATE betting_slips SET amount = $1 WHERE betting_slip_id = $2 AND user_id = $3')
export const deleteBettingSlipByIdAndUserId = new PQ('DELETE FROM betting_slips WHERE betting_slip_id = $1 AND user_id = $2')
export const createEvent = new PQ('INSERT INTO events (event_name, event_date, winning_team_id) VALUES ($1, $2, $3) RETURNING event_id')
export const deleteEventById = new PQ('DELETE FROM events WHERE event_id = $1')
export const createNewTeam = new PQ('INSERT INTO teams(team_name) VALUES ($1) RETURNING team_id')
export const deleteTeamByID = new PQ('DELETE FROM teams WHERE team_id = $1')