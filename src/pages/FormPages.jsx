import { cloneElement, useState } from 'react'
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import { BadgeCheck, CalendarDays, HeartPulse, Info, Mail, Phone, UserRound } from 'lucide-react'
import { groups, hospitals } from '../data/mockData'
import { addBloodRequest, addDonor, makeId, startAdminSession } from '../utils/storage'
import { BloodBadge, useToast } from '../components/UI'
import { useAuth } from '../context/AuthContext'

const blankRequest = {
  patient: '',
  blood: '',
  units: '',
  hospital: '',
  city: '',
  date: '',
  urgency: 'Normal',
  phone: '',
  notes: ''
}

const blankDonor = {
  name: '',
  age: '',
  gender: '',
  blood: '',
  city: '',
  phone: '',
  email: '',
  lastDonation: '',
  available: 'yes',
  contact: 'Phone'
}

function errorsFor(form, required) {
  const errors = {}
  required.forEach(key => {
    if (!String(form[key] || '').trim()) errors[key] = 'This field is required'
  })
  if (form.age && Number(form.age) < 18) errors.age = 'Please enter an age of 18 or above'
  if (form.phone && !/^\+?[0-9\s-]{8,16}$/.test(form.phone)) errors.phone = 'Enter a valid phone number'
  if (form.units && Number(form.units) < 1) errors.units = 'At least one unit is required'
  return errors
}

function Field({ label, error, children, col = 'col-md-6' }) {
  const child = cloneElement(children, {
    className: `${children.props.className || ''} ${children.type === 'select' ? 'form-select' : 'form-control'}${error ? ' is-invalid' : ''}`.trim()
  })

  return (
    <div className={`${col} field`}>
      <label className="form-label mb-1">{label}</label>
      {child}
      {error && <div className="invalid-feedback d-block">{error}</div>}
    </div>
  )
}

function Success({ title, children }) {
  return <div className="success-screen"><BadgeCheck size={42} /><h2>{title}</h2>{children}</div>
}

export function RequestBlood() {
  const [params] = useSearchParams()
  const [form, setForm] = useState(() => ({
    ...blankRequest,
    hospital: params.get('hospital') || '',
    blood: params.get('blood') || '',
    city: params.get('city') || ''
  }))
  const [errors, setErrors] = useState({})
  const [created, setCreated] = useState(null)
  const toast = useToast()

  const change = e => setForm({ ...form, [e.target.name]: e.target.value })

  function submit(e) {
    e.preventDefault()
    const x = errorsFor(form, ['patient', 'blood', 'units', 'hospital', 'city', 'date', 'phone'])
    setErrors(x)
    if (Object.keys(x).length) return
    const item = { ...form, id: makeId('REQ'), status: 'Pending', posted: 'Just now', createdAt: new Date().toISOString() }
    addBloodRequest(item)
    setCreated(item)
    setForm(blankRequest)
    toast({ text: 'Blood request submitted successfully.' })
  }

  if (created) {
    return (
      <FormPage eyebrow="Request submitted" title="Your request is now in the network.">
        <Success title="Blood request submitted successfully.">
          <p>Request ID: <b>{created.id}</b></p>
          <div className="success-details"><BloodBadge value={created.blood} /><span>{created.units} unit(s)</span><span>{created.urgency}</span></div>
          <div className="success-actions">
            <Link className="btn btn-danger" to={`/requests?highlight=${created.id}`}>View request</Link>
            <Link className="btn btn-outline-danger" to="/dashboard">Go to dashboard</Link>
            <Link className="text-cta" to="/">Back to home</Link>
          </div>
        </Success>
      </FormPage>
    )
  }

  return (
    <FormPage eyebrow="For patients and care teams" title="Request blood with clarity." text="Share the essential details so partner organizations can respond faster.">
      <form onSubmit={submit} className="needs-validation" noValidate>
        <div className="row g-3">
          <Field label="Patient name" error={errors.patient}><input required name="patient" value={form.patient} onChange={change} /></Field>
          <Field label="Blood group" error={errors.blood}>
            <select required name="blood" value={form.blood} onChange={change}>
              <option value="">Select group</option>
              {groups.map(g => <option key={g}>{g}</option>)}
            </select>
          </Field>
          <Field label="Units required" error={errors.units}><input required type="number" min="1" name="units" value={form.units} onChange={change} /></Field>
          <Field label="Required date" error={errors.date}><input required type="date" name="date" value={form.date} onChange={change} /></Field>
          <Field label="Hospital" error={errors.hospital}>
            <select required name="hospital" value={form.hospital} onChange={change}>
              <option value="">Select hospital</option>
              {hospitals.map(h => <option key={h.id}>{h.name}</option>)}
            </select>
          </Field>
          <Field label="City / location" error={errors.city}><input required name="city" value={form.city} onChange={change} /></Field>
          <Field label="Urgency">
            <select name="urgency" value={form.urgency} onChange={change}>
              <option>Normal</option><option>Urgent</option><option>Emergency</option>
            </select>
          </Field>
          <Field label="Contact number" error={errors.phone}><input required type="tel" name="phone" value={form.phone} onChange={change} placeholder="+91 ..." /></Field>
          <Field label="Additional information" col="col-12">
            <textarea name="notes" value={form.notes} onChange={change} placeholder="Optional details for the care team" rows="3" />
          </Field>
        </div>

        <div className="form-actions mt-3">
          <button className="btn btn-danger" type="submit">Submit blood request</button>
          <span>By submitting, you confirm the details are accurate.</span>
        </div>
      </form>
    </FormPage>
  )
}

