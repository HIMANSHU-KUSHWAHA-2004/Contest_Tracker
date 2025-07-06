import React from "react";
import "./Footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-center">
        <h3 className="footer-logo">ContestTracker</h3>
        <p className="footer-quote">
          "Programs must be written for people to read, and only incidentally for machines to execute."
        </p>
        <nav className="footer-links">
          <a href="/dashboard">Dashboard</a>
          <a href="/calendar">Calendar</a>
          <a href="https://codeforces.com" target="_blank" rel="noreferrer">Codeforces</a>
          <a href="https://leetcode.com" target="_blank" rel="noreferrer">LeetCode</a>
        </nav>
        <p className="footer-credit">
          © {new Date().getFullYear()} | Made with 💻 by <strong>Himanshu Kushwaha</strong>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
