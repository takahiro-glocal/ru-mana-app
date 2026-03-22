import { Loader } from '@googlemaps/js-api-loader';

let loader: Loader | null = null;

export const useMapsLoader = () => {
  const config = useRuntimeConfig();
  const isLoaded = useState('gmaps_loaded', () => false);

  const load = async (): Promise<void> => {
    if (isLoaded.value) return;

    if (!loader) {
      loader = new Loader({
        apiKey: config.public.googleMapsApiKey as string,
        libraries: ['places'],
      });
    }

    await loader.importLibrary('maps');
    isLoaded.value = true;
  };

  return { load, isLoaded };
};
