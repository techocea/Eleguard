import './Dashboard.css'

export default function Dashboard() {
  return (
    <section className="dashboard-section section">
      <div className="container">
        <div className="dashboard-grid">
          <div className="dashboard-content">
            <span className="dashboard-label">Stay Updated, Stay Protected</span>
            <h2 className="dashboard-title">Your Farm. In Your Hand.</h2>
            <p className="dashboard-description">
              Monitor sensor status, view alert history, and manage your fields from your dashboard.
            </p>
            <a href="/features" className="btn btn-primary">
              Explore Dashboard
              <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
                <path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z" />
              </svg>
            </a>
          </div>
          
          <div className="dashboard-preview">
            <div className="dashboard-mockup">
              {/* Dashboard Header */}
              <div className="mockup-header">
                <div className="mockup-logo">
                  <div className="mockup-logo-icon"></div>
                  <span>EleGuardLK</span>
                </div>
                <span className="mockup-title">Dashboard</span>
                <div className="mockup-user">
                  <div className="mockup-avatar">K</div>
                  <span>Kamal Perera</span>
                </div>
              </div>
              
              {/* Dashboard Content */}
              <div className="mockup-body">
                {/* Sidebar */}
                <div className="mockup-sidebar">
                  <div className="sidebar-item active">
                    <div className="sidebar-icon"></div>
                    <span>Dashboard</span>
                  </div>
                  <div className="sidebar-item">
                    <div className="sidebar-icon"></div>
                    <span>My Fields</span>
                  </div>
                  <div className="sidebar-item">
                    <div className="sidebar-icon"></div>
                    <span>Sensors</span>
                  </div>
                  <div className="sidebar-item">
                    <div className="sidebar-icon"></div>
                    <span>Alerts</span>
                  </div>
                  <div className="sidebar-item">
                    <div className="sidebar-icon"></div>
                    <span>Reports</span>
                  </div>
                  <div className="sidebar-item">
                    <div className="sidebar-icon"></div>
                    <span>Settings</span>
                  </div>
                </div>
                
                {/* Main Content */}
                <div className="mockup-main">
                  {/* Stats Row */}
                  <div className="mockup-stats">
                    <div className="stat-card">
                      <span className="stat-label">Total Fields</span>
                      <span className="stat-value">12</span>
                    </div>
                    <div className="stat-card">
                      <span className="stat-label">Active Sensors</span>
                      <span className="stat-value">28</span>
                    </div>
                    <div className="stat-card">
                      <span className="stat-label">Alerts Today</span>
                      <span className="stat-value">5</span>
                    </div>
                    <div className="stat-card">
                      <span className="stat-label">All Clear</span>
                      <span className="stat-value">23</span>
                    </div>
                  </div>
                  
                  {/* Alerts List */}
                  <div className="mockup-alerts">
                    <h4>Recent Alerts</h4>
                    <div className="alert-item">
                      <div className="alert-dot orange"></div>
                      <div className="alert-info">
                        <span>Walapane Field 02</span>
                        <small>Elephant Detected</small>
                      </div>
                      <span className="alert-time">Today, 10:24 PM</span>
                    </div>
                    <div className="alert-item">
                      <div className="alert-dot red"></div>
                      <div className="alert-info">
                        <span>Gampola Field 01</span>
                        <small>Elephant Detected</small>
                      </div>
                      <span className="alert-time">Today, 09:14 PM</span>
                    </div>
                    <div className="alert-item">
                      <div className="alert-dot orange"></div>
                      <div className="alert-info">
                        <span>Nuwara Eliya Field 03</span>
                        <small>Elephant Detected</small>
                      </div>
                      <span className="alert-time">Today, 08:47 PM</span>
                    </div>
                  </div>
                </div>
                
                {/* Map Preview */}
                <div className="mockup-map">
                  <h4>Field Activity Map</h4>
                  <div className="map-placeholder">
                    <div className="map-marker"></div>
                    <div className="map-alert-popup">
                      <span className="popup-title">Elephant Detected</span>
                      <span className="popup-location">Walapane Field 02</span>
                      <span className="popup-time">Today, 10:24 PM</span>
                      <button className="popup-btn">View on Map</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
