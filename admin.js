
import { useEffect, useState } from 'react'
import { supabase } from '../utils/supabaseClient'

export default function Admin() {
  const [plays, setPlays] = useState([])

  useEffect(() => {
    const fetchData = async () => {
      const { data } = await supabase.from('plays').select('*').order('claimed_at', { ascending: false })
      setPlays(data)
    }
    fetchData()
  }, [])

  return (
    <div className="admin-panel">
      <h2>Admin Panel</h2>
      <table>
        <thead>
          <tr><th>User</th><th>Amount</th><th>Time</th></tr>
        </thead>
        <tbody>
          {plays.map((play, idx) => (
            <tr key={idx}>
              <td>{play.user_id}</td>
              <td>{play.amount}</td>
              <td>{new Date(play.claimed_at).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
