export const useMapsLoader = () => {
  const config = useRuntimeConfig();
  const isLoaded = useState('gmaps_loaded', () => false);

  const load = (): Promise<void> => {
    if (isLoaded.value) return Promise.resolve();
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${config.public.googleMapsApiKey}&libraries=places`;
      script.async = true;
      script.onload = () => {
        isLoaded.value = true;
        resolve();
      };
      document.head.appendChild(script);
    });
  };

  return { load, isLoaded };
};