
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { supabase } from '../utils/supabaseClient'

export default function Home() {
  const [timer, setTimer] = useState(60)
  const [reward, setReward] = useState(0.00)
  const [claimed, setClaimed] = useState(false)
  const [user, setUser] = useState(null)
  const router = useRouter()

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) router.push('/login')
      else setUser(user)
    }
    fetchUser()
  }, [])

  useEffect(() => {
    if (timer > 0 && !claimed) {
      const interval = setInterval(() => {
        setTimer(prev => prev - 1)
        setReward(prev => parseFloat((prev + 0.02).toFixed(2)))
      }, 1000)
      return () => clearInterval(interval)
    }
  }, [timer, claimed])

  const claimNow = async () => {
    setClaimed(true)
    await saveResult(reward)
  }

  const holdTillEnd = async () => {
    setClaimed(true)
    await saveResult(reward)
  }

  const boost = () => {
    setTimer(prev => prev + 15)
  }

  const saveResult = async (amount) => {
    if (!user) return
    await supabase.from('plays').insert({
      user_id: user.id,
      amount: amount,
      claimed_at: new Date()
    })
    await supabase.from('profiles').update({
      xp: reward * 10,
      total_earned: reward
    }).eq('id', user.id)
  }

  return (
    <div className="game-container animated-bg">
      <h1>🔥 HOLD or FOLD 🔥</h1>
      <p className="reward-text">Reward is growing... {reward.toFixed(2)} USDT</p>
      <p className="timer">⏱️ {timer}s</p>
      <button onClick={claimNow}>Claim Now</button>
      <button onClick={holdTillEnd}>Hold Till End</button>
      <button onClick={boost}>🟢 BOOST</button>
      {claimed && <p>You earned: {reward.toFixed(2)} USDT</p>}
    </div>
  )
}
