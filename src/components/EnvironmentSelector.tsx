import React from 'react';
import '../styles/EnvironmentSelector.css';

interface EnvironmentSelectorProps {
  currentEnvironment: string;
  onEnvironmentChange: (environment: string) => void;
}

const EnvironmentSelector: React.FC<EnvironmentSelectorProps> = ({
  currentEnvironment,
  onEnvironmentChange
}) => {
  const environments = [
    { id: 'desk', name: 'Desk', icon: '🪑' },
    { id: 'bedroom', name: 'Bedroom', icon: '🛏️' },
    { id: 'outdoors', name: 'Outdoors', icon: '🌳' },
    { id: 'arcade', name: 'Arcade', icon: '🎮' },
    { id: 'space', name: 'Space', icon: '🚀' }
  ];

  return (
    <div className="environment-selector">
      <h3>Environment</h3>
      <div className="environment-options">
        {environments.map((env) => (
          <button
            key={env.id}
            className={`environment-option ${currentEnvironment === env.id ? 'active' : ''}`}
            onClick={() => onEnvironmentChange(env.id)}
            aria-label={`Select ${env.name} environment`}
            title={env.name}
            type="button"
          >
            <span className="environment-icon">{env.icon}</span>
            <span className="environment-name">{env.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default EnvironmentSelector; 