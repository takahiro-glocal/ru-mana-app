<template>
    <div class="sky-container">
        <div class="sky-gradient" :style="{ background: skyGradient }"></div>
        <div class="sky-content">
            <div class="orbits-area">
                <div class="flags-container">
                    <div v-for="(layer, li) in flagLayers" :key="`l-${li}`" class="flag-layer">
                        <div v-for="(flag, fi) in layer.flags" :key="`f-${li}-${fi}`"
                            class="flag-orbit" :class="`flag-layer-${li + 1}`" :style="{
                                '--initial-angle': `${(360 / layer.flags.length) * fi}deg`,
                                '--rotation-duration': `${layer.rotationSpeed}s`,
                                '--layer-radius': `${layer.radius}px`,
                                '--rotation-direction': layer.direction === 'counter-clockwise' ? 'reverse' : 'normal'
                            }">
                            <span class="flag-icon" :class="`fi fi-${flag.flag} fis`"></span>
                        </div>
                    </div>
                </div>
                <div v-if="showLogo" class="center-logo">
                    <div class="logo-ring">
                        <img src="/images/logo.png" alt="Logo" class="logo-img" />
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import "flag-icons/css/flag-icons.min.css";
import { countries } from '~/utils/countries';

interface Props {
    showLogo?: boolean
    compact?: boolean
}

const props = withDefaults(defineProps<Props>(), {
    showLogo: true,
    compact: false,
});

const { skyGradient } = useSkyGradient();

interface FlagLayer {
    radius: number;
    rotationSpeed: number;
    flags: Country[];
    direction: string;
}

// 重複しない国旗をシャッフル選択
const shuffleAndPick = (source: Country[], count: number, exclude: Set<string>): Country[] => {
    const available = source.filter(c => !exclude.has(c.flag));
    for (let i = available.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [available[i], available[j]] = [available[j], available[i]];
    }
    const picked = available.slice(0, count);
    picked.forEach(c => exclude.add(c.flag));
    return picked;
};

const getConfig = () => {
    if (props.compact) {
        return {
            layerRadii: [30, 55, 80],
            flagCounts: [3, 5, 7],
            rotationSpeeds: [60, 80, 100],
        };
    }
    const w = process.client ? window.innerWidth : 1024;
    if (w < 600) {
        return {
            layerRadii: [110, 180, 250, 320, 390],
            flagCounts: [5, 7, 9, 11, 13],
            rotationSpeeds: [100, 140, 160, 180, 200],
        };
    }
    if (w < 960) {
        return {
            layerRadii: [80, 130, 180, 230, 280],
            flagCounts: [5, 7, 9, 11, 13],
            rotationSpeeds: [90, 140, 160, 180, 200],
        };
    }
    return {
        layerRadii: [150, 260, 370, 480, 590],
        flagCounts: [6, 8, 10, 12, 14],
        rotationSpeeds: [180, 240, 260, 360, 320],
    };
};

const generateLayers = (): FlagLayer[] => {
    const config = getConfig();
    const used = new Set<string>();
    return config.layerRadii.map((radius, i) => ({
        radius,
        rotationSpeed: config.rotationSpeeds[i],
        flags: shuffleAndPick(Array.from(countries), config.flagCounts[i], used),
        direction: i % 2 === 0 ? 'clockwise' : 'counter-clockwise',
    }));
};

const flagLayers = ref<FlagLayer[]>(generateLayers());

const handleResize = () => {
    flagLayers.value = generateLayers();
};

onMounted(() => {
    window.addEventListener('resize', handleResize);
});

onUnmounted(() => {
    window.removeEventListener('resize', handleResize);
});
</script>

<style scoped>
.sky-container {
    position: relative;
    width: 100%;
    height: 100%;
    overflow: hidden;
}

.sky-gradient {
    position: absolute;
    inset: 0;
    transition: background 4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.sky-content {
    position: relative;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1;
}

.orbits-area {
    position: relative;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
}

.flags-container {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
}

.flag-layer {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 100%;
    height: 100%;
    pointer-events: none;
}

.flag-orbit {
    position: absolute;
    top: 50%;
    left: 50%;
    width: clamp(24px, 5vw, 55px);
    height: clamp(24px, 5vw, 55px);
    transform-origin: 50% 50%;
    transform: translate(-50%, -50%) rotate(var(--initial-angle)) translate(var(--layer-radius), 0) rotate(calc(-1 * var(--initial-angle)));
    animation: rotateOrbit var(--rotation-duration, 20s) linear infinite;
    animation-direction: var(--rotation-direction, normal);
}

.flag-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    border-radius: 50%;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
    border: 2px solid rgba(255, 255, 255, 0.8);
}

.center-logo {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 2;
    width: clamp(60px, 12vw, 140px);
    height: clamp(60px, 12vw, 140px);
}

.logo-ring {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    border: 3px solid rgba(255, 255, 255, 0.8);
    overflow: hidden;
    animation: logoGlow 3s ease-in-out infinite;
}

.logo-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 50%;
}

@keyframes logoGlow {
    0%, 100% {
        transform: scale(1);
        box-shadow: 0 8px 32px rgba(102, 126, 234, 0.3);
    }
    50% {
        transform: scale(1.05);
        box-shadow: 0 12px 40px rgba(102, 126, 234, 0.5);
    }
}

@keyframes rotateOrbit {
    0% {
        transform: translate(-50%, -50%) rotate(var(--initial-angle)) translate(var(--layer-radius), 0) rotate(calc(-1 * var(--initial-angle)));
    }
    100% {
        transform: translate(-50%, -50%) rotate(calc(var(--initial-angle) + 360deg)) translate(var(--layer-radius), 0) rotate(calc(-1 * (var(--initial-angle) + 360deg)));
    }
}
</style>
