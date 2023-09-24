import { ParameterizedQuery as PQ } from 'pg-promise'


export const userIdExists = new PQ('SELECT user_id FROM users WHERE user_id = $1')
export const eventIdExists = new PQ('SELECT event_id FROM events WHERE event_id = $1')
export const teamIdExists = new PQ('SELECT team_id FROM teams WHERE team_id = $1')
export const insertBettingSlip = new PQ('INSERT INTO betting_slips(user_id,event_id, winning_team_id,amount) VALUES ($1, $2, $3, $4) RETURNING betting_slip_id')
export const getBettingSlipByIdAndUserId = new PQ('SELECT * FROM betting_slips WHERE betting_slip_id = $1 AND user_id = $2')
export const getAllBettingSlipsByUserId = new PQ('SELECT * FROM betting_slips WHERE user_id = $1')
export const updateBettingSlipAmountByIdAndUserId = new PQ('UPDATE betting_slips SET amount = $1 WHERE betting_slip_id = $2 AND user_id = $3')
export const deleteBettingSlipByIdAndUserId = new PQ('DELETE FROM betting_slips WHERE betting_slip_id = $1 AND user_id = $2')