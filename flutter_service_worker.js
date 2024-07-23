'use strict';
const MANIFEST = 'flutter-app-manifest';
const TEMP = 'flutter-temp-cache';
const CACHE_NAME = 'flutter-app-cache';

const RESOURCES = {"version.json": "fb3737d711e7d9c2f8abb79fbb6c8f54",
"index.html": "6a9396d187c337fbaf40c0ea3d1ceb2c",
"/": "6a9396d187c337fbaf40c0ea3d1ceb2c",
"main.dart.js": "821b78881c24c78f6a7f4ff0a0498f46",
"flutter.js": "6fef97aeca90b426343ba6c5c9dc5d4a",
"icons/app_logo.png": "d3dccb388ae39e53ad54ddd0949215b6",
"manifest.json": "50ff4de225b025771c0f6108c81f5be7",
"assets/AssetManifest.json": "8b7434c23b1011b5d6660e46fc34dcbb",
"assets/NOTICES": "a04110f33c293e6955e84c46cec60306",
"assets/FontManifest.json": "a15939f8542049a1db1c0822c06dc201",
"assets/packages/cupertino_icons/assets/CupertinoIcons.ttf": "57d849d738900cfd590e9adc7e208250",
"assets/shaders/ink_sparkle.frag": "f8b80e740d33eb157090be4e995febdf",
"assets/AssetManifest.smcbin": "5e7b8e2eebee2ca9a48f8275a99e80dc",
"assets/fonts/MaterialIcons-Regular.otf": "62ec8220af1fb03e1c20cfa38781e17e",
"assets/assets/images/betblack.png": "ebad845b40ba179b0d01e5fc9e042c4b",
"assets/assets/images/background_dark.png": "eff2d87d1346b5aa8beb0815c38aed76",
"assets/assets/images/ncp_booth.png": "38b7799bffbe2f3b066947b75c951b28",
"assets/assets/images/upwork.png": "db4e66aefc5bd8994a0b77c1591157b1",
"assets/assets/images/nda.png": "ccd3ca97faa39a2dd6181a059bb51921",
"assets/assets/images/ncp.png": "8e6a21e1d1451dcc900321fe98e231d9",
"assets/assets/images/spotlight.png": "e01bef363cc0cedb88b8d1623cc3a431",
"assets/assets/images/protean.png": "a0d47e6861d0c9bf79bdf73be72e777f",
"assets/assets/images/kotak.png": "a5ae4193e44c23f8b2e348e66707f474",
"assets/assets/logo/loading_animation_long.gif": "7cac03093725fe79b74f697e7c639b10",
"assets/assets/logo/logo.png": "7792d233780fa1cb6fe66a4cd1f4fdb6",
"assets/assets/logo/app_logo.png": "d3dccb388ae39e53ad54ddd0949215b6",
"assets/assets/logo/app_logo.svg": "f7235eccbbc72d681d08fb1fd1983244",
"assets/assets/logo/reverse_loading.gif": "7cac03093725fe79b74f697e7c639b10",
"assets/assets/icons/arrow_back.svg": "ef0abbc3f02d33d803f3ebaa17b877dc",
"assets/assets/icons/social/github.svg": "3293b05b0be66a330536ceff60ac9f38",
"assets/assets/icons/social/instagram.svg": "ee26219a9c962083f8973bec17f9725b",
"assets/assets/icons/social/linkedin.svg": "2963f1999d859494a9dee74e6a39d82b",
"assets/assets/icons/skills/git.png": "555a06a254d9e96a471162de733bc614",
"assets/assets/icons/skills/docker.png": "36b266c1a364845446f1ee58581d9790",
"assets/assets/icons/skills/microservices.png": "1f6e1b1cb2d57da3be10e8f17b629b3e",
"assets/assets/icons/skills/flutter.png": "e02a6c427d3f2f6128219c4916cc4c6f",
"assets/assets/icons/skills/postgres.png": "ad6d4e2c3c5476ddd86132495815649a",
"assets/assets/icons/skills/firebase.png": "45ec5c8523c42019e2aa9fe5436750af",
"assets/assets/icons/skills/java.png": "652fdb659a681116811612e0b9e25354",
"assets/assets/icons/skills/gcp.png": "4ddc1ac9b63743c9b051e3afaf689c1a",
"assets/assets/icons/skills/mongo.png": "689bb66f5af8080e4f79ffeb16202f6a",
"assets/assets/icons/skills/figma.png": "fc112e58bcd30d3e158923591cb8ae79",
"assets/assets/icons/skills/studio.png": "4ddf123759c1e755d53a2b3122415070",
"assets/assets/icons/skills/springboot.png": "bb00cf1ea0e13e037103918cdf672596",
"assets/assets/icons/skills/postman.png": "a3dbaa4e92b609349beecc06f49fe7cb",
"assets/assets/icons/skills/idea.png": "af71e2cb50c9a1ce1c62c19d3b3569e9",
"assets/assets/icons/skills/dart.png": "a675cb93b75d5f1656c920dceecdcb38",
"assets/assets/icons/arrow_forward.svg": "1ebc2229b3e9d9f50b9dd8503fcbae03",
"assets/assets/fonts/VictorMono/VictorMono-Bold.ttf": "cbe39229787a3b35ea4cf1c3eeecab0c",
"assets/assets/fonts/VictorMono/VictorMono-SemiBold.ttf": "3c8a261e0f442f079a76396f1e8323af",
"assets/assets/fonts/VictorMono/VictorMono-Medium.ttf": "2fa2a363301ec3cc4391a8f3cf3717db",
"assets/assets/fonts/SpaceGrotesk/SpaceGrotesk-Regular.ttf": "9589c3d42504fe59926fb74b90b74061",
"assets/assets/fonts/SpaceGrotesk/SpaceGrotesk-Bold.ttf": "9ace3da396795504e076197f08434e8c",
"assets/assets/fonts/JosefinSans/JosefinSans-Bold.ttf": "75d240293f611020f2885e035a705f4e",
"assets/assets/fonts/JosefinSans/JosefinSans-SemiBold.ttf": "f5c12a8ff92995d15bc240053d60db48",
"canvaskit/skwasm.js": "1df4d741f441fa1a4d10530ced463ef8",
"canvaskit/skwasm.wasm": "6711032e17bf49924b2b001cef0d3ea3",
"canvaskit/chromium/canvaskit.js": "8c8392ce4a4364cbb240aa09b5652e05",
"canvaskit/chromium/canvaskit.wasm": "fc18c3010856029414b70cae1afc5cd9",
"canvaskit/canvaskit.js": "76f7d822f42397160c5dfc69cbc9b2de",
"canvaskit/canvaskit.wasm": "f48eaf57cada79163ec6dec7929486ea",
"canvaskit/skwasm.worker.js": "19659053a277272607529ef87acf9d8a"};
// The application shell files that are downloaded before a service worker can
// start.
const CORE = ["main.dart.js",
"index.html",
"assets/AssetManifest.json",
"assets/FontManifest.json"];

