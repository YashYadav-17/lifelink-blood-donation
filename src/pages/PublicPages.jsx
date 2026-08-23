import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import {
	ArrowRight,
	ArrowUpRight,
	Building2,
	CheckCircle2,
	Clock3,
	Heart,
	HeartHandshake,
	MapPin,
	Search,
	ShieldCheck,
	Users,
	Wind
} from 'lucide-react'
import { groups, hospitals } from '../data/mockData'
import { getStore, updateBloodRequest } from '../utils/storage'
import { BloodBadge, EmptyState, SectionTitle, StatusBadge, useToast } from '../components/UI'
import { useAuth } from '../context/AuthContext'

const cityOptions = ['Mumbai', 'Pune', 'Delhi', 'Bengaluru']

const Select = ({ children, className = '', ...props }) => (
	<select className={`form-select ${className}`} {...props}>{children}</select>
)

const Filter = ({ q, setQ, blood, setBlood, city, setCity }) => (
	<div className="filter lifelink-filter card shadow-sm border-0">
		<Search size={18} />
		<input
			className="form-control"
			value={q}
			onChange={e => setQ(e.target.value)}
			placeholder="Search by name or location"
		/>
		<Select value={blood} onChange={e => setBlood(e.target.value)}>
			<option value="">All blood groups</option>
			{groups.map(x => <option key={x}>{x}</option>)}
		</Select>
		<Select value={city} onChange={e => setCity(e.target.value)}>
			<option value="">All locations</option>
			{cityOptions.map(x => <option key={x}>{x}</option>)}
		</Select>
	</div>
)

export function Home() {
	return (
		<>
			<section className="hero-wrap">
				<div className="hero-copy">
					<span className="eyebrow">LifeLink - Community blood network</span>
					<h1>One donation can <em>change</em> a life.</h1>
					<p>LifeLink helps patients find blood faster and makes it simple for everyday heroes to step forward.</p>
					<div className="hero-actions">
						<Link className="button" to="/find-blood">Find blood <ArrowRight size={18} /></Link>
						<Link className="button secondary" to="/donate">Become a donor</Link>
					</div>
					<div className="trust">
						<span><ShieldCheck /> Verified partner network</span>
						<span><Clock3 /> Emergency response support</span>
					</div>
				</div>
				<div className="hero-art">
					<div className="pulse-ring" />
					<div className="heart-orb"><Heart fill="currentColor" size={94} /></div>
					<div className="float-card donors"><Users /><b>2,840+</b><small>Registered donors</small></div>
					<div className="float-card match"><CheckCircle2 /><b>Live matching</b><small>Find compatible blood</small></div>
					<div className="blood-drop">O-</div>
				</div>
			</section>

			<section className="container-xl px-4 mb-5">
				<div id="homeHighlights" className="carousel slide lifelink-carousel" data-bs-ride="carousel">
					<div className="carousel-indicators">
						<button type="button" data-bs-target="#homeHighlights" data-bs-slide-to="0" className="active" aria-current="true" aria-label="Slide 1" />
						<button type="button" data-bs-target="#homeHighlights" data-bs-slide-to="1" aria-label="Slide 2" />
						<button type="button" data-bs-target="#homeHighlights" data-bs-slide-to="2" aria-label="Slide 3" />
					</div>
					<div className="carousel-inner rounded-4 shadow-sm">
						<div className="carousel-item active p-4 p-md-5 lifelink-carousel-item">
							<h3>Verified hospital network</h3>
							<p>Search hospitals and blood banks with transparent blood-group listings.</p>
							<Link to="/find-blood" className="btn btn-light btn-sm">Explore partners</Link>
						</div>
						<div className="carousel-item p-4 p-md-5 lifelink-carousel-item">
							<h3>Emergency coordination support</h3>
							<p>Track emergency requests and respond quickly through guided updates.</p>
							<Link to="/emergency" className="btn btn-light btn-sm">View emergency board</Link>
						</div>
						<div className="carousel-item p-4 p-md-5 lifelink-carousel-item">
							<h3>Community donor participation</h3>
							<p>Register donor details with clear, student-project friendly workflows.</p>
							<Link to="/donate" className="btn btn-light btn-sm">Become a donor</Link>
						</div>
					</div>
					<button className="carousel-control-prev" type="button" data-bs-target="#homeHighlights" data-bs-slide="prev">
						<span className="carousel-control-prev-icon" aria-hidden="true" />
						<span className="visually-hidden">Previous</span>
					</button>
					<button className="carousel-control-next" type="button" data-bs-target="#homeHighlights" data-bs-slide="next">
						<span className="carousel-control-next-icon" aria-hidden="true" />
						<span className="visually-hidden">Next</span>
					</button>
				</div>
			</section>

			<section className="stats">
				<div><b>2,840+</b><span>Registered donors</span></div>
				<div><b>1,240+</b><span>Successful donations</span></div>
				<div><b>426</b><span>Emergency requests fulfilled</span></div>
				<div><b>18</b><span>Partner organizations</span></div>
				<small>Sample demonstration statistics</small>
			</section>

			<section className="section">
				<SectionTitle
					eyebrow="How it works"
					title="A clearer route from need to care."
					text="LifeLink brings everyone involved in a donation together in three simple steps."
				/>
				<div className="steps">
					<article className="card shadow-sm border-0">
						<div className="card-body">
							<span>01</span>
							<Search />
							<h3>Find a match</h3>
							<p>Search verified hospitals and blood banks by group and location.</p>
						</div>
					</article>
					<article className="card shadow-sm border-0">
						<div className="card-body">
							<span>02</span>
							<HeartHandshake />
							<h3>Connect safely</h3>
							<p>Share a request or register as a donor through guided forms.</p>
						</div>
					</article>
					<article className="card shadow-sm border-0">
						<div className="card-body">
							<span>03</span>
							<CheckCircle2 />
							<h3>Make an impact</h3>
							<p>Coordinate with care teams and help make a real difference.</p>
						</div>
					</article>
				</div>
			</section>

			<section className="soft-section">
				<SectionTitle eyebrow="Every type matters" title="Blood groups, at a glance" />
				<div className="blood-grid">
					{groups.map(g => (
						<div key={g}>
							<BloodBadge value={g} />
							<span>Compatible network</span>
						</div>
					))}
				</div>
			</section>

			<section className="section impact">
				<div>
					<span className="eyebrow">SDG impact</span>
					<h2>Building healthier, more connected communities.</h2>
					<p>
						LifeLink supports awareness around SDG 3 (Good Health), SDG 10 (Reduced Inequalities),
						SDG 11 (Sustainable Cities), and SDG 17 (Partnerships).
					</p>
					<Link to="/about" className="text-cta">Explore our awareness hub <ArrowRight size={17} /></Link>
				</div>
				<div className="impact-list card shadow-sm border-0 p-3">
					<p><b>SDG 3</b> Good Health and Well-being</p>
					<p><b>SDG 10</b> Reduced Inequalities</p>
					<p><b>SDG 11</b> Sustainable Cities and Communities</p>
					<p><b>SDG 17</b> Partnerships for the Goals</p>
				</div>
			</section>
		</>
	)
}

