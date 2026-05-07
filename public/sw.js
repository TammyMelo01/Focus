self.addEventListener("push", function (event) {
  const data = event.data ? event.data.json() : {};
  const title = data.title || "MicroFocus AI";
  const options = {
    body: data.body || "Hora de voltar com calma para a próxima microetapa.",
    icon: "/icon.png",
    badge: "/icon.png"
  };
  event.waitUntil(self.registration.showNotification(title, options));
});
