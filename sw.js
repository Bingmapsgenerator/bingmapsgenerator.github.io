const staticCacheName = 'static-cache-v0';

const staticAssets = [
    './',
    './index.html',
    //'./map.html',
    './js/app.js',
    './google1b980d101a18a5da.html',
    './free-bing-maps-code-generator.png',
    './app-ads.txt',
    './offline.html',
    'https://cdnjs.cloudflare.com/ajax/libs/materialize/1.0.0/css/materialize.min.css',
    'https://cdnjs.cloudflare.com/ajax/libs/jquery/3.4.1/jquery.min.js',
    'https://cdnjs.cloudflare.com/ajax/libs/normalize/5.0.0/normalize.min.css'
];

//const staticCacheName = 'static-cache-v0';
const dynamicCacheName = 'dynamic-cache-v0';

// const staticAssets = [
//     './',
//     './index.html',
//     './images/icons/icon-128x128.png',
//     './images/icons/icon-192x192.png',
//     './offline.html',
//     './css/main.css',
//     './js/app.js',
//     './js/main.js',
//     './images/no-image.jpg'
// ];

self.addEventListener('install', async event => {
    const cache = await caches.open(staticCacheName);
    await cache.addAll(staticAssets);
    console.log('Service worker has been installed');
});

self.addEventListener('activate', async event => {
    const cachesKeys = await caches.keys();
    const checkKeys = cachesKeys.map(async key => {
        if (![staticCacheName, dynamicCacheName].includes(key)) {
            await caches.delete(key);
        }
    });
    await Promise.all(checkKeys);
    console.log('Service worker has been activated');
});

self.addEventListener('fetch', event => {
    console.log(`Trying to fetch ${event.request.url}`);
    event.respondWith(checkCache(event.request));
});

async function checkCache(req) {
    const cachedResponse = await caches.match(req);
    return cachedResponse || checkOnline(req);
}

async function checkOnline(req) {
    const cache = await caches.open(dynamicCacheName);
    try {
        const res = await fetch(req);
        await cache.put(req, res.clone());
        return res;
    } catch (error) {
        const cachedRes = await cache.match(req);
        if (cachedRes) {
            return cachedRes;
        } else if (req.url.indexOf('.html') !== -1) {
            return caches.match('./offline.html');
        } 
        // else {
        //     return caches.match('./images/no-image.jpg');
        // }
    }
}

// self.addEventListener('install', async event => {
//     const cache = await caches.open(staticCacheName);
//     await cache.addAll(staticAssets);
//     console.log('Service worker has been installed');
// });

// self.addEventListener('activate', async event => {
//     const cachesKeys = await caches.keys();
//     const checkKeys = cachesKeys.map(async key => {
//         if (staticCacheName !== key) {
//             await caches.delete(key);
//         }
//     });
//     await Promise.all(checkKeys);
//     console.log('Service worker has been activated');
// });

// self.addEventListener('fetch', async event => {
//     console.log(`Trying to fetch ${event.request.url}`);
//     event.respondWith(caches.match(event.request).then(cachedResponse => {
//         return cachedResponse || fetch(event.request)
//     }));
// }); 