export function FindBlood() {
	const [q, setQ] = useState('')
	const [blood, setBlood] = useState('')
	const [city, setCity] = useState('')
	const [type, setType] = useState('')
	const [sort, setSort] = useState('')

	const result = useMemo(
		() => hospitals
			.filter(h =>
				(!q || `${h.name}${h.city}`.toLowerCase().includes(q.toLowerCase())) &&
				(!blood || h.groups.includes(blood)) &&
				(!city || h.city === city) &&
				(!type || h.type === type)
			)
			.sort((a, b) => (sort === 'units' ? b.units - a.units : a.name.localeCompare(b.name))),
		[q, blood, city, type, sort]
	)

	return (
		<PageHeader title="Find blood, without the uncertainty." text="Browse our sample directory of verified partner hospitals and blood banks.">
			<Filter {...{ q, setQ, blood, setBlood, city, setCity }} />
			<div className="filter-inline">
				<Select value={type} onChange={e => setType(e.target.value)}>
					<option value="">All organization types</option>
					<option>Hospital</option>
					<option>Blood Bank</option>
				</Select>
				<Select value={sort} onChange={e => setSort(e.target.value)}>
					<option value="">Sort: A-Z</option>
					<option value="units">Most units available</option>
				</Select>
			</div>
			<p className="results-count">{result.length} verified partners found</p>
			<div className="cards">
				{result.map(h => <HospitalCard key={h.id} h={h} selectedBlood={blood} />)}
				{!result.length && <EmptyState title="No matching partners" />}
			</div>
		</PageHeader>
	)
}

export function HospitalCard({ h, selectedBlood = '' }) {
	const query = `hospital=${encodeURIComponent(h.name)}&city=${encodeURIComponent(h.city)}${selectedBlood ? `&blood=${selectedBlood}` : ''}`

	return (
		<article className="directory-card card shadow-sm border-0">
			<div className="card-body">
				<div className="card-icon"><Building2 /></div>
				<div className="card-top">
					<div>
						<h3>{h.name}</h3>
						<p><MapPin size={15} />{h.city} - {h.type}</p>
					</div>
					<StatusBadge value="Verified" />
				</div>
				<div className="group-row">{h.groups.map(g => <BloodBadge key={g} value={g} />)}</div>
				<div className="card-meta"><span><b>{h.units}</b> units available</span><span>Updated today</span></div>
				<Link className="button outline" to={`/request-blood?${query}`}>Request blood <ArrowUpRight size={16} /></Link>
			</div>
		</article>
	)
}

