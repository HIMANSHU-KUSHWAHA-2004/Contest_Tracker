import React, { useState, useEffect } from "react";
import "./Dashboard.css";

const Dashboard = () => {
  const [contests, setContests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedHost, setSelectedHost] = useState("all");
  const [sortBy, setSortBy] = useState("start");

  // API endpoint - replace with your actual backend URL
  const API_BASE_URL = "http://localhost:5000"; // Change this to your backend URL

  const fetchContests = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/api/contests`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setContests(data);
    } catch (err) {
      setError("Failed to fetch contests. Please check your connection.");
      console.error("Error fetching contests:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContests();
  }, []);

  // ✅ Fixed: Format UTC date to readable IST time
  const formatDate = (dateString) => {
    // Parse as UTC by adding 'Z' if not present
    const utcDate = new Date(dateString.endsWith('Z') ? dateString : dateString + 'Z');
    
    // Convert to IST using toLocaleString with Indian timezone
    return utcDate.toLocaleString("en-IN", {
      timeZone: "Asia/Kolkata",
      weekday: "short",
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  // ✅ Fixed: Calculate contest duration
  const getDuration = (start, end) => {
    const startDate = new Date(start.endsWith('Z') ? start : start + 'Z');
    const endDate = new Date(end.endsWith('Z') ? end : end + 'Z');

    const diffMs = endDate - startDate;
    const totalMinutes = Math.floor(diffMs / 60000);

    const days = Math.floor(totalMinutes / (60 * 24));
    const hours = Math.floor((totalMinutes % (60 * 24)) / 60);
    const minutes = totalMinutes % 60;

    const result = [];
    if (days) result.push(`${days}d`);
    if (hours) result.push(`${hours}h`);
    if (minutes) result.push(`${minutes}m`);
    return result.join(" ");
  };

  // ✅ Fixed: Time remaining until contest starts
  const getTimeUntilStart = (start) => {
    const now = new Date();
    const startDate = new Date(start.endsWith('Z') ? start : start + 'Z');

    const diffMs = startDate.getTime() - now.getTime();

    if (diffMs <= 0) return "Started";

    const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const hours = Math.floor(
      (diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );
    const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

    if (days > 0) return `${days}d ${hours}h`;
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  };

  const getHostIcon = (host) => {
    if (host.includes("codeforces")) return "🔥";
    if (host.includes("atcoder")) return "🎯";
    if (host.includes("leetcode")) return "⚡";
    if (host.includes("codechef")) return "👨‍🍳";
    if (host.includes("hackerrank")) return "🚀";
    if (host.includes("hackerearth")) return "🌍";
    if (host.includes("topcoder")) return "🏆";
    return "💻";
  };

  const getHostClass = (host) => {
    if (host.includes("codeforces")) return "codeforces";
    if (host.includes("atcoder")) return "atcoder";
    if (host.includes("leetcode")) return "leetcode";
    if (host.includes("codechef")) return "codechef";
    if (host.includes("hackerrank")) return "hackerrank";
    if (host.includes("hackerearth")) return "hackerearth";
    if (host.includes("topcoder")) return "topcoder";
    return "default";
  };

  const now = new Date();

  const filteredContests = contests.filter((contest) => {
    const start = new Date(contest.start.endsWith('Z') ? contest.start : contest.start + 'Z');
    const end = new Date(contest.end.endsWith('Z') ? contest.end : contest.end + 'Z');

    const lowerSearch = searchTerm.toLowerCase();
    const matchesEvent = contest.event.toLowerCase().includes(lowerSearch);
    const matchesHostName = contest.host.toLowerCase().includes(lowerSearch);
    const matchesHostFilter =
      selectedHost === "all" || contest.host === selectedHost;

    // ✅ Only include contests that have not ended yet
    return (
      end.getTime() > now.getTime() &&
      (matchesEvent || matchesHostName) &&
      matchesHostFilter
    );
  });

  const sortedContests = [...filteredContests].sort((a, b) => {
    if (sortBy === "start") {
      const startA = new Date(a.start.endsWith('Z') ? a.start : a.start + 'Z');
      const startB = new Date(b.start.endsWith('Z') ? b.start : b.start + 'Z');
      return startA - startB;
    }
    return a.event.localeCompare(b.event);
  });

  const uniqueHosts = [...new Set(contests.map((c) => c.host))];

  if (loading) {
    return (
      <div className="dashboard-container">
        <div className="loading-screen">
          <div className="loading-spinner">
            <div className="spinner-ring"></div>
            <div className="spinner-ring secondary"></div>
          </div>
          <h2>Loading Contests...</h2>
          <p>Fetching the latest programming contests</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <div className="background-animation">
        <div className="bg-blob blob-1"></div>
        <div className="bg-blob blob-2"></div>
        <div className="bg-blob blob-3"></div>
      </div>

      <header className="dashboard-header">
        <div className="header-content">
          <div className="header-left">
            <div className="logo">
              <div className="logo-icon">🏆</div>
              <div className="logo-text">
                <h1>Contest Dashboard</h1>
                <p>Track upcoming programming contests</p>
              </div>
            </div>
          </div>

          <button
            onClick={fetchContests}
            disabled={loading}
            className={`refresh-btn ${loading ? "loading" : ""}`}
          >
            <span className="refresh-icon">🔄</span>
            <span>Refresh</span>
          </button>
        </div>
      </header>

      <main className="dashboard-main">
        <div className="stats-grid">
          <div className="stat-card purple">
            <div className="stat-content">
              <div className="stat-info">
                <p className="stat-label">Total Contests</p>
                <p className="stat-value">{contests.length}</p>
              </div>
              <div className="stat-icon">🏆</div>
            </div>
          </div>

          <div className="stat-card green">
            <div className="stat-content">
              <div className="stat-info">
                <p className="stat-label">Platforms</p>
                <p className="stat-value">{uniqueHosts.length}</p>
              </div>
              <div className="stat-icon">👥</div>
            </div>
          </div>

          <div className="stat-card orange">
            <div className="stat-content">
              <div className="stat-info">
                <p className="stat-label">Next Contest</p>
                <p className="stat-value">
                  {contests.length > 0
                    ? getTimeUntilStart(contests[0]?.start)
                    : "N/A"}
                </p>
              </div>
              <div className="stat-icon">⚡</div>
            </div>
          </div>
        </div>

        <div className="filters-section">
          <div className="filters-content">
            <div className="search-container">
              <input
                type="text"
                placeholder="Search contests..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
              <span className="search-icon">🔍</span>
            </div>

            <div className="filter-controls">
              <select
                value={selectedHost}
                onChange={(e) => setSelectedHost(e.target.value)}
                className="filter-select"
              >
                <option value="all">All Platforms</option>
                {uniqueHosts.map((host) => (
                  <option key={host} value={host}>
                    {host}
                  </option>
                ))}
              </select>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="filter-select"
              >
                <option value="start">Sort by Start Time</option>
                <option value="name">Sort by Name</option>
              </select>
            </div>
          </div>
        </div>

        <div className="contests-section">
          {error ? (
            <div className="error-state">
              <div className="error-icon">❌</div>
              <h3>{error}</h3>
              <button onClick={fetchContests} className="retry-btn">
                Try Again
              </button>
            </div>
          ) : sortedContests.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📅</div>
              <h3>No contests found</h3>
              <p>Try adjusting your search or filters</p>
            </div>
          ) : (
            <div className="contests-grid">
              {sortedContests.map((contest, index) => (
                <div
                  key={index}
                  className={`contest-card ${getHostClass(contest.host)}`}
                >
                  <div className="contest-header">
                    <div className="contest-host">
                      <span className="host-icon">
                        {getHostIcon(contest.host)}
                      </span>
                      <span className="host-name">{contest.host}</span>
                    </div>
                    <div className="contest-status">
                      <span className="status-badge">
                        {getTimeUntilStart(contest.start)}
                      </span>
                    </div>
                  </div>

                  <div className="contest-body">
                    <h3 className="contest-title">{contest.event}</h3>

                    <div className="contest-details">
                      <div className="detail-item">
                        <span className="detail-icon">📅</span>
                        <span className="detail-text">
                          {formatDate(contest.start)}
                        </span>
                      </div>
                      <div className="detail-item">
                        <span className="detail-icon">⏱️</span>
                        <span className="detail-text">
                          {getDuration(contest.start, contest.end)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="contest-footer">
                    <a
                      href={contest.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="contest-link"
                    >
                      <span>View Contest</span>
                      <span className="link-icon">🔗</span>
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;