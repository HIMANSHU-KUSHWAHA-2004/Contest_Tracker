import React from 'react';
import './AboutUs.css';

const AboutUs = () => {
  return (
    <div className="about-container">
      <h1 className="about-heading">About Coding & Contests</h1>

      <section className="about-section">
        <h2>📜 What is Competitive Programming?</h2>
        <p>
          Competitive programming is the sport of the mind — solving logical and algorithmic problems under constraints. It challenges your ability to write efficient code and apply algorithms in innovative ways. It's not just about writing code; it's about solving problems creatively, quickly, and accurately.
        </p>
      </section>

      <section className="about-section">
        <h2>🧬 A Glimpse Into the Origin</h2>
        <p>
          The roots of coding competitions trace back to the 1970s with the ACM ICPC. Over the decades, platforms like TopCoder (2001), Codeforces (2010), and LeetCode (2015) revolutionized the space by bringing global challenges online. From campuses to international arenas, coding contests have become a bridge between education and industry.
        </p>
      </section>

      <section className="about-section">
        <h2>🎯 Why Participate in Contests?</h2>
        <ul>
          <li>Boosts algorithmic and data structure knowledge</li>
          <li>Enhances speed and accuracy in solving problems</li>
          <li>Builds resilience and calmness under pressure</li>
          <li>Helps land top tech jobs — companies like Google, Amazon, and Meta value it</li>
          <li>Connects you with a community of like-minded coders worldwide</li>
        </ul>
      </section>

      <section className="about-section">
        <h2>🧭 Best Platforms for Your Level</h2>
        <ul>
          <li>
            <strong>🔰 Beginners:</strong> <span className="platform">HackerRank</span>, <span className="platform">LeetCode Easy</span>, <span className="platform">GFG</span>
          </li>
          <li>
            <strong>🛠️ Intermediate:</strong> <span className="platform">LeetCode Medium</span>, <span className="platform">Codeforces Div 3</span>, <span className="platform">AtCoder Beginner</span>
          </li>
          <li>
            <strong>🔥 Advanced:</strong> <span className="platform">Codeforces Div 1/2</span>, <span className="platform">AtCoder Regular & Grand</span>, <span className="platform">TopCoder</span>, <span className="platform">Meta Hacker Cup</span>
          </li>
        </ul>
        <p>
          Whether you’re preparing for internships, job interviews, or Olympiads, there’s a platform that suits your level.
        </p>
      </section>

      <section className="about-section">
        <h2>🌍 Real-World Impact</h2>
        <p>
          Many top developers at Google, Facebook, and Microsoft credit coding contests for sharpening their edge. Schools and universities worldwide have integrated contests into their curriculum. Recruiters also use coding tests as filters — making competitive programming an essential asset in your resume.
        </p>
      </section>

      <section className="about-section">
        <h2>🔮 Future of Coding Contests</h2>
        <p>
          As technology advances, contests will evolve. Expect challenges involving AI, quantum computing, and real-world simulations. Platforms are also moving toward project-based and team competitions. The future is collaborative, creative, and code-driven.
        </p>
      </section>

      <section className="about-section motivation-quote">
        <h2>💬 Final Thoughts</h2>
        <blockquote>
          "Competitive programming isn't just a skill, it's a mindset — to break problems down, to persevere under pressure, and to never stop learning."
        </blockquote>
        <p className="signature">— Himanshu Kushwaha</p>
      </section>
    </div>
  );
};

export default AboutUs;
