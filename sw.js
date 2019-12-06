import catImg from './gallery/cat.jpg';

self.addEventListener('install', event => {
	event.waitUntil(
		caches.open('v1').then(cache => {
			return cache.addAll([
				'./',
				'./index.html',
				'./style.css',
				'./app.js',
				'./gallery/',
			]);
		}),
	);
});

self.addEventListener('fetch', event => {
	event.respondWith(
		caches
			.match(event.request)
			.then(resp => {
				return (
					resp ||
					fetch(event.request).then(response => {
						return caches.open('v1').then(cache => {
							cache.put(event.request, response.clone());
							return response;
						});
					})
				);
			})
			.catch(() => {
				return caches.match('./gallery/sad-doge.jpg');
			}),
	);
});

// Регистрируем функцию на событие 'push'
self.addEventListener('push', function(event) {
	event.waitUntil(
		// Показываем уведомление с заголовком и телом сообщения.
		self.registration.showNotification('ХОБА!!', {
			lang: 'ru',
			body: 'а вот и пуш',
			icon: catImg,
			vibrate: [500, 100, 500],
		}),
	);
});
