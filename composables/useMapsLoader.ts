let loadingPromise: Promise<void> | null = null;

export const useMapsLoader = () => {
  const config = useRuntimeConfig();
  const isLoaded = useState('gmaps_loaded', () => false);

  const load = (): Promise<void> => {
    if (isLoaded.value) return Promise.resolve();
    if (loadingPromise) return loadingPromise;

    loadingPromise = new Promise<void>((resolve) => {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${config.public.googleMapsApiKey}&libraries=places`;
      script.async = true;
      script.onload = () => {
        isLoaded.value = true;
        resolve();
      };
      document.head.appendChild(script);
    });
    return loadingPromise;
  };

  return { load, isLoaded };
};