export function BecomeDonor() {
  const [form, setForm] = useState(blankDonor)
  const [errors, setErrors] = useState({})
  const [created, setCreated] = useState(null)
  const toast = useToast()

  const change = e => setForm({ ...form, [e.target.name]: e.target.value })

  function submit(e) {
    e.preventDefault()
    const x = errorsFor(form, ['name', 'age', 'gender', 'blood', 'city', 'phone', 'email'])
    setErrors(x)
    if (Object.keys(x).length) return
    const item = {
      id: makeId('DON'),
      name: form.name,
      blood: form.blood,
      city: form.city,
      phone: form.phone,
      email: form.email,
      available: form.available === 'yes',
      lastDonation: form.lastDonation || 'Not recorded',
      donations: 0
    }
    addDonor(item)
    setCreated(item)
    setForm(blankDonor)
    toast({ text: 'Donor profile created successfully.' })
  }

  if (created) {
    return (
      <FormPage eyebrow="Welcome to LifeLink" title="A meaningful step forward.">
        <Success title="Donor profile created successfully.">
          <p>Reference ID: <b>{created.id}</b></p>
          <div className="success-details">
            <BloodBadge value={created.blood} />
            <span>{created.city}</span>
            <span>{created.available ? 'Available to be contacted' : 'Not currently available'}</span>
          </div>
          <div className="success-actions">
            <Link className="btn btn-danger" to="/donors">View donor directory</Link>
            <Link className="btn btn-outline-danger" to="/">Return home</Link>
          </div>
        </Success>
      </FormPage>
    )
  }

  return (
    <FormPage eyebrow="Join the community" title="Register as a donor." text="Your availability can help a patient's care team find the right match.">
      <aside className="medical-note alert alert-light border mb-3">
        <Info />
        <div>
          <b>A note on eligibility</b>
          <p className="mb-0">Actual donation eligibility must always be determined by qualified medical professionals. This registration is a demonstration record only.</p>
        </div>
      </aside>

      <form onSubmit={submit} className="needs-validation" noValidate>
        <div className="row g-3">
          <Field label="Full name" error={errors.name}><input required name="name" value={form.name} onChange={change} /></Field>
          <Field label="Age" error={errors.age}><input required type="number" min="18" name="age" value={form.age} onChange={change} /></Field>
          <Field label="Gender" error={errors.gender}>
            <select required name="gender" value={form.gender} onChange={change}>
              <option value="">Select</option>
              <option>Female</option><option>Male</option><option>Non-binary</option><option>Prefer not to say</option>
            </select>
          </Field>
          <Field label="Blood group" error={errors.blood}>
            <select required name="blood" value={form.blood} onChange={change}>
              <option value="">Select group</option>
              {groups.map(g => <option key={g}>{g}</option>)}
            </select>
          </Field>
          <Field label="City" error={errors.city}><input required name="city" value={form.city} onChange={change} /></Field>
          <Field label="Phone" error={errors.phone}><input required name="phone" value={form.phone} onChange={change} /></Field>
          <Field label="Email" error={errors.email}><input required type="email" name="email" value={form.email} onChange={change} /></Field>
          <Field label="Last donation date"><input type="date" name="lastDonation" value={form.lastDonation} onChange={change} /></Field>
          <Field label="Availability">
            <select name="available" value={form.available} onChange={change}>
              <option value="yes">Available to be contacted</option>
              <option value="no">Not currently available</option>
            </select>
          </Field>
          <Field label="Preferred contact method">
            <select name="contact" value={form.contact} onChange={change}><option>Phone</option><option>Email</option></select>
          </Field>
        </div>

        <div className="form-actions mt-3"><button className="btn btn-danger" type="submit">Create donor profile</button></div>
      </form>
    </FormPage>
  )
}

