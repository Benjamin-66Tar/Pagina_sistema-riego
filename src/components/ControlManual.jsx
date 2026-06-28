import React from 'react';
import { enviarComandoMQTT } from '../services/api';

const ControlManual = ({ client, modoManual, setModoManual, bombaActiva, setBombaActiva }) => {
  const handleToggleModo = () => {
    const nuevoEstado = !modoManual;
    setModoManual(nuevoEstado);
    const nuevoComando = nuevoEstado ? 'MANUAL' : 'AUTO';
    enviarComandoMQTT(client, nuevoComando);
  };

  const handleCommand = (comando) => {
    if (comando === 'OFF') {
      setBombaActiva(false);
    } else if (comando.startsWith('ON')) {
      setBombaActiva(true);
    }
    enviarComandoMQTT(client, comando);
  };

  return (
    <div className="manual-card">
      <div className="manual-header">
        <h3>Control Manual del Sistema</h3>
        <div className="switch-container">
          <span className={`switch-label ${!modoManual ? 'active' : ''}`}>AUTOMÁTICO</span>
          <label className="switch">
            <input 
              type="checkbox" 
              checked={modoManual ?? false} 
              onChange={handleToggleModo}
            />
            <span className="slider round"></span>
          </label>
          <span className={`switch-label ${modoManual ? 'active' : ''}`}>MANUAL</span>
        </div>
      </div>

      <div className="manual-content">
        {!modoManual ? (
          <div className="info-automatico">
            <span className="info-icon">⚙️</span>
            <p>El control automático está activo. La bomba se encenderá automáticamente cuando la humedad caiga por debajo del umbral.</p>
          </div>
        ) : (
          <div className="controles-manuales">
            {bombaActiva ? (
              <div className="bomba-encendida-container">
                <p className="bomba-timer-warning">⚠️ La bomba está encendida. Recuerda apagarla al terminar o usa los temporizadores.</p>
                <button 
                  className="btn-bomba btn-danger-bomba" 
                  onClick={() => handleCommand('OFF')}
                >
                  🔴 APAGAR BOMBA AHORA
                </button>
              </div>
            ) : (
              <div className="bomba-apagada-container">
                <p className="manual-desc">Selecciona cómo deseas encender la bomba:</p>
                
                <div className="opciones-activacion">
                  <button 
                    className="btn-bomba btn-success-bomba" 
                    onClick={() => handleCommand('ON')}
                  >
                    ⚡ Encendido Indefinido
                  </button>

                  <div className="temporizadores-container">
                    <h4>⏱️ Encender por tiempo limitado:</h4>
                    <div className="btn-group-tiempo">
                      <button 
                        className="btn-tiempo" 
                        onClick={() => handleCommand('ON_10')}
                      >
                        10 Segundos
                      </button>
                      <button 
                        className="btn-tiempo" 
                        onClick={() => handleCommand('ON_30')}
                      >
                        30 Segundos
                      </button>
                      <button 
                        className="btn-tiempo" 
                        onClick={() => handleCommand('ON_60')}
                      >
                        1 Minuto
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ControlManual;
