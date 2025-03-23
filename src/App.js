import './App.css';
import React from 'react';



function App() {
  const [hours, setHours] = React.useState('0');
  const [minutes, setMinutes] = React.useState('0');
  const [seconds, setSeconds] = React.useState('0'); 
  const [pace, setPace] = React.useState(null);
  const [speeds, setSpeeds] = React.useState(null);
  const [unit, setUnit] = React.useState('km'); // Default to kilometers
  const [distance, setDistance] = React.useState('marathon'); // Default to marathon

  const calculatePace = () => {
    // Validate that all fields have values
    if (!hours || !minutes || !seconds) {
      alert('Please fill in all time fields');
      return;
    }

    // Convert all inputs to seconds
    const totalSeconds = (parseInt(hours) * 3600) + 
                        (parseInt(minutes) * 60) + 
                        parseInt(seconds);
    
    // Set distance based on selected race and unit
    let raceDistance;
    if (unit === 'km') {
      raceDistance = {
        'marathon': 42.2,
        'half': 21.1,
        '10k': 10,
        '5k': 5
      }[distance];
    } else {
      raceDistance = {
        'marathon': 26.2,
        'half': 13.1,
        '10k': 6.2137,
        '5k': 3.10686
      }[distance];
    }
    
    // Calculate seconds per unit
    const secondsPerUnit = totalSeconds / raceDistance;
    
    // Convert back to minutes and seconds
    const paceMinutes = Math.floor(secondsPerUnit / 60);
    const paceSeconds = Math.round(secondsPerUnit % 60);
    
    setPace(`${paceMinutes}:${paceSeconds.toString().padStart(2, '0')}/${unit}`);

    // Calculate additional speeds
    if (unit === 'km') {
      const kmPerHour = (3600 / secondsPerUnit).toFixed(2);
      const secondsPerMile = secondsPerUnit * 1.60934;
      const paceMinutesPerMile = Math.floor(secondsPerMile / 60);
      const paceSecondsPerMile = Math.round(secondsPerMile % 60);
      const milesPerHour = (3600 / secondsPerMile).toFixed(2);

      setSpeeds({
        minPerMile: `${paceMinutesPerMile}:${paceSecondsPerMile.toString().padStart(2, '0')}`,
        mph: milesPerHour,
        kph: kmPerHour
      });
    } else {
      const milesPerHour = (3600 / secondsPerUnit).toFixed(2);
      const secondsPerKm = secondsPerUnit / 1.60934;
      const paceMinutesPerKm = Math.floor(secondsPerKm / 60);
      const paceSecondsPerKm = Math.round(secondsPerKm % 60);
      const kmPerHour = (milesPerHour * 1.60934).toFixed(2);

      setSpeeds({
        minPerKm: `${paceMinutesPerKm}:${paceSecondsPerKm.toString().padStart(2, '0')}`,
        mph: milesPerHour,
        kph: kmPerHour
      });
    }
  };

  return (
    <div className="App" style={{
      backgroundColor: '#f5f5f5',
      minHeight: '100vh',
      padding: '0'
    }}>
      <div style={{
        background: 'linear-gradient(135deg, #2980b9, #2c3e50)',
        padding: '15px 20px',
        marginBottom: '30px',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
      }}>
        <h1 style={{
          color: 'white',
          margin: '0',
          fontSize: '2em',
          textAlign: 'center',
          textTransform: 'uppercase',
          letterSpacing: '2px',
          textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
        }}>
          🏃 Race Pace Calculator! 🏃‍♀️
        </h1>
      </div>
      
      <div className="calculator-container" style={{
        backgroundColor: 'white',
        borderRadius: '10px',
        padding: '20px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        maxWidth: '600px',
        margin: '0 auto'
      }}>
        <h2 style={{color: '#34495e'}}>Race Distance</h2>
        <div style={{marginBottom: '20px'}}>
          <select
            value={distance}
            onChange={(e) => setDistance(e.target.value)}
            style={{
              padding: '8px',
              width: '200px',
              borderRadius: '4px',
              border: '1px solid #bdc3c7'
            }}
          >
            <option value="marathon">Marathon</option>
            <option value="half">Half Marathon</option>
            <option value="10k">10K</option>
            <option value="5k">5K</option>
          </select>
        </div>

        <h2 style={{color: '#34495e'}}>Goal Time</h2>

        <div className="time-inputs" style={{display: 'flex', justifyContent: 'center', gap: '20px'}}>
          <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
            <label style={{marginBottom: '5px'}}>Hours</label>
            <input
              type="number"
              value={hours}
              onChange={(e) => setHours(e.target.value)}
              placeholder="Hours"
              min="0"
              className="time-input"
              style={{
                padding: '8px',
                width: '80px',
                borderRadius: '4px',
                border: '1px solid #bdc3c7'
              }}
            />
          </div>
          <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
            <label style={{marginBottom: '5px'}}>Minutes</label>
            <input
              type="number" 
              value={minutes}
              onChange={(e) => setMinutes(e.target.value)}
              placeholder="Minutes"
              min="0"
              max="59"
              className="time-input"
              style={{
                padding: '8px',
                width: '80px',
                borderRadius: '4px',
                border: '1px solid #bdc3c7'
              }}
            />
          </div>
          <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
            <label style={{marginBottom: '5px'}}>Seconds</label>
            <input
              type="number"
              value={seconds}
              onChange={(e) => setSeconds(e.target.value)}
              placeholder="Seconds"
              min="0"
              max="59"
              className="time-input"
              style={{
                padding: '8px',
                width: '80px',
                borderRadius: '4px',
                border: '1px solid #bdc3c7'
              }}
            />
          </div>
          <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
            <label style={{marginBottom: '5px'}}>Output Unit</label>
            <select 
              value={unit} 
              onChange={(e) => setUnit(e.target.value)}
              style={{
                padding: '8px',
                width: '160px',
                borderRadius: '4px',
                border: '1px solid #bdc3c7'
              }}
            >
              <option value="km">Kilometers</option>
              <option value="mile">Miles</option>
            </select>
          </div>
        </div>

        <button 
          onClick={calculatePace}
          className="calculate-button"
          style={{
            backgroundColor: '#3498db',
            color: 'white',
            padding: '10px 20px',
            border: 'none',
            borderRadius: '4px',
            margin: '20px 0',
            cursor: 'pointer'
          }}
        >
          Calculate
        </button>

        {pace && (
          <div className="result">
            <h3 style={{color: '#2c3e50'}}>Required Pace:</h3>
            <p className="pace" style={{
              fontSize: '24px',
              color: '#e74c3c'
            }}>{pace}</p>
            
            <table className="speeds-table" style={{
              width: '80%',
              margin: '20px auto',
              borderCollapse: 'collapse',
              backgroundColor: '#fff',
              boxShadow: '0 1px 3px rgba(0,0,0,0.2)'
            }}>
              <thead>
                <tr style={{backgroundColor: '#34495e', color: 'white'}}>
                  <th style={{padding: '12px'}}>Alternative paces</th>
                  <th style={{padding: '12px'}}>Value</th>
                </tr>
              </thead>
              <tbody>
                {unit === 'km' ? (
                  <tr style={{borderBottom: '1px solid #ecf0f1'}}>
                    <td style={{padding: '12px'}}>Minutes per Mile</td>
                    <td style={{padding: '12px'}}>{speeds.minPerMile}/mile</td>
                  </tr>
                ) : (
                  <tr style={{borderBottom: '1px solid #ecf0f1'}}>
                    <td style={{padding: '12px'}}>Minutes per Kilometer</td>
                    <td style={{padding: '12px'}}>{speeds.minPerKm}/km</td>
                  </tr>
                )}
                <tr style={{borderBottom: '1px solid #ecf0f1'}}>
                  <td style={{padding: '12px'}}>Miles per Hour</td>
                  <td style={{padding: '12px'}}>{speeds.mph} mph</td>
                </tr>
                <tr>
                  <td style={{padding: '12px'}}>Kilometers per Hour</td>
                  <td style={{padding: '12px'}}>{speeds.kph} km/h</td>
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}


export default App;
