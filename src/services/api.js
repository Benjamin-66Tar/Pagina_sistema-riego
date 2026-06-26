const ESP32_IP = "111.111.111.111"; // <<--- Cambia esto por la IP de tu ESP32

export const fetchInitialStatus = async () => {
  try {
    const response = await fetch(`http://${ESP32_IP}/api/status`);
    if (!response.ok) {
      throw new Error('Error en la respuesta de la API');
    }
    return await response.json();
  } catch (error) {
    console.error('Hubo un problema con la petición Fetch:', error);
    throw error;
  }
};

export const getWebSocketUrl = () => {
  return `ws://${ESP32_IP}:81/`;
};