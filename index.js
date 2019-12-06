import 'babel-polyfill';

function urlB64ToUint8Array(base64String) {
	const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
	const base64 = (base64String + padding)
		.replace(/\-/g, '+')
		.replace(/_/g, '/');

	const rawData = window.atob(base64);
	const outputArray = new Uint8Array(rawData.length);

	for (let i = 0; i < rawData.length; ++i) {
		outputArray[i] = rawData.charCodeAt(i);
	}
	return outputArray;
}

navigator.serviceWorker
	.register('/sw.js')
	.then(function(registration) {
		// Используем PushManager, чтобы получить подписку пользователя из пуш-сервиса.
		return registration.pushManager
			.getSubscription()
			.then(async function(subscription) {
				// Если подписка уже существует возвращаем ее.
				if (subscription) {
					return subscription;
				}

				const response = await fetch(
					'http://localhost:3000/vapidPublicKey',
				);

				const vapidPublicKey = await response.text();
				const convertedVapidKey = urlB64ToUint8Array(vapidPublicKey);

				return registration.pushManager.subscribe({
					userVisibleOnly: true,
					applicationServerKey: convertedVapidKey,
				});
			});
	})
	.then(function(subscription) {
		// Отправляем детали о подписке на сервер используя Fetch API
		fetch('http://localhost:3000/register', {
			method: 'post',
			headers: {
				'Content-type': 'application/json',
			},
			body: JSON.stringify({
				subscription: subscription,
			}),
		});

		// Для демонстрации функционала.
		// Данный код на "Боевых" приложениях не нужен, т.к. генерация уведомлений всегда происходит на сервере.
		document.querySelector('.push').addEventListener('click', () => {
			var payload = 'ХОБА';
			var delay = '0';
			var ttl = '100';

			fetch('http://localhost:3000/sendNotification', {
				method: 'post',
				headers: {
					'Content-type': 'application/json',
				},
				body: JSON.stringify({
					subscription: subscription,
					delay: delay,
					ttl: ttl,
				}),
			});
		});
	});

const images = document.querySelectorAll('.img');

images.forEach(image => {
	image.addEventListener('click', () => {
		image.classList.remove('is-active');
		if (image.nextElementSibling) {
			image.nextElementSibling.classList.add('is-active');
		} else if (image.previousElementSibling) {
			image.previousElementSibling.classList.add('is-active');
		}
	});
});
