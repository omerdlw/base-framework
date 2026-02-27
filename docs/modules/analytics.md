# Analytics

Kullanıcı davranışlarını ve uygulama olaylarını izler. Google Analytics gibi üçüncü taraf sağlayıcıları ortak bir arayüz arkasına sarar; event tracking hook'ları, kalıcılık katmanı ve debug araçları sunar.

`app/providers.js` içinde `<AnalyticsInit>` ile uygulama genelinde başlatılır. Olay takibi için hook'lar aracılığıyla her yerden kullanılır.

---

Olası kullanım örnekleri:

1. "Ana sayfada buton tıklamasını takip etmek için": `useTrack(ANALYTICS_EVENTS.VIEW_ITEM, { item_id: product.id })`
2. "Arama çubuğundaki sorguları kaydetmek için": `useSearchTracking({ query: searchValue })`
3. "İletişim sayfasındaki form gönderimini izlemek için": `useFormTracking({ form_id: 'contact-form' })`
4. "Uzun içerik sayfalarında scroll derinliğini otomatik takip etmek için": `useScrollTracking({ threshold: [25, 50, 75, 100] })`
5. "Giriş yapan kullanıcıyı tanımlamak için": `useIdentify({ userId: user.id, email: user.email })`

---

### useRegistry ile Kullanım

`useRegistry` bu modülü doğrudan desteklemeyen nedenle bir plugin sunmaz, ancak analytics ilklendirmesi `<AnalyticsInit>` bileşeni üzerinden `app/providers.js`'de global olarak yapılır.
