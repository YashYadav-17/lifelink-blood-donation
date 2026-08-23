import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Building2, MapPin } from 'lucide-react'
import { groups, hospitals } from '../data/mockData'
import { getBloodRequests, getDonors } from '../utils/storage'
import { BloodBadge, EmptyState, StatusBadge } from '../components/UI'

export function AdminShell({ title, children }) {
	return (
		<div className="dashboard admin-simple">
			<aside className="sidebar">
				<Link to="/dashboard" className="dash-logo">Life<span>Link</span> Admin</Link>
				<Link to="/dashboard">Dashboard</Link>
				<Link to="/requests">Blood Requests</Link>
				<Link to="/admin/donors">Donors</Link>
				<Link to="/admin/hospitals">Hospitals</Link>
				<Link to="/inventory">Inventory</Link>
				<Link to="/emergency-admin">Emergency</Link>
			</aside>

			<main className="dash-main">
				<header className="dash-header">
					<div>
						<span className="eyebrow">LifeLink Administration</span>
						<h1>{title}</h1>
					</div>
				</header>
				{children}
			</main>
		</div>
	)
}

export function AdminDonors() {
	const [data, setData] = useState(() => getDonors())
	const [q, setQ] = useState('')
	const [blood, setBlood] = useState('')

	useEffect(() => {
		const load = () => setData(getDonors())
		addEventListener('lifelink-update', load)
		return () => removeEventListener('lifelink-update', load)
	}, [])

	const list = useMemo(
		() => data.filter(d => (!q || `${d.name} ${d.city}`.toLowerCase().includes(q.toLowerCase())) && (!blood || d.blood === blood)),
		[data, q, blood]
	)

	return (
		<AdminShell title="Donor management">
			<div className="card border-0 shadow-sm mb-3">
				<div className="card-body">
					<div className="row g-2 align-items-end">
						<div className="col-md-8">
							<label className="form-label mb-1">Search by donor name or city</label>
							<input className="form-control" value={q} onChange={e => setQ(e.target.value)} placeholder="Search name or city" />
						</div>
						<div className="col-md-4">
							<label className="form-label mb-1">Blood group filter</label>
							<select className="form-select" value={blood} onChange={e => setBlood(e.target.value)}>
								<option value="">All blood groups</option>
								{groups.map(g => <option key={g}>{g}</option>)}
							</select>
						</div>
					</div>
				</div>
			</div>

			<div className="table-card card border-0 shadow-sm">
				<div className="card-body">
					<div className="table-wrap table-responsive">
						<table className="table table-hover align-middle mb-0">
							<thead>
								<tr>
									<th>Donor</th>
									<th>Blood</th>
									<th>City</th>
									<th>Availability</th>
									<th>Last donation</th>
									<th>Registered</th>
								</tr>
							</thead>
							<tbody>
								{list.map(d => (
									<tr key={d.id}>
										<td><b>{d.name}</b><small>{d.id}</small></td>
										<td><BloodBadge value={d.blood} /></td>
										<td>{d.city}</td>
										<td><StatusBadge value={d.available ? 'Available' : 'Unavailable'} /></td>
										<td>{d.lastDonation}</td>
										<td>{d.createdAt ? new Date(d.createdAt).toLocaleDateString() : 'Demo record'}</td>
									</tr>
								))}
							</tbody>
						</table>
						{!list.length && <EmptyState title="No matching donors" />}
					</div>
				</div>
			</div>
		</AdminShell>
	)
}

export function AdminHospitals() {
	return (
		<AdminShell title="Partner hospitals">
			<div className="cards">
				{hospitals.map(h => (
					<article className="directory-card card shadow-sm border-0" key={h.id}>
						<div className="card-body">
							<div className="card-top">
								<div>
									<h3>{h.name}</h3>
									<p><MapPin size={15} />{h.city} - {h.type}</p>
								</div>
								<span className="badge text-bg-success">Verified</span>
							</div>
							<div className="group-row">{h.groups.map(g => <BloodBadge key={g} value={g} />)}</div>
							<p className="mb-2">{h.units} available units - Sample partner data</p>
							<button type="button" className="btn btn-outline-danger btn-sm">Partner details</button>
						</div>
					</article>
				))}
			</div>
		</AdminShell>
	)
}

export function AdminEmergency() {
	const [data, setData] = useState(() => getBloodRequests().filter(r => r.urgency === 'Emergency'))

	useEffect(() => {
		const load = () => setData(getBloodRequests().filter(r => r.urgency === 'Emergency'))
		addEventListener('lifelink-update', load)
		return () => removeEventListener('lifelink-update', load)
	}, [])

	return (
		<AdminShell title="Emergency request management">
			<div className="table-card card border-0 shadow-sm">
				<div className="card-body">
					<div className="table-wrap table-responsive">
						<table className="table table-hover align-middle mb-0">
							<thead>
								<tr>
									<th>Request</th>
									<th>Blood</th>
									<th>Units</th>
									<th>Hospital</th>
									<th>Location</th>
									<th>Status</th>
								</tr>
							</thead>
							<tbody>
								{data.map(r => (
									<tr key={r.id}>
										<td>{r.id}</td>
										<td><BloodBadge value={r.blood} /></td>
										<td>{r.units}</td>
										<td>{r.hospital}</td>
										<td>{r.city}</td>
										<td><StatusBadge value={r.status} /></td>
									</tr>
								))}
							</tbody>
						</table>
						{!data.length && <EmptyState title="No emergency requests" />}
					</div>
				</div>
			</div>
		</AdminShell>
	)
}
