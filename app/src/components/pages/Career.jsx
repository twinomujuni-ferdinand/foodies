/*const Career = () => (
  <section id="career" className="container mt-5">
    <h2>Career</h2>
    <p>Explore open positions and apply to join our team.</p>
  </section>
)
export default Career*/

import React from 'react'

const Career = () => {
  const jobs = [
    { title: 'Front-End Developer', location: 'Remote', type: 'Full-time' },
    { title: 'Marketing Intern', location: 'Kampala', type: 'Part-time' },
    { title: 'Head Chef', location: 'In-house', type: 'Full-time' },
  ]

  return (
    <div className="container py-5">
      <h1 className="mb-4" style={{ color: '#af9817' }}>Join Our Team</h1>
      <div className="row g-3">
        {jobs.map((job, idx) => (
          <div className="col-md-6 col-lg-4" key={idx}>
            <div className="card h-100 shadow-sm">
              <div className="card-body">
                <h5 className="card-title">{job.title}</h5>
                <p className="card-text"><strong>Location:</strong> {job.location}</p>
                <p className="card-text"><strong>Type:</strong> {job.type}</p>
                <button className="btn btn-outline-primary w-100">Apply Now</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Career
