
(()=>{
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', async () => {
          const reg = await navigator.serviceWorker.register('/service-worker.js')
               // console.log('Service worker registered.', reg);
        });
      };      
})();


