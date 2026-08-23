import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
	Activity,
	BarChart3,
	Building2,
	ClipboardList,
	Droplets,
	HeartPulse,
	LayoutDashboard,
	LogOut,
	Menu,
	Settings,
	Users,
	X
} from 'lucide-react'
import { Cell, Line, LineChart, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { donationTrend, groups } from '../data/mockData'
import {
	endAdminSession,
	getActivities,
	getBloodRequests,
	getDonors,
	getInventory,
	updateInventory
} from '../utils/storage'
import { BloodBadge, StatusBadge, useToast } from '../components/UI'

const nav = [
	['/dashboard', LayoutDashboard, 'Dashboard'],
	['/requests', ClipboardList, 'Blood Requests'],
	['/admin/donors', Users, 'Donors'],
	['/admin/hospitals', Building2, 'Hospitals'],
	['/inventory', Droplets, 'Inventory'],
	['/emergency-admin', Activity, 'Emergency Requests'],
	['/dashboard#activity', Settings, 'Activity']
]

function Side() {
	const [open, setOpen] = useState(false)
	const navigate = useNavigate()

	function logout() {
		endAdminSession()
		navigate('/')
	}

	return (
		<>
			<button className="dash-menu" onClick={() => setOpen(!open)}>{open ? <X /> : <Menu />}</button>
			<aside className={`sidebar ${open ? 'shown' : ''}`}>
				<Link to="/dashboard" className="dash-logo"><HeartPulse /> Life<span>Link</span> Admin</Link>
				<p>LIFELINK ADMINISTRATION</p>
				{nav.map(([to, Icon, title]) => (
					<Link key={title} to={to}><Icon size={18} />{title}</Link>
				))}
				<button className="admin-logout" onClick={logout}><LogOut size={17} /> Logout</button>
				<div className="side-help"><HeartPulse /><b>Administrator</b><small>Demo admin session</small></div>
			</aside>
		</>
	)
}

function Layout({ title, children }) {
	return (
		<div className="dashboard">
			<Side />
			<div className="dash-main">
				<header className="dash-header">
					<div>
						<span className="eyebrow">LifeLink Administration</span>
						<h1>{title}</h1>
					</div>
					<div className="admin">
						<span>AD</span>
						<div><b>Administrator</b><small>Demo Admin</small></div>
					</div>
				</header>
				{children}
			</div>
		</div>
	)
}

const read = () => ({
	donors: getDonors(),
	requests: getBloodRequests(),
	inventory: getInventory(),
	activities: getActivities()
})

export function Dashboard() {
	const [data, setData] = useState(read)

	useEffect(() => {
		const load = () => setData(read())
		addEventListener('lifelink-update', load)
		return () => removeEventListener('lifelink-update', load)
	}, [])

	const total = data.inventory.reduce((a, x) => a + x.units, 0)
	const pending = data.requests.filter(x => ['Pending', 'Matching'].includes(x.status)).length
	const emergency = data.requests.filter(x => x.urgency === 'Emergency' && x.status !== 'Fulfilled').length
	const fulfilled = data.requests.filter(x => x.status === 'Fulfilled').length
	const dist = groups.map(g => ({ name: g, value: data.donors.filter(d => d.blood === g).length || 1 }))

	return (
		<Layout title="Good morning, Admin">
			<section className="metric-grid">
				<Metric icon={<Users />} label="Total donors" value={data.donors.length} change="Directory records" tone="primary" />
				<Metric icon={<HeartPulse />} label="Active donors" value={data.donors.filter(d => d.available).length} change="Ready to contact" tone="success" />
				<Metric icon={<ClipboardList />} label="Pending requests" value={pending} change="Needs attention" tone="warning" />
				<Metric icon={<Activity />} label="Emergency requests" value={emergency} change="Priority cases" tone="danger" />
				<Metric icon={<Droplets />} label="Total blood units" value={total} change="Across partner stock" tone="info" />
				<Metric icon={<BarChart3 />} label="Successful donations" value={fulfilled} change="Fulfilled requests" tone="secondary" />
			</section>

			<section className="admin-quick-actions d-flex flex-wrap gap-2 mb-4">
				<Link to="/requests" className="btn btn-danger btn-sm">Manage requests</Link>
				<Link to="/inventory" className="btn btn-outline-danger btn-sm">Update inventory</Link>
				<Link to="/admin/donors" className="btn btn-outline-secondary btn-sm">View donors</Link>
			</section>

			<section className="chart-grid">
				<article className="chart-card wide card shadow-sm border-0">
					<div className="card-body">
						<div className="chart-title">
							<div>
								<h3>Donations over time</h3>
								<p>Monthly donation activity</p>
							</div>
							<span className="badge text-bg-light">Demo trend</span>
						</div>
						<ResponsiveContainer width="100%" height={240}>
							<LineChart data={donationTrend}>
								<XAxis dataKey="m" />
								<YAxis />
								<Tooltip />
								<Line type="monotone" dataKey="v" stroke="#8d1c2f" strokeWidth={3} dot={{ r: 4 }} />
							</LineChart>
						</ResponsiveContainer>
					</div>
				</article>

				<article className="chart-card card shadow-sm border-0">
					<div className="card-body">
						<div className="chart-title">
							<div>
								<h3>Donor blood groups</h3>
								<p>Directory distribution</p>
							</div>
						</div>
						<ResponsiveContainer width="100%" height={210}>
							<PieChart>
								<Pie data={dist} dataKey="value" innerRadius={52} outerRadius={76} paddingAngle={3}>
									{dist.map((_, i) => (
										<Cell
											key={i}
											fill={['#8d1c2f', '#d55461', '#ef9aa2', '#203243', '#5c8c77', '#e6b45d', '#ad3343', '#85939e'][i]}
										/>
									))}
								</Pie>
								<Tooltip />
							</PieChart>
						</ResponsiveContainer>
					</div>
				</article>
			</section>

			<section className="dash-lists">
				<article className="table-card card shadow-sm border-0">
					<div className="card-body">
						<div className="chart-title">
							<div>
								<h3>Recent blood requests</h3>
								<p>Latest submitted requests</p>
							</div>
							<Link to="/requests" className="btn btn-outline-danger btn-sm">View all requests</Link>
						</div>
						<div className="table-wrap table-responsive">
							<table className="table table-hover align-middle mb-0">
								<thead>
									<tr>
										<th>Request</th>
										<th>Blood</th>
										<th>Hospital</th>
										<th>Urgency</th>
										<th>Status</th>
									</tr>
								</thead>
								<tbody>
									{data.requests.slice(0, 5).map(r => (
										<tr key={r.id}>
											<td><b>{r.patient}</b><small>{r.id}</small></td>
											<td><BloodBadge value={r.blood} /></td>
											<td>{r.hospital}</td>
											<td><StatusBadge value={r.urgency} /></td>
											<td><StatusBadge value={r.status} /></td>
										</tr>
									))}
								</tbody>
							</table>
						</div>
					</div>
				</article>

				<article className="alert-card card shadow-sm border-0" id="activity">
					<div className="card-body">
						<div className="alert-heading mb-3"><Activity /> <b>Recent activity</b></div>
						<div className="list-group list-group-flush mb-3">
							{data.activities.slice(0, 4).map(a => (
								<div className="list-group-item px-0" key={a.id}>
									<div className="alert-item">
										<Activity />
										<div><b>{a.text}</b><small>{new Date(a.createdAt).toLocaleString()}</small></div>
									</div>
								</div>
							))}
						</div>
						<Link to="/donors" className="btn btn-outline-secondary btn-sm">View all donors</Link>
					</div>
				</article>
			</section>
		</Layout>
	)
}

const Metric = ({ icon, label, value, change, tone }) => (
	<article className="metric card shadow-sm border-0">
		<div className="card-body">
			<div className="d-flex justify-content-between align-items-start mb-2">
				<div className="metric-icon">{icon}</div>
				<span className={`badge text-bg-${tone}`}>{label}</span>
			</div>
			<h2>{value}</h2>
			<small>{change}</small>
		</div>
	</article>
)

export function Inventory() {
	const [data, setData] = useState(() => getInventory())
	const toast = useToast()

	useEffect(() => {
		const load = () => setData(getInventory())
		addEventListener('lifelink-update', load)
		return () => removeEventListener('lifelink-update', load)
	}, [])

	function change(i, v) {
		updateInventory(i, v)
		toast({ text: 'Inventory updated successfully.' })
	}

	return (
		<Layout title="Blood inventory">
			<div className="inventory-intro card border-0 shadow-sm mb-3">
				<div className="card-body d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-2">
					<p className="mb-0">Update demo stock levels. Changes are saved in this browser and reflected in dashboard totals.</p>
					<StatusBadge value="Live demo data" />
				</div>
			</div>

			<section className="inventory-grid">
				{data.map((x, i) => {
					const status = x.units <= x.minimum * 0.6 ? 'Critical' : x.units < x.minimum ? 'Low Stock' : 'Available'
					const statusTone = status === 'Critical' ? 'danger' : status === 'Low Stock' ? 'warning' : 'success'

					return (
						<article className={`inventory-card card shadow-sm border-0 ${status.toLowerCase().replace(' ', '-')}`} key={x.blood}>
							<div className="card-body">
								<div className="d-flex justify-content-between align-items-center mb-2">
									<BloodBadge value={x.blood} />
									<span className={`badge text-bg-${statusTone}`}>{status}</span>
								</div>
								<h2>{x.units}<small> units</small></h2>
								<p>Minimum required: {x.minimum}</p>
								<div className="input-group">
									<span className="input-group-text">Units</span>
									<input
										aria-label={`Units for ${x.blood}`}
										className="form-control"
										type="number"
										min="0"
										value={x.units}
										onChange={e => change(i, e.target.value)}
									/>
								</div>
								<small className="d-block mt-2">Updated {x.updated}</small>
							</div>
						</article>
					)
				})}
			</section>
		</Layout>
	)
}
