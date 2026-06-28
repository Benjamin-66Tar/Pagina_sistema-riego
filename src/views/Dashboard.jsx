import React, { useState, useEffect } from 'react';
import InfoCard from '../components/InfoCard';
import HumedadChart from '../components/HumedadChart';
import { connectMQTT } from '../services/api';

const Dashboard = () => {
  const [bombaActiva, setBombaActiva] = useState(null);
  const [umbral, setUmbral] = useState(null);
  const [humedadActual, setHumedadActual] = useState(0);
  const [datosGrafica, setDatosGrafica] = useState({ labels: [], valores: [] });
  const [conexionStatus, setConexionStatus] = useState("Conectando al Broker MQTT...");
  const [errorStatus, setErrorStatus] = useState(null);

  const maxDatos = 20;

  useEffect(() => {
    let client = connectMQTT(
      (data) => {
        // Al recibir el mensaje
        setUmbral(data.umbral_riego);
        setBombaActiva(data.bomba_activa);
        setHumedadActual(data.humedad);
        setConexionStatus(null); // Conectado y recibiendo datos
        setErrorStatus(null);

        const tiempoActual = new Date().toLocaleTimeString();

        setDatosGrafica((prevDatos) => {
          const nuevosLabels = [...prevDatos.labels, tiempoActual];
          const nuevosValores = [...prevDatos.valores, data.humedad];

          if (nuevosLabels.length > maxDatos) {
            nuevosLabels.shift();
            nuevosValores.shift();
          }

          return { labels: nuevosLabels, valores: nuevosValores };
        });
      },
      (errorMessage) => {
        setErrorStatus(errorMessage);
        setConexionStatus(null);
      }
    );

    return () => {
      if (client) {
        console.log("Cerrando cliente MQTT...");
        client.end();
      }
    };
  }, []);

  return (
    <div className="container">
      <h1>Panel de Control del Sistema de Riego</h1>

      {conexionStatus && (
        <div style={{ backgroundColor: '#e2f0d9', color: '#385723', padding: '12px', borderRadius: '6px', marginBottom: '20px', fontSize: '0.9rem', textAlign: 'center', border: '1px solid #c5e0b4' }}>
          <strong>Estado:</strong> {conexionStatus} (Asegúrate de que tu ESP32 esté encendido y conectado a internet)
        </div>
      )}

      {errorStatus && (
        <div style={{ backgroundColor: '#f8d7da', color: '#721c24', padding: '12px', borderRadius: '6px', marginBottom: '20px', fontSize: '0.9rem', textAlign: 'left', border: '1px solid #f5c6cb' }}>
          <strong>Error de Conexión:</strong> {errorStatus}
        </div>
      )}
      
      <InfoCard bombaActiva={bombaActiva} umbral={umbral} />

      <div className="valor-actual">
        Humedad en Tiempo Real: <span>{humedadActual}</span>%
      </div>

      <HumedadChart datosGrafica={datosGrafica} />
    </div>
  );
};

export default Dashboard;