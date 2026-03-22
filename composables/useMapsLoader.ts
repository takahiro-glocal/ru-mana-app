import { setOptions, importLibrary } from '@googlemaps/js-api-loader';

let optionsSet = false;

export const useMapsLoader = () => {
  const config = useRuntimeConfig();
  const isLoaded = useState('gmaps_loaded', () => false);

  const load = async (): Promise<void> => {
    if (isLoaded.value) return;

    if (!optionsSet) {
      setOptions({
        apiKey: config.public.googleMapsApiKey as string,
      });
      optionsSet = true;
    }

    await Promise.all([
      importLibrary('maps'),
      importLibrary('places'),
    ]);
    isLoaded.value = true;
  };

  return { load, isLoaded };
};
