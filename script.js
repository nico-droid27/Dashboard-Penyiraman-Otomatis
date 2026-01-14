window.addEventListener("load", () => {

  const mqttStatus = document.getElementById("mqttStatus");

  const client = mqtt.connect(
    "wss://8198b2045a7c4fc3a7da56a339fbdc85.s1.eu.hivemq.cloud:8884",
    {
      username: "esp32",
      password: "Project18166*",
      reconnectPeriod: 3000,
      clean: true
    }
  );

  client.on("connect", () => {
    console.log("WEB MQTT CONNECTED");
    mqttStatus.textContent = "CONNECTED";
    mqttStatus.className = "online";
    client.subscribe("irrigation/#");
  });

  client.on("offline", () => {
    mqttStatus.textContent = "OFFLINE";
    mqttStatus.className = "offline";
  });

  client.on("reconnect", () => {
    mqttStatus.textContent = "RECONNECTING...";
    mqttStatus.className = "offline";
  });

  client.on("error", err => {
    console.error("MQTT ERROR:", err);
  });

  client.on("message", (topic, message) => {
    const data = message.toString();
    console.log(topic, data);

    if (topic === "irrigation/soil") soil.textContent = data;
    if (topic === "irrigation/voltage") volt.textContent = data;
    if (topic === "irrigation/current") current.textContent = data;
    if (topic === "irrigation/power") power.textContent = data;
    if (topic === "irrigation/mode") mode.textContent = data === "1" ? "OTOMATIS" : "MANUAL";
    if (topic === "irrigation/pump") pump.textContent = data === "1" ? "ON" : "OFF";
    if (topic === "irrigation/threshold") threshold.value = data;
  });

  // ===== CONTROL FUNCTIONS =====
  window.toggleMode = () => {
    client.publish("irrigation/cmd/mode", "TOGGLE");
  };

  window.pumpOn = () => {
    client.publish("irrigation/cmd/pump", "ON");
  };

  window.pumpOff = () => {
    client.publish("irrigation/cmd/pump", "OFF");
  };

  window.setThreshold = () => {
    client.publish("irrigation/cmd/threshold", threshold.value);
  };
});
