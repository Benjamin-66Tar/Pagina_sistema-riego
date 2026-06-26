import React, { useState, useEffect } from 'react';
import InfoCard from '../components/InfoCard';
import HumedadChart from '../components/HumedadChart';
import { fetchInitialStatus, getWebSocketUrl } from '../services/api';

const Dashboard = () => {
  const [bombaActiva, setBombaActiva] = useState(null);
  const [umbral, setUmbral] = useState(null);
  const [humedadActual, setHumedadActual] = useState(0);
  const [datosGrafica, setDatosGrafica] = useState({ labels: [], valores: [] });
  const [errorStatus, setErrorStatus] = useState(null);

  const maxDatos = 20;

  useEffect(() => {
    // 1. Cargar datos iniciales (Fetch)
    fetchInitialStatus()
      .then((data) => {
        setUmbral(data.umbral_riego);
        setBombaActiva(data.bomba_activa);
      })
      .catch((err) => {
        console.error("Error cargando configuración inicial:", err);
        setErrorStatus("No se pudo conectar con el ESP32 (¿Problema de HTTPS o dirección IP?)");
      });

    // 2. Conexión WebSocket en tiempo real
    let connection = null;
    try {
      const wsUri = getWebSocketUrl();
      connection = new WebSocket(wsUri);

      connection.onmessage = (event) => {
        const porcentaje = parseInt(event.data, 10);
        setHumedadActual(porcentaje);

        const tiempoActual = new Date().toLocaleTimeString();

        setDatosGrafica((prevDatos) => {
          const nuevosLabels = [...prevDatos.labels, tiempoActual];
          const nuevosValores = [...prevDatos.valores, porcentaje];

          if (nuevosLabels.length > maxDatos) {
            nuevosLabels.shift();
            nuevosValores.shift();
          }

          return { labels: nuevosLabels, valores: nuevosValores };
        });
      };

      connection.onerror = (error) => {
        console.error('Error en WebSocket: ', error);
        setErrorStatus("Error en la conexión WebSocket.");
      };
    } catch (e) {
      console.error("Excepción al conectar WebSocket:", e);
      setErrorStatus("Bloqueo de seguridad: No se permiten conexiones WebSocket inseguras (ws://) desde un sitio seguro (https://).");
    }

    // Limpieza de la conexión al desmontar el componente
    return () => {
      if (connection) {
        connection.close();
      }
    };
  }, []);

  return (
    <div className="container">
      <h1>Panel de Control AgroMind</h1>

      {errorStatus && (
        <div style={{ backgroundColor: '#f8d7da', color: '#721c24', padding: '12px', borderRadius: '6px', marginBottom: '20px', fontSize: '0.9rem', textAlign: 'left', border: '1px solid #f5c6cb' }}>
          <strong>Aviso de Seguridad / Conexión:</strong> {errorStatus}
          <br />
          <span style={{ fontSize: '0.8rem', marginTop: '5px', display: 'block', color: '#491217' }}>
            Dado que estás accediendo a través de un sitio seguro (<strong>HTTPS</strong> en Vercel), el navegador bloquea las peticiones directas HTTP e insecure WebSockets (<strong>ws://</strong>) hacia tu ESP32 local por seguridad (Mixed Content). 
            Para probar la comunicación real, te recomendamos ejecutar el proyecto de manera local (usando HTTP en <strong>http://localhost:5173</strong>).
          </span>
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