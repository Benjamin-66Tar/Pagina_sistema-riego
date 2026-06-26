import React, { useState, useEffect } from 'react';
import InfoCard from '../components/InfoCard';
import HumedadChart from '../components/HumedadChart';
import { fetchInitialStatus, getWebSocketUrl } from '../services/api';

const Dashboard = () => {
  const [bombaActiva, setBombaActiva] = useState(null);
  const [umbral, setUmbral] = useState(null);
  const [humedadActual, setHumedadActual] = useState(0);
  const [datosGrafica, setDatosGrafica] = useState({ labels: [], valores: [] });

  const maxDatos = 20;

  useEffect(() => {
    // 1. Cargar datos iniciales (Fetch)
    fetchInitialStatus()
      .then((data) => {
        setUmbral(data.umbral_riego);
        setBombaActiva(data.bomba_activa);
      })
      .catch((err) => console.error("Error cargando configuración inicial:", err));

    // 2. Conexión WebSocket en tiempo real
    const wsUri = getWebSocketUrl();
    const connection = new WebSocket(wsUri);

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
    };

    // Limpieza de la conexión al desmontar el componente
    return () => {
      connection.close();
    };
  }, []);

  return (
    <div className="container">
      <h1>Panel de Control AgroMind</h1>
      
      <InfoCard bombaActiva={bombaActiva} umbral={umbral} />

      <div className="valor-actual">
        Humedad en Tiempo Real: <span>{humedadActual}</span>%
      </div>

      <HumedadChart datosGrafica={datosGrafica} />
    </div>
  );
};

export default Dashboard;