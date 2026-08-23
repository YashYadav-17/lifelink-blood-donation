import { Link, NavLink } from 'react-router-dom'
import { HeartPulse } from 'lucide-react'

const links = [
	['/', 'Home'],
	['/find-blood', 'Find Blood'],
	['/donate', 'Donate'],
	['/request-blood', 'Request Blood'],
	['/hospitals', 'Hospitals'],
	['/about', 'About']
]

export function Logo() {
	return (
		<Link to="/" className="logo navbar-brand mb-0">
			<span>
				<HeartPulse size={22} />
			</span>
			Life
			<span>Link</span>
		</Link>
	)
}

export function Navbar() {
	return (
		<header className="navbar lifelink-navbar navbar-expand-lg bg-white border-bottom sticky-top">
			<div className="container-xl nav-inner">
				<Logo />
				<button
					className="navbar-toggler menu-btn"
					type="button"
					data-bs-toggle="collapse"
					data-bs-target="#lifelinkMainNav"
					aria-controls="lifelinkMainNav"
					aria-expanded="false"
					aria-label="Toggle navigation"
				>
					<span className="navbar-toggler-icon" />
				</button>

				<div className="collapse navbar-collapse" id="lifelinkMainNav">
					<nav className="navbar-nav me-auto mb-2 mb-lg-0">
						{links.map(([to, title]) => (
							<NavLink
								key={to}
								to={to}
								end={to === '/'}
								className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
							>
								{title}
							</NavLink>
						))}

						<li className="nav-item dropdown">
							<button
								className="nav-link dropdown-toggle btn btn-link"
								data-bs-toggle="dropdown"
								type="button"
								aria-expanded="false"
							>
								Explore
							</button>
							<ul className="dropdown-menu">
								<li><Link className="dropdown-item" to="/donors">Donor Directory</Link></li>
								<li><Link className="dropdown-item" to="/emergency">Emergency Requests</Link></li>
								<li><Link className="dropdown-item" to="/hospitals">Partner Hospitals</Link></li>
							</ul>
						</li>
					</nav>

					<div className="d-flex flex-column flex-lg-row align-items-lg-center gap-2 nav-actions">
						<Link to="/login" className="button outline small">Login</Link>
						<Link to="/admin-login" className="button outline small">Admin</Link>
						<Link to="/request-blood" className="button small">Request blood</Link>
					</div>
				</div>
			</div>
		</header>
	)
}

export function Footer() {
	return (
		<footer>
			<div className="footer-grid">
				<div>
					<Logo />
					<p>Connecting donors, patients, and care teams when every minute matters.</p>
				</div>
				<div>
					<b>Explore</b>
					<Link to="/find-blood">Find blood</Link>
					<Link to="/donors">Donor directory</Link>
					<Link to="/emergency">Emergency requests</Link>
				</div>
				<div>
					<b>LifeLink</b>
					<Link to="/about">Awareness and safety</Link>
					<Link to="/hospitals">Partner organizations</Link>
					<Link to="/donate">Become a donor</Link>
				</div>
				<div className="footer-call">
					<HeartPulse />
					<b>One Donation. Multiple Lives.</b>
					<p>Demo experience for awareness and education.</p>
				</div>
			</div>
			<div className="copyright">© 2026 LifeLink | Blood Donation Management System | Educational demo</div>
		</footer>
	)
}