// During install, the TEMP cache is populated with the application shell files.
self.addEventListener("install", (event) => {
  self.skipWaiting();
  return event.waitUntil(
    caches.open(TEMP).then((cache) => {
      return cache.addAll(
        CORE.map((value) => new Request(value, {'cache': 'reload'})));
    })
  );
});
// During activate, the cache is populated with the temp files downloaded in
// install. If this service worker is upgrading from one with a saved
// MANIFEST, then use this to retain unchanged resource files.
self.addEventListener("activate", function(event) {
  return event.waitUntil(async function() {
    try {
      var contentCache = await caches.open(CACHE_NAME);
      var tempCache = await caches.open(TEMP);
      var manifestCache = await caches.open(MANIFEST);
      var manifest = await manifestCache.match('manifest');
      // When there is no prior manifest, clear the entire cache.
      if (!manifest) {
        await caches.delete(CACHE_NAME);
        contentCache = await caches.open(CACHE_NAME);
        for (var request of await tempCache.keys()) {
          var response = await tempCache.match(request);
          await contentCache.put(request, response);
        }
        await caches.delete(TEMP);
        // Save the manifest to make future upgrades efficient.
        await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
        // Claim client to enable caching on first launch
        self.clients.claim();
        return;
      }
      var oldManifest = await manifest.json();
      var origin = self.location.origin;
      for (var request of await contentCache.keys()) {
        var key = request.url.substring(origin.length + 1);
        if (key == "") {
          key = "/";
        }
        // If a resource from the old manifest is not in the new cache, or if
        // the MD5 sum has changed, delete it. Otherwise the resource is left
        // in the cache and can be reused by the new service worker.
        if (!RESOURCES[key] || RESOURCES[key] != oldManifest[key]) {
          await contentCache.delete(request);
        }
      }
      // Populate the cache with the app shell TEMP files, potentially overwriting
      // cache files preserved above.
      for (var request of await tempCache.keys()) {
        var response = await tempCache.match(request);
        await contentCache.put(request, response);
      }
      await caches.delete(TEMP);
      // Save the manifest to make future upgrades efficient.
      await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
      // Claim client to enable caching on first launch
      self.clients.claim();
      return;
    } catch (err) {
      // On an unhandled exception the state of the cache cannot be guaranteed.
      console.error('Failed to upgrade service worker: ' + err);
      await caches.delete(CACHE_NAME);
      await caches.delete(TEMP);
      await caches.delete(MANIFEST);
    }
  }());
});
// The fetch handler redirects requests for RESOURCE files to the service
// worker cache.
self.addEventListener("fetch", (event) => {
  if (event.request.method !== 'GET') {
    return;
  }
  var origin = self.location.origin;
  var key = event.request.url.substring(origin.length + 1);
  // Redirect URLs to the index.html
  if (key.indexOf('?v=') != -1) {
    key = key.split('?v=')[0];
  }
  if (event.request.url == origin || event.request.url.startsWith(origin + '/#') || key == '') {
    key = '/';
  }
  // If the URL is not the RESOURCE list then return to signal that the
  // browser should take over.
  if (!RESOURCES[key]) {
    return;
  }
  // If the URL is the index.html, perform an online-first request.
  if (key == '/') {
    return onlineFirst(event);
  }
  event.respondWith(caches.open(CACHE_NAME)
    .then((cache) =>  {
      return cache.match(event.request).then((response) => {
        // Either respond with the cached resource, or perform a fetch and
        // lazily populate the cache only if the resource was successfully fetched.
        return response || fetch(event.request).then((response) => {
          if (response && Boolean(response.ok)) {
            cache.put(event.request, response.clone());
          }
          return response;
        });
      })
    })
  );
});
self.addEventListener('message', (event) => {
  // SkipWaiting can be used to immediately activate a waiting service worker.
  // This will also require a page refresh triggered by the main worker.
  if (event.data === 'skipWaiting') {
    self.skipWaiting();
    return;
  }
  if (event.data === 'downloadOffline') {
    downloadOffline();
    return;
  }
});
// Download offline will check the RESOURCES for all files not in the cache
// and populate them.
async function downloadOffline() {
  var resources = [];
  var contentCache = await caches.open(CACHE_NAME);
  var currentContent = {};
  for (var request of await contentCache.keys()) {
    var key = request.url.substring(origin.length + 1);
    if (key == "") {
      key = "/";
    }
    currentContent[key] = true;
  }
  for (var resourceKey of Object.keys(RESOURCES)) {
    if (!currentContent[resourceKey]) {
      resources.push(resourceKey);
    }
  }
  return contentCache.addAll(resources);
}
// Attempt to download the resource online before falling back to
// the offline cache.
function onlineFirst(event) {
  return event.respondWith(
    fetch(event.request).then((response) => {
      return caches.open(CACHE_NAME).then((cache) => {
        cache.put(event.request, response.clone());
        return response;
      });
    }).catch((error) => {
      return caches.open(CACHE_NAME).then((cache) => {
        return cache.match(event.request).then((response) => {
          if (response != null) {
            return response;
          }
          throw error;
        });
      });
    })
  );
}