export function Login() {
  const [mode, setMode] = useState('login')
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', confirmPassword: '' })
  const [error, setError] = useState('')
  const navigate = useNavigate()
  const location = useLocation()
  const toast = useToast()
  const { login, register } = useAuth()

  const change = e => setForm({ ...form, [e.target.name]: e.target.value })

  function afterLogin() {
    const from = location.state?.from || '/profile'
    const contactDonorId = location.state?.contactDonorId
    if (from === '/donors' && contactDonorId) {
      navigate(`/donors?contact=${encodeURIComponent(contactDonorId)}`, { replace: true })
      return
    }
    navigate(from, { replace: true })
  }

  function submit(e) {
    e.preventDefault()
    setError('')

    if (mode === 'register') {
      if (!form.name.trim() || !form.email.trim() || !form.password.trim()) {
        setError('Please fill in all required fields.')
        return
      }
      if (form.password !== form.confirmPassword) {
        setError('Passwords do not match.')
        return
      }
      const created = register({ name: form.name, email: form.email, phone: form.phone, password: form.password })
      if (!created.ok) {
        setError(created.error || 'Registration failed.')
        return
      }
      toast({ text: 'Account created successfully.' })
      afterLogin()
      return
    }

    if (form.email.toLowerCase() === 'admin@lifelink.demo') {
      setError('Use the dedicated Admin Login page for administrator access.')
      return
    }

    const result = login(form.email, form.password)
    if (!result.ok || result.user?.role === 'admin') {
      setError(result.user?.role === 'admin' ? 'Use Admin Login for administrator access.' : 'Invalid email or password.')
      return
    }
    toast({ text: 'Login successful.' })
    afterLogin()
  }

  return (
    <section className="auth-page">
      <div className="auth-art">
        <HeartPulse size={56} />
        <span className="eyebrow">LifeLink User Access</span>
        <h1>Welcome back to the donor network.</h1>
        <p>Sign in to request donor contact, manage your profile, and continue your LifeLink actions securely.</p>
      </div>

      <form className="auth-card card shadow-sm border-0" onSubmit={submit} noValidate>
        <div className="card-body">
          <div className="d-flex gap-2 mb-3">
            <button type="button" className={`btn ${mode === 'login' ? 'btn-danger' : 'btn-outline-danger'} btn-sm`} onClick={() => { setMode('login'); setError('') }}>User Login</button>
            <button type="button" className={`btn ${mode === 'register' ? 'btn-danger' : 'btn-outline-danger'} btn-sm`} onClick={() => { setMode('register'); setError('') }}>Register</button>
          </div>

          <h2 className="h4 mb-2">{mode === 'login' ? 'User Login' : 'Create User Account'}</h2>
          <p className="text-muted">{location.state?.message || 'Use your normal user account details to continue.'}</p>

          {error && <div className="alert alert-danger py-2">{error}</div>}

          {mode === 'register' && (
            <div className="mb-3">
              <label className="form-label">Full name</label>
              <input className="form-control" name="name" value={form.name} onChange={change} />
            </div>
          )}

          <div className="mb-3">
            <label className="form-label">Email</label>
            <div className="input-group">
              <span className="input-group-text"><Mail size={16} /></span>
              <input className="form-control" type="email" name="email" value={form.email} onChange={change} required />
            </div>
          </div>

          {mode === 'register' && (
            <div className="mb-3">
              <label className="form-label">Phone (optional)</label>
              <div className="input-group">
                <span className="input-group-text"><Phone size={16} /></span>
                <input className="form-control" type="tel" name="phone" value={form.phone} onChange={change} />
              </div>
            </div>
          )}

          <div className="mb-3">
            <label className="form-label">Password</label>
            <input className="form-control" type="password" name="password" value={form.password} onChange={change} required />
          </div>

          {mode === 'register' && (
            <div className="mb-3">
              <label className="form-label">Confirm password</label>
              <input className="form-control" type="password" name="confirmPassword" value={form.confirmPassword} onChange={change} required />
            </div>
          )}

          <button className="btn btn-danger w-100" type="submit">{mode === 'login' ? 'Sign in' : 'Create account'}</button>
          <p className="demo-note mt-3 mb-0">Administrator access is available only through the separate admin login page.</p>
          <Link className="btn btn-link p-0 mt-1" to="/admin-login">Go to Admin Login</Link>
        </div>
      </form>
    </section>
  )
}

