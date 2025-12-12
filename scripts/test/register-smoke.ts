import fetch from 'node-fetch'

async function run() {
  const api = process.env.API_BASE || 'https://api.ametsehub.com/api'
  const tag = Math.random().toString(36).slice(2,8)
  const stu = await fetch(api + '/auth/register', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ email:`student_${tag}@test.com`, password:'TestPass123!', role:'student' }) })
  const emp = await fetch(api + '/auth/register', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ email:`employer_${tag}@test.com`, password:'TestPass123!', role:'employer' }) })
  console.log('student', stu.status, 'employer', emp.status)
}

run().catch(err=>{ console.error(err); process.exit(1) })

