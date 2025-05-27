import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const ProgressScreen = () => {
  const navigate = useNavigate();
  const [currentWeight, setCurrentWeight] = useState(60);
  const [chartWidth, setChartWidth] = useState(0);
  
  // Sample weight data over time (in a real app, this would come from a database)
  const weightData = [
    { date: 'Jan 1', weight: 65 },
    { date: 'Jan 15', weight: 64 },
    { date: 'Feb 1', weight: 63 },
    { date: 'Feb 15', weight: 62 },
    { date: 'Mar 1', weight: 61.5 },
    { date: 'Mar 15', weight: 61 },
    { date: 'Apr 1', weight: 60.5 },
    { date: 'Apr 15', weight: 60 },
  ];

  // Calculate the min and max values for the chart scaling
  const minWeight = Math.min(...weightData.map(item => item.weight)) - 1;
  const maxWeight = Math.max(...weightData.map(item => item.weight)) + 1;
  const weightRange = maxWeight - minWeight;

  useEffect(() => {
    // Update chart width on window resize
    const updateWidth = () => {
      const chartElement = document.querySelector('.chart-content');
      if (chartElement) {
        setChartWidth(chartElement.offsetWidth);
      }
    };

    updateWidth();
    window.addEventListener('resize', updateWidth);
    return () => window.removeEventListener('resize', updateWidth);
  }, []);

  const handleBack = () => {
    navigate('/workout');
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <button className="back-btn" onClick={handleBack}>Back</button>
        <h1>Progress Tracker</h1>
      </div>
      
      <div className="progress-container">
        <div className="weight-display">
          <h2>Weight</h2>
          <div className="weight-value">
            <span className="value">{currentWeight}</span>
            <span className="unit">KG</span>
          </div>
        </div>
        
        <div className="progress-chart">
          <h3>Weight Progress</h3>
          <div className="chart-container" style={{ width: '100%', height: 300, position: 'relative', marginBottom: '20px' }}>
            {/* Y-Axis Labels */}
            <div className="chart-y-axis" style={{ position: 'absolute', left: 0, top: 0, bottom: '20px', width: '40px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '12px' }}>{maxWeight} kg</span>
              <span style={{ fontSize: '12px' }}>{Math.round((maxWeight + minWeight) / 2 * 10) / 10} kg</span>
              <span style={{ fontSize: '12px' }}>{minWeight} kg</span>
            </div>
            
            {/* Chart Area */}
            <div className="chart-content" style={{ position: 'absolute', left: '40px', right: 0, top: 0, bottom: '20px', border: '1px solid #ccc' }}>
              {/* Grid Lines */}
              <div className="chart-grid" style={{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0 }}>
                <div style={{ position: 'absolute', left: 0, right: 0, top: '33%', height: '1px', backgroundColor: '#eee' }} />
                <div style={{ position: 'absolute', left: 0, right: 0, top: '66%', height: '1px', backgroundColor: '#eee' }} />
              </div>
              
              {/* Chart Dots */}
              {weightData.map((item, index) => {
                const x = `${(index / (weightData.length - 1)) * 100}%`;
                const y = `${((maxWeight - item.weight) / weightRange) * 100}%`;
                
                return (
                  <div 
                    key={`dot-${index}`} 
                    className="chart-dot" 
                    style={{ 
                      position: 'absolute', 
                      left: x, 
                      top: y, 
                      width: '8px', 
                      height: '8px', 
                      borderRadius: '50%', 
                      backgroundColor: '#8884d8', 
                      transform: 'translate(-4px, -4px)',
                      zIndex: 3
                    }}
                    title={`${item.date}: ${item.weight} kg`}
                  />
                );
              })}
              
              {/* Chart Lines */}
              {weightData.map((item, index) => {
                if (index === weightData.length - 1) return null;
                
                const nextItem = weightData[index + 1];
                const x1 = (index / (weightData.length - 1)) * 100;
                const x2 = ((index + 1) / (weightData.length - 1)) * 100;
                const y1 = ((maxWeight - item.weight) / weightRange) * 100;
                const y2 = ((maxWeight - nextItem.weight) / weightRange) * 100;
                
                // Calculate line length
                const lineLength = Math.sqrt(
                  Math.pow((x2 - x1) * chartWidth / 100, 2) + 
                  Math.pow((y2 - y1) * 280 / 100, 2)
                );
                
                // Calculate angle in degrees
                const angle = Math.atan2(
                  (y2 - y1) * 280 / 100, 
                  (x2 - x1) * chartWidth / 100
                ) * (180 / Math.PI);
                
                return (
                  <div 
                    key={`line-${index}`} 
                    style={{ 
                      position: 'absolute', 
                      left: `${x1}%`, 
                      top: `${y1}%`, 
                      width: `${lineLength}px`, 
                      height: '2px', 
                      backgroundColor: '#8884d8', 
                      transformOrigin: '0 0',
                      transform: `rotate(${angle}deg)`,
                      zIndex: 2
                    }} 
                  />
                );
              })}
            </div>
            
            {/* X-Axis Labels */}
            <div className="chart-x-axis" style={{ position: 'absolute', left: '40px', right: 0, bottom: 0, height: '20px', display: 'flex', justifyContent: 'space-between' }}>
              {weightData.map((item, index) => (
                <span key={`label-${index}`} style={{ fontSize: '10px', transform: 'rotate(-45deg)', transformOrigin: 'left top' }}>{item.date}</span>
              ))}
            </div>
          </div>
          
          <div className="progress-stats" style={{ display: 'flex', justifyContent: 'space-around', marginTop: '20px' }}>
            <div className="stat-item" style={{ textAlign: 'center' }}>
              <p className="stat-label" style={{ margin: '0', fontSize: '14px', color: '#666' }}>Starting Weight</p>
              <p className="stat-value" style={{ margin: '5px 0', fontSize: '18px', fontWeight: 'bold' }}>65 KG</p>
            </div>
            <div className="stat-item" style={{ textAlign: 'center' }}>
              <p className="stat-label" style={{ margin: '0', fontSize: '14px', color: '#666' }}>Weight Lost</p>
              <p className="stat-value" style={{ margin: '5px 0', fontSize: '18px', fontWeight: 'bold', color: 'green' }}>-5 KG</p>
            </div>
            <div className="stat-item" style={{ textAlign: 'center' }}>
              <p className="stat-label" style={{ margin: '0', fontSize: '14px', color: '#666' }}>Current Weight</p>
              <p className="stat-value" style={{ margin: '5px 0', fontSize: '18px', fontWeight: 'bold' }}>{currentWeight} KG</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgressScreen;