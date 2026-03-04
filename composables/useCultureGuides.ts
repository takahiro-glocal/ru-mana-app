export const useCultureGuides = () => {
  const { t } = useI18n();
  const isLoading = useState<boolean>('culture-guides-loading', () => false);

  // ガイドの構造定義（アイコンとi18nキーのマッピング）
  const guideDefinitions: Record<string, Array<{ id: string; icon: string; key: string }>> = {
    transport: [
      { id: 'transport-phone', icon: 'volume-x', key: 'guides.transport.phone' },
      { id: 'transport-backpack', icon: 'backpack', key: 'guides.transport.backpack' },
      { id: 'transport-queue', icon: 'users', key: 'guides.transport.queue' },
      { id: 'transport-priority', icon: 'heart', key: 'guides.transport.priority' },
      { id: 'transport-eating', icon: 'utensils', key: 'guides.transport.eating' },
    ],
    public: [
      { id: 'public-noise', icon: 'volume-x', key: 'guides.public.noise' },
      { id: 'public-queue', icon: 'users', key: 'guides.public.queue' },
      { id: 'public-shoes', icon: 'footprints', key: 'guides.public.shoes' },
      { id: 'public-trash', icon: 'trash-2', key: 'guides.public.trash' },
    ],
    spa: [
      { id: 'spa-wash', icon: 'droplets', key: 'guides.spa.wash' },
      { id: 'spa-towel', icon: 'shirt', key: 'guides.spa.towel' },
      { id: 'spa-dry', icon: 'waves', key: 'guides.spa.dry' },
      { id: 'spa-tattoo', icon: 'alert-circle', key: 'guides.spa.tattoo' },
      { id: 'spa-swim', icon: 'shirt', key: 'guides.spa.swim' },
    ],
    cafe: [
      { id: 'cafe-itadakimasu', icon: 'utensils', key: 'guides.cafe.itadakimasu' },
      { id: 'cafe-chopsticks', icon: 'utensils', key: 'guides.cafe.chopsticks' },
      { id: 'cafe-slurp', icon: 'soup', key: 'guides.cafe.slurp' },
      { id: 'cafe-tipping', icon: 'banknote', key: 'guides.cafe.tipping' },
      { id: 'cafe-oshibori', icon: 'droplets', key: 'guides.cafe.oshibori' },
    ],
    shopping: [
      { id: 'shopping-cash', icon: 'banknote', key: 'guides.shopping.cash' },
      { id: 'shopping-bag', icon: 'shopping-bag', key: 'guides.shopping.bag' },
      { id: 'shopping-taxfree', icon: 'receipt', key: 'guides.shopping.taxfree' },
      { id: 'shopping-fitting', icon: 'shirt', key: 'guides.shopping.fitting' },
    ],
    hotel: [
      { id: 'hotel-shoes', icon: 'footprints', key: 'guides.hotel.shoes' },
      { id: 'hotel-yukata', icon: 'shirt', key: 'guides.hotel.yukata' },
      { id: 'hotel-checkout', icon: 'clock', key: 'guides.hotel.checkout' },
      { id: 'hotel-quiet', icon: 'volume-x', key: 'guides.hotel.quiet' },
    ],
    culture: [
      { id: 'culture-shrine', icon: 'landmark', key: 'guides.culture.shrine' },
      { id: 'culture-bowing', icon: 'users', key: 'guides.culture.bowing' },
      { id: 'culture-gifts', icon: 'gift', key: 'guides.culture.gifts' },
      { id: 'culture-photo', icon: 'camera', key: 'guides.culture.photo' },
    ],
    trash: [
      { id: 'trash-sorting', icon: 'trash-2', key: 'guides.trash.sorting' },
      { id: 'trash-carry', icon: 'backpack', key: 'guides.trash.carry' },
      { id: 'trash-convenience', icon: 'shopping-bag', key: 'guides.trash.convenience' },
      { id: 'trash-recycle', icon: 'recycle', key: 'guides.trash.recycle' },
    ]
  };

  /**
   * i18nキーからガイドデータを生成
   */
  const getGuidesByCategory = (categoryId: string): ComputedRef<CultureGuide[]> => {
    return computed(() => {
      const definitions = guideDefinitions[categoryId];
      if (!definitions) return [];

      return definitions.map(def => ({
        id: def.id,
        categoryId,
        title: t(`${def.key}.title`),
        icon: def.icon,
        desc: t(`${def.key}.desc`),
        good: t(`${def.key}.good`),
        bad: t(`${def.key}.bad`),
      }));
    });
  };

  // loadGuidesは互換性のため残す（何もしない）
  const loadGuides = async () => {};

  return {
    guides: readonly(ref({})),
    isLoading: readonly(isLoading),
    error: readonly(ref(null)),
    loadGuides,
    getGuidesByCategory
  };
};
