import React from 'react';

const InfoCard = ({ bombaActiva, umbral }) => {
  return (
    <div className="info-card">
      <div>
        Estado Bomba:{' '}
        <span className={`badge ${bombaActiva ? 'bg-success' : 'bg-danger'}`}>
          {bombaActiva === null ? 'Cargando...' : bombaActiva ? 'ENCENDIDA' : 'APAGADA'}
        </span>
      </div>
      <div>
        Umbral Configurado: <span style={{ fontWeight: 'bold' }}>{umbral ?? '--'}</span>%
      </div>
    </div>
  );
};

export default InfoCard;