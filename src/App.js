import './App.css';
import React from 'react';



function App() {
  const [hours, setHours] = React.useState('0');
  const [minutes, setMinutes] = React.useState('0');
  const [seconds, setSeconds] = React.useState('0'); 
  const [pace, setPace] = React.useState(null);
  const [speeds, setSpeeds] = React.useState(null);
  const [splits, setSplits] = React.useState(null);
  const [unit, setUnit] = React.useState('km'); // Default to kilometers
  const [distance, setDistance] = React.useState('marathon'); // Default to marathon
  const [splitType, setSplitType] = React.useState('steady'); // Default to steady splits
  const [splitsVisible, setSplitsVisible] = React.useState(true); // For collapsible splits

  const handleFocus = (e) => {
    if (e.target.value === '0') {
      e.target.value = '';
    }
  };

  const handleBlur = (e) => {
    if (e.target.value === '') {
      e.target.value = '0';
    }
  };

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

    // Generate splits based on split type
    const splitsList = [];
    const numSplits = Math.ceil(raceDistance);
    const halfwayPoint = Math.floor(numSplits / 2);

    if (splitType === 'steady') {
      for (let i = 1; i <= numSplits; i++) {
        splitsList.push({
          split: `${paceMinutes}:${paceSeconds.toString().padStart(2, '0')}`,
          seconds: secondsPerUnit
        });
      }
    } else if (splitType === 'negative') {
      // Calculate adjusted paces for negative splits (max 6 seconds difference)
      const adjustment = Math.min(6, secondsPerUnit * 0.05); // 5% or 6 seconds, whichever is smaller
      const firstHalfSeconds = secondsPerUnit + adjustment;
      const secondHalfSeconds = secondsPerUnit - adjustment;

      for (let i = 1; i <= numSplits; i++) {
        const splitSeconds = i <= halfwayPoint ? firstHalfSeconds : secondHalfSeconds;
        const splitMinutes = Math.floor(splitSeconds / 60);
        const splitSecs = Math.round(splitSeconds % 60);
        splitsList.push({
          split: `${splitMinutes}:${splitSecs.toString().padStart(2, '0')}`,
          seconds: splitSeconds
        });
      }
    }

    setSplits(splitsList);

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

  // Add effect to recalculate when inputs change
  React.useEffect(() => {
    if (hours !== '0' || minutes !== '0' || seconds !== '0') {
      calculatePace();
    }
  }, [distance, splitType, unit]);

  return (
    <div className="App" style={{
      backgroundColor: '#f5f5f5',
      minHeight: '100vh',
      padding: '0',
      width: '100%',
      maxWidth: '100vw',
      overflowX: 'hidden'
    }}>
      <div style={{
        background: 'linear-gradient(135deg, #2980b9, #2c3e50)',
        padding: '15px 10px',
        marginBottom: '20px',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
        width: '100%'
      }}>
        <h1 style={{
          color: 'white',
          margin: '0',
          fontSize: 'clamp(1.5em, 4vw, 2em)',
          textAlign: 'center',
          textTransform: 'uppercase',
          letterSpacing: '2px',
          textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
          padding: '0 10px'
        }}>
          🏃 Race Pace Calculator! 🏃‍♀️
        </h1>
      </div>
      
      <div className="calculator-container" style={{
        backgroundColor: 'white',
        borderRadius: '10px',
        padding: '15px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        width: '90%',
        maxWidth: '600px',
        margin: '0 auto'
      }}>
        <h2 style={{
          color: '#34495e',
          fontSize: 'clamp(1.2em, 3vw, 1.5em)',
          textAlign: 'center'
        }}>Race Distance</h2>
        <div style={{
          marginBottom: '20px',
          display: 'flex',
          justifyContent: 'center',
          gap: '20px'
        }}>
          <select
            value={distance}
            onChange={(e) => setDistance(e.target.value)}
            style={{
              padding: '8px',
              width: '100%',
              maxWidth: '200px',
              borderRadius: '4px',
              border: '1px solid #bdc3c7',
              fontSize: '16px'
            }}
          >
            <option value="marathon">Marathon</option>
            <option value="half">Half Marathon</option>
            <option value="10k">10K</option>
            <option value="5k">5K</option>
          </select>

          <select
            value={splitType}
            onChange={(e) => setSplitType(e.target.value)}
            style={{
              padding: '8px',
              width: '100%',
              maxWidth: '200px',
              borderRadius: '4px',
              border: '1px solid #bdc3c7',
              fontSize: '16px'
            }}
          >
            <option value="steady">Steady Splits</option>
            <option value="negative">Negative Splits</option>
          </select>
        </div>

        <h2 style={{
          color: '#34495e',
          fontSize: 'clamp(1.2em, 3vw, 1.5em)',
          textAlign: 'center'
        }}>Goal Time</h2>

        <div className="time-inputs" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(80px, 1fr))',
          gap: '20px',
          margin: '0 auto',
          maxWidth: '100%',
          padding: '0 10px'
        }}>
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
          }}>
            <label style={{marginBottom: '5px', fontSize: '14px'}}>Hours</label>
            <input
              type="number"
              value={hours}
              onChange={(e) => setHours(e.target.value)}
              onFocus={handleFocus}
              onBlur={handleBlur}
              placeholder="Hours"
              min="0"
              className="time-input"
              style={{
                padding: '8px',
                width: '100%',
                borderRadius: '4px',
                border: '1px solid #bdc3c7',
                fontSize: '16px'
              }}
            />
          </div>
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
          }}>
            <label style={{marginBottom: '5px', fontSize: '14px'}}>Minutes</label>
            <input
              type="number" 
              value={minutes}
              onChange={(e) => setMinutes(e.target.value)}
              onFocus={handleFocus}
              onBlur={handleBlur}
              placeholder="Minutes"
              min="0"
              max="59"
              className="time-input"
              style={{
                padding: '8px',
                width: '100%',
                borderRadius: '4px',
                border: '1px solid #bdc3c7',
                fontSize: '16px'
              }}
            />
          </div>
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
          }}>
            <label style={{marginBottom: '5px', fontSize: '14px'}}>Seconds</label>
            <input
              type="number"
              value={seconds}
              onChange={(e) => setSeconds(e.target.value)}
              onFocus={handleFocus}
              onBlur={handleBlur}
              placeholder="Seconds"
              min="0"
              max="59"
              className="time-input"
              style={{
                padding: '8px',
                width: '100%',
                borderRadius: '4px',
                border: '1px solid #bdc3c7',
                fontSize: '16px'
              }}
            />
          </div>
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
          }}>
            <label style={{marginBottom: '5px', fontSize: '14px'}}>Output Unit</label>
            <select 
              value={unit} 
              onChange={(e) => setUnit(e.target.value)}
              style={{
                padding: '8px',
                width: '100%',
                borderRadius: '4px',
                border: '1px solid #bdc3c7',
                fontSize: '16px'
              }}
            >
              <option value="km">Kilometers</option>
              <option value="mile">Miles</option>
            </select>
          </div>
        </div>

        <div style={{
          display: 'flex',
          justifyContent: 'center',
          margin: '20px 0'
        }}>
          <button 
            onClick={calculatePace}
            className="calculate-button"
            style={{
              backgroundColor: '#3498db',
              color: 'white',
              padding: '12px 24px',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '16px',
              width: '100%',
              maxWidth: '200px'
            }}
          >
            Calculate
          </button>
        </div>

        {pace && (
          <div className="result">
            <h3 style={{
              color: '#2c3e50',
              textAlign: 'center',
              fontSize: 'clamp(1.1em, 2.5vw, 1.3em)'
            }}>Required Pace:</h3>
            <p className="pace" style={{
              fontSize: 'clamp(20px, 5vw, 24px)',
              color: '#e74c3c',
              textAlign: 'center',
              margin: '10px 0'
            }}>{pace}</p>
            
            <div style={{
              overflowX: 'auto',
              width: '100%',
              padding: '10px 0'
            }}>
              <table className="speeds-table" style={{
                width: '100%',
                margin: '10px auto',
                borderCollapse: 'collapse',
                backgroundColor: '#fff',
                boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
                minWidth: '280px'
              }}>
                <thead>
                  <tr style={{backgroundColor: '#34495e', color: 'white'}}>
                    <th style={{padding: '12px', fontSize: '14px'}}>Alternative paces</th>
                    <th style={{padding: '12px', fontSize: '14px'}}>Value</th>
                  </tr>
                </thead>
                <tbody>
                  {unit === 'km' ? (
                    <tr style={{borderBottom: '1px solid #ecf0f1'}}>
                      <td style={{padding: '12px', fontSize: '14px'}}>Minutes per Mile</td>
                      <td style={{padding: '12px', fontSize: '14px'}}>{speeds.minPerMile}/mile</td>
                    </tr>
                  ) : (
                    <tr style={{borderBottom: '1px solid #ecf0f1'}}>
                      <td style={{padding: '12px', fontSize: '14px'}}>Minutes per Kilometer</td>
                      <td style={{padding: '12px', fontSize: '14px'}}>{speeds.minPerKm}/km</td>
                    </tr>
                  )}
                  <tr style={{borderBottom: '1px solid #ecf0f1'}}>
                    <td style={{padding: '12px', fontSize: '14px'}}>Miles per Hour</td>
                    <td style={{padding: '12px', fontSize: '14px'}}>{speeds.mph} mph</td>
                  </tr>
                  <tr>
                    <td style={{padding: '12px', fontSize: '14px'}}>Kilometers per Hour</td>
                    <td style={{padding: '12px', fontSize: '14px'}}>{speeds.kph} km/h</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {splits && (
              <div style={{
                marginTop: '20px',
                padding: '10px',
                backgroundColor: '#f8f9fa',
                borderRadius: '8px'
              }}>
                <div 
                  onClick={() => setSplitsVisible(!splitsVisible)}
                  style={{
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '10px'
                  }}
                >
                  <h3 style={{
                    color: '#2c3e50',
                    textAlign: 'center',
                    fontSize: 'clamp(1.1em, 2.5vw, 1.3em)',
                    marginBottom: '15px'
                  }}>Sample Split Times</h3>
                  <span style={{fontSize: '20px'}}>{splitsVisible ? '▼' : '▶'}</span>
                </div>
                {splitsVisible && (
                  <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '8px',
                    maxHeight: '400px',
                    overflowY: 'auto',
                    padding: '10px'
                  }}>
                    {splits.map((split, index) => {
                      const barWidth = `${(split.seconds / Math.max(...splits.map(s => s.seconds))) * 100}%`;
                      return (
                        <div key={index} style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '10px',
                          padding: '8px',
                          backgroundColor: 'white',
                          borderRadius: '4px',
                          boxShadow: '0 1px 2px rgba(0,0,0,0.1)'
                        }}>
                          <div style={{
                            minWidth: '120px',
                            fontSize: '14px',
                            color: '#666'
                          }}>{unit === 'km' ? `Kilometer ${index + 1}` : `Mile ${index + 1}`}</div>
                          <div style={{
                            flex: 1,
                            height: '24px',
                            backgroundColor: '#f0f0f0',
                            borderRadius: '4px',
                            overflow: 'hidden'
                          }}>
                            <div style={{
                              width: barWidth,
                              height: '100%',
                              backgroundColor: index < splits.length/2 ? '#3498db' : '#2ecc71',
                              transition: 'width 0.3s ease'
                            }}></div>
                          </div>
                          <div style={{
                            minWidth: '70px',
                            fontSize: '14px',
                            fontWeight: 'bold',
                            textAlign: 'right'
                          }}>{split.split}</div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}


export default App;
