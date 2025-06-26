import webpush from 'web-push';

// Configura tus claves VAPID
webpush.setVapidDetails(
  "mailto:ferguevara3c@gmail.com",
  "BIiF29te7oMuYrMajQS6vztjRsrEFWSpWANnF0lqmVKsNSIXuVgY3m_y13Q-rDcypkcJikpFj46M0ijGmKIXhqc",
  "bzC1-BMlbEc1_7NGy6UVtyPSx3FmdgOXxTAZMMbXhjI"
);

async function enviarNotificacionPrueba(subscription: any) {
  const payload = JSON.stringify({
    title: "Notificación de prueba",
    body: "Esta es una notificación enviada desde backend para probar",
    url: "http://localhost:3000"  // URL que quieres abrir al click
  });

  try {
    await webpush.sendNotification(subscription, payload);
    console.log("Notificación enviada correctamente");
  } catch (error) {
    console.error("Error enviando notificación:", error);
  }
}

const subscriptionObject = {
    "endpoint": "https://wns2-bl2p.notify.windows.com/w/?token=BQYAAABvWmMGS8WljP3asRNBqk2kclOo4rf3oWNIPfaOe6lPYabqqn8dMOOFWoDylcTHTOt9NLqKLP2L8NzcoNRyuUrL8JChBGers3apGvPPRlIbuPGtcl2451Z0g9ssYehpadBHFTFal9CrH6Hc8xVucEh8LH2%2bCjmAwUFxO%2fvGQbLP2KzDBzugC6GD9ybbx7ursGOds2%2fuNA5rRe5w4KyqFDXFOrDh0t6FaX0Wz59Y2e%2bplxY1dFuNHgafRlF64jSPmeDBwfYpvUYoX%2fs%2bjg51j4%2f9xuUVGCaGwX0fFk%2bz0bZzZDfOtcZPINb58FWO25X%2bITg%3d",
    "expirationTime": null,
    "keys": {
        "p256dh": "BMM3C1Ja5yIBFROtUGi20l5ivzPpY5oj-2UC2hprqSbuGPXE45RzXKKk7fnA24Q_L1xdShtyj2Kj626rRPfSGCM",
        "auth": "hqa-ewRSvt6cKiPrR4bIpw"
    }
}
const subscription = subscriptionObject;

enviarNotificacionPrueba(subscription);