export function DonorDirectory() {
	const [q, setQ] = useState('')
	const [blood, setBlood] = useState('')
	const [city, setCity] = useState('')
	const [available, setAvailable] = useState('')
	const [data, setData] = useState([])
	const [selectedDonor, setSelectedDonor] = useState(null)
	const [searchParams, setSearchParams] = useSearchParams()
	const navigate = useNavigate()
	const toast = useToast()
	const { isAuthenticated, user } = useAuth()

	useEffect(() => {
		const load = () => setData(getStore('donors'))
		load()
		addEventListener('lifelink-update', load)
		return () => removeEventListener('lifelink-update', load)
	}, [])

	useEffect(() => {
		const donorId = searchParams.get('contact')
		if (!donorId || !isAuthenticated) return
		const target = data.find(d => d.id === donorId)
		if (target) {
			setSelectedDonor(target)
			const next = new URLSearchParams(searchParams)
			next.delete('contact')
			setSearchParams(next, { replace: true })
		}
	}, [searchParams, isAuthenticated, data, setSearchParams])

	const list = data.filter(
		d =>
			(!q || `${d.name}${d.city}`.toLowerCase().includes(q.toLowerCase())) &&
			(!blood || d.blood === blood) &&
			(!city || d.city === city) &&
			(!available || (available === 'yes') === d.available)
	)

	function requestContact(donor) {
		if (!isAuthenticated || !user) {
			toast({ type: 'warning', text: 'Please log in to request donor contact.' })
			navigate('/login', {
				replace: false,
				state: { from: '/donors', contactDonorId: donor.id, message: 'Login required to request donor contact.' }
			})
			return
		}
		setSelectedDonor(donor)
	}

	function confirmContactRequest() {
		if (!selectedDonor || !user) return
		const key = 'lifelink_contact_requests'
		const existing = JSON.parse(localStorage.getItem(key) || '[]')
		const item = {
			id: `CNT-${Date.now().toString().slice(-7)}`,
			donorId: selectedDonor.id,
			donorName: selectedDonor.name,
			requesterId: user.id,
			requesterName: user.name,
			requesterEmail: user.email,
			createdAt: new Date().toISOString(),
			status: 'Pending Contact'
		}
		localStorage.setItem(key, JSON.stringify([item, ...existing]))
		toast({ text: `Contact request sent for ${selectedDonor.name}.` })
		setSelectedDonor(null)
	}

	return (
		<PageHeader title="Find a local donor" text="Connect with sample donor profiles while keeping sensitive information protected.">
			<Filter {...{ q, setQ, blood, setBlood, city, setCity }} />
			<div className="filter-inline">
				<Select value={available} onChange={e => setAvailable(e.target.value)}>
					<option value="">Any availability</option>
					<option value="yes">Available now</option>
					<option value="no">Not available</option>
				</Select>
			</div>
			<div className="cards donor-cards">
				{list.map(d => (
					<article className="directory-card donor card shadow-sm border-0" key={d.id}>
						<div className="card-body">
							<div className="avatar">{d.name.split(' ').map(x => x[0]).join('')}</div>
							<div className="card-top">
								<div>
									<h3>{d.name}</h3>
									<p><MapPin size={15} />{d.city} - Donor ID {d.id}</p>
								</div>
								<BloodBadge value={d.blood} />
							</div>
							<div className="card-meta"><span>{d.donations} donations</span><span>Last: {d.lastDonation}</span></div>
							<StatusBadge value={d.available ? 'Available' : 'Unavailable'} />
							<button className="button outline" onClick={() => requestContact(d)}>Request contact</button>
						</div>
					</article>
				))}
				{!list.length && <EmptyState title="No donors found" />}
			</div>

			{selectedDonor && (
				<>
					<div className="modal fade show d-block" tabIndex="-1" role="dialog" aria-modal="true">
						<div className="modal-dialog modal-dialog-centered">
							<div className="modal-content border-0 shadow">
								<div className="modal-header">
									<h5 className="modal-title">Confirm contact request</h5>
									<button type="button" className="btn-close" aria-label="Close" onClick={() => setSelectedDonor(null)} />
								</div>
								<div className="modal-body">
									<p className="mb-1">Send a contact request to <b>{selectedDonor.name}</b>?</p>
									<p className="text-muted mb-0">This request will be saved in your local demo data.</p>
								</div>
								<div className="modal-footer">
									<button type="button" className="btn btn-outline-secondary" onClick={() => setSelectedDonor(null)}>Cancel</button>
									<button type="button" className="btn btn-danger" onClick={confirmContactRequest}>Send request</button>
								</div>
							</div>
						</div>
					</div>
					<div className="modal-backdrop fade show" onClick={() => setSelectedDonor(null)} />
				</>
			)}
		</PageHeader>
	)
}

