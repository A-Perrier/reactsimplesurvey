import React from 'react';
import '../styles/ProgressBar.css'

const ProgressBar = ({fillerColor = '#e0e0de', bgColor = '#fff', now, showLabel = true}) => {
  const styles = {
    container: {
      height: 5,
      width: '100%',
      backgroundColor: `${bgColor}`,
      borderRadius: 50,
      marginTop: 50
    },
    filler: {
      height: '100%',
      width: `${now}%`,
      backgroundColor: `${fillerColor}`,
      borderRadius: 'inherit',
      textAlign: 'right',
      transition: 'width 1s ease-in-out'
    },
    label: {
      padding: 5,
      color: 'white',
      fontWeight: 'bold'
    }
  }

  return ( 
    <div className="progress-bar" style={styles.container}>
      <div className="progress-bar__filler" style={styles.filler}>
        { showLabel &&
          <span 
            style={styles.label}
            role="progressbar"
            aria-valuenow={`${now}`}
            aria-valuemin="0"
            aria-valuemax="100"
            >{`${now}%`}
          </span>
        }
      </div>
    </div>
  );
}
 
export default ProgressBar;