export function AdminLogin() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()
  const location = useLocation()
  const toast = useToast()

  function go(e) {
    e.preventDefault()
    if (username !== 'admin' || password !== 'admin123') {
      setError('Invalid administrator credentials.')
      return
    }
    startAdminSession()
    toast({ text: 'Administrator session started.' })
    navigate(location.state?.from || '/dashboard', { replace: true })
  }

  return (
    <section className="auth-page">
      <div className="auth-art">
        <HeartPulse size={56} />
        <span className="eyebrow">LifeLink Administration</span>
        <h1>Administrator Access</h1>
        <p>This area is for authorized administration tasks and protected dashboards.</p>
      </div>

      <form className="auth-card card shadow-sm border-0" onSubmit={go} noValidate>
        <div className="card-body">
          <h2 className="h4">Admin Login</h2>
          <p className="text-muted">Sign in to access protected administrative tools.</p>

          <div className="mb-3">
            <label className="form-label">Administrator username</label>
            <input className="form-control" required value={username} onChange={e => setUsername(e.target.value)} />
          </div>

          <div className="mb-3">
            <label className="form-label">Administrator password</label>
            <input
              className={`form-control${error ? ' is-invalid' : ''}`}
              required
              type="password"
              value={password}
              onChange={e => { setPassword(e.target.value); setError('') }}
            />
            {error && <div className="invalid-feedback d-block">{error}</div>}
          </div>

          <button className="btn btn-danger w-100" type="submit">Sign in as administrator</button>
          <Link className="btn btn-link p-0 mt-2" to="/login">Back to User Login</Link>
        </div>
      </form>
    </section>
  )
}

export function Profile() {
  const { user } = useAuth()
  const fallback = JSON.parse(localStorage.getItem('lifelink_user') || '{"name":"Demo Donor","role":"Donor"}')
  const profile = user || fallback

  return (
    <section className="page profile">
      <header className="page-heading">
        <span className="eyebrow">My profile</span>
        <h1>Welcome, {profile.name}.</h1>
        <p>Manage your demo availability and view your LifeLink activity.</p>
      </header>

      <div className="profile-grid">
        <article className="profile-card card shadow-sm border-0">
          <div className="card-body text-center">
            <div className="profile-avatar mx-auto"><UserRound size={34} /></div>
            <h2>{profile.name}</h2>
            <p>{profile.role || 'User'} profile</p>
            <BloodBadge value="O+" />
            <button className="btn btn-outline-danger mt-3">Edit profile</button>
          </div>
        </article>

        <article className="activity-card card shadow-sm border-0">
          <div className="card-body">
            <h3>Profile overview</h3>
            <p><Phone /> Contact preference: Phone</p>
            <p><Mail /> {profile.email || 'demo@lifelink.app'}</p>
            <p><CalendarDays /> Last donation: 12 May 2026</p>
            <p><HeartPulse /> Availability: <span className="status available">Available</span></p>
          </div>
        </article>
      </div>
    </section>
  )
}

function FormPage({ eyebrow, title, text, children }) {
  return (
    <section className="form-page">
      <div className="form-intro">
        <span className="eyebrow">{eyebrow}</span>
        <h1>{title}</h1>
        {text && <p>{text}</p>}
        <div className="form-side-stat">
          <HeartPulse />
          <b>One Donation. Multiple Lives.</b>
          <small>Information entered in this demo is stored only in your browser.</small>
        </div>
      </div>

      <div className="form-card card shadow-sm border-0">
        <div className="card-body">{children}</div>
      </div>
    </section>
  )
}