export function Hospitals() {
	return (
		<PageHeader title="Trusted care partners" text="Hospitals and blood banks supporting the LifeLink community.">
			<div className="cards">{hospitals.map(h => <HospitalCard key={h.id} h={h} />)}</div>
		</PageHeader>
	)
}

export function Emergency() {
	const [data, setData] = useState(() => getStore('requests').filter(x => x.urgency === 'Emergency'))
	const toast = useToast()

	useEffect(() => {
		const load = () => setData(getStore('requests').filter(x => x.urgency === 'Emergency'))
		addEventListener('lifelink-update', load)
		return () => removeEventListener('lifelink-update', load)
	}, [])

	function respond(id) {
		updateBloodRequest(id, { status: 'Matching' })
		toast({ text: 'Response recorded successfully. Status changed to matching.' })
	}

	return (
		<PageHeader title="Emergency requests" text="Urgent needs are highlighted here for prompt coordination.">
			<div className="emergency-note"><Wind /> In a medical emergency, contact local emergency services and the treating hospital directly.</div>
			<div className="request-list">
				{data.map(r => (
					<article className="request-card emergency-card" key={r.id}>
						<BloodBadge value={r.blood} />
						<div>
							<StatusBadge value={r.urgency} />
							<h3>{r.units} unit{r.units > 1 ? 's' : ''} needed at {r.hospital}</h3>
							<p><MapPin size={15} />{r.city} - {r.id} - Posted {r.posted}</p>
						</div>
						<button className="button" disabled={r.status === 'Matching' || r.status === 'Fulfilled'} onClick={() => respond(r.id)}>
							{r.status === 'Matching' ? 'Matching in progress' : r.status === 'Fulfilled' ? 'Fulfilled' : 'Respond'}
						</button>
					</article>
				))}
				{!data.length && <EmptyState title="No active emergency requests" />}
			</div>
		</PageHeader>
	)
}

export function About() {
	return (
		<PageHeader title="Donation awareness, built on care." text="Clear, general information for a safer and more informed donor community.">
			<div className="info-grid">
				<article className="card shadow-sm border-0"><div className="card-body"><Heart /><h3>Why it matters</h3><p>Blood components are used in many types of medical care. Voluntary donations can help hospitals maintain supplies.</p></div></article>
				<article className="card shadow-sm border-0"><div className="card-body"><ShieldCheck /><h3>Safety first</h3><p>Eligibility and suitability must always be assessed by qualified healthcare professionals at the donation site.</p></div></article>
				<article className="card shadow-sm border-0"><div className="card-body"><HeartHandshake /><h3>What to expect</h3><p>Donation centres guide you through registration, screening, donation and post-donation advice.</p></div></article>
			</div>

			<section className="faq">
				<SectionTitle eyebrow="Common questions" title="Helpful answers" />
				<div className="accordion" id="aboutFaq">
					<div className="accordion-item">
						<h2 className="accordion-header">
							<button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#faqOne" aria-expanded="true" aria-controls="faqOne">
								Who can donate blood?
							</button>
						</h2>
						<div id="faqOne" className="accordion-collapse collapse show" data-bs-parent="#aboutFaq">
							<div className="accordion-body">
								Requirements vary by country and centre. Speak with qualified staff to determine your individual eligibility.
							</div>
						</div>
					</div>
					<div className="accordion-item">
						<h2 className="accordion-header">
							<button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#faqTwo" aria-expanded="false" aria-controls="faqTwo">
								Is LifeLink a medical service?
							</button>
						</h2>
						<div id="faqTwo" className="accordion-collapse collapse" data-bs-parent="#aboutFaq">
							<div className="accordion-body">
								No. LifeLink is a frontend educational demonstration. For medical advice or emergencies, consult a healthcare professional.
							</div>
						</div>
					</div>
					<div className="accordion-item">
						<h2 className="accordion-header">
							<button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#faqThree" aria-expanded="false" aria-controls="faqThree">
								How are organizations verified?
							</button>
						</h2>
						<div id="faqThree" className="accordion-collapse collapse" data-bs-parent="#aboutFaq">
							<div className="accordion-body">
								This demo displays sample verification labels. A real service would use documented onboarding and review processes.
							</div>
						</div>
					</div>
				</div>
			</section>
		</PageHeader>
	)
}

function PageHeader({ title, text, children }) {
	return (
		<section className="page">
			<header className="page-heading">
				<span className="eyebrow">LifeLink directory</span>
				<h1>{title}</h1>
				<p>{text}</p>
			</header>
			{children}
		</section>
	)
}
