import mqtt from 'mqtt';

const MQTT_BROKER = "wss://broker.hivemq.com:8884/mqtt";
const MQTT_TOPIC = "agro_mind_riego_6af1446e/status";

export const connectMQTT = (onMessageCallback, onErrorCallback) => {
  try {
    console.log("Intentando conectar al broker MQTT...");
    const client = mqtt.connect(MQTT_BROKER);

    client.on("connect", () => {
      console.log("Conectado exitosamente al broker MQTT por WSS");
      client.subscribe(MQTT_TOPIC, (err) => {
        if (err) {
          console.error("Error al suscribirse al tema MQTT:", err);
          if (onErrorCallback) onErrorCallback("Error al suscribirse al tema MQTT");
        }
      });
    });

    client.on("message", (topic, message) => {
      if (topic === MQTT_TOPIC) {
        try {
          const data = JSON.parse(message.toString());
          onMessageCallback(data);
        } catch (e) {
          console.error("Error al decodificar JSON del broker MQTT:", e);
        }
      }
    });

    client.on("error", (err) => {
      console.error("Error de cliente MQTT:", err);
      if (onErrorCallback) onErrorCallback("Error de conexión con el Broker MQTT.");
    });

    return client;
  } catch (e) {
    console.error("Error al iniciar la conexión MQTT:", e);
    if (onErrorCallback) onErrorCallback("No se pudo iniciar el cliente MQTT.");
    return null;
  }
};

const MQTT_CMD_TOPIC = "agro_mind_riego_6af1446e/cmd";

export const enviarComandoMQTT = (client, comando) => {
  if (client && client.connected) {
    client.publish(MQTT_CMD_TOPIC, comando, (err) => {
      if (err) {
        console.error("Error al enviar comando MQTT:", err);
      } else {
        console.log(`Comando '${comando}' enviado exitosamente`);
      }
    });
  } else {
    console.warn("No se pudo enviar comando, cliente MQTT no conectado");
  }
};