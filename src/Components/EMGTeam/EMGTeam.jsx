import React from 'react'
import './EMGTeam.css';

const TeamMember = ({ name, role, description }) => {
  // Function to get initials from name
  const getInitials = (name) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase();
  };

  return (
    <div className="team-card">
      <div className="card-header">
        <div className="avatar">
          <span className="initials" style={{fontFamily:'Sprite-Graffiti'}}>{getInitials(name)}</span>
        </div>
        <div className="name-title">
          <h3>
            {name.split(' ').map((part, i) => (
              <React.Fragment key={i}>
                {part}
                {i < name.split(' ').length - 1 && <br />}
              </React.Fragment>
            ))}
          </h3>
        </div>
      </div>
      <div className="card-body">
        <div className="role">{role}</div>
        <p className="description">{description}</p>
      </div>
    </div>
  );
};

const EMGTeam = () => {
  const teamMembers = [
    {
      name: "Ikenna Nwagboso",
      role: "Co-Founder",
      description: "Seasoned music executive with a proven track record across music distribution, licensing, artist development, DSP relations, label partnerships, and music marketing. Ikenna brings strategic leadership focused on building scalable artist and label success globally."
    },
    {
      name: "Ayomide Adeware",
      role: "Co-Founder",
      description: "Industry expert with deep experience in publishing, copyright protection, synchronization, rights management, and strategic partnerships. Ayomide leads EMG's rights and publishing framework, ensuring artists and creators are fully protected and monetized."
    }
  ];

  return (
    <div className="emg-team-section">
      <div className="container">
        <div className="header">
          <h2>The Minds Behind EMG</h2>
          <h1>EMG is led by experts in music creation, distribution, and rights management, aiming to empower artists and labels.</h1>
        </div>

        <div className="team-grid">
          {teamMembers.map((member, index) => (
            <TeamMember
              key={index}
              name={member.name}
              role={member.role}
              description={member.description}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default EMGTeam