import { computed } from 'vue'

// 色を補間する関数
const interpolateColor = (color1: string, color2: string, factor: number): string => {
    const hex2rgb = (hex: string) => {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : null;
    };

    const rgb2hex = (r: number, g: number, b: number): string => {
        return `#${Math.round(r).toString(16).padStart(2, '0')}${Math.round(g).toString(16).padStart(2, '0')}${Math.round(b).toString(16).padStart(2, '0')}`;
    };

    const rgb1 = hex2rgb(color1);
    const rgb2 = hex2rgb(color2);
    if (!rgb1 || !rgb2) return color1;

    return rgb2hex(
        rgb1.r + factor * (rgb2.r - rgb1.r),
        rgb1.g + factor * (rgb2.g - rgb1.g),
        rgb1.b + factor * (rgb2.b - rgb1.b)
    );
};

// 時刻に応じた空の色を取得する関数
const getSkyColors = (hour: number, minute: number, second: number = 0) => {
    const t = hour + minute / 60 + second / 3600;

    if (t < 4) {
        const f = t / 4;
        return { type: 'night', colors: [interpolateColor('#0a0a1a', '#0f0f23', f), interpolateColor('#1a1a3a', '#2a2a4a', f), interpolateColor('#2d2d5f', '#3d3d6f', f), interpolateColor('#1a1a3a', '#2a2a4a', f)] };
    } else if (t < 5.5) {
        const f = (t - 4) / 1.5;
        return { type: 'preDawn', colors: [interpolateColor('#0f0f23', '#1a1a3a', f), interpolateColor('#2a2a4a', '#3d3d5f', f), interpolateColor('#3d3d6f', '#5d4d7f', f), interpolateColor('#2a2a4a', '#4a4a6a', f)] };
    } else if (t < 7) {
        const f = (t - 5.5) / 1.5;
        const e = f < 0.5 ? 2 * f * f : 1 - Math.pow(-2 * f + 2, 3) / 2;
        return { type: 'sunrise', colors: [interpolateColor('#1a1a3a', '#4a4a7a', e), interpolateColor('#3d3d5f', '#8a6a9a', e), interpolateColor('#5d4d7f', '#ff9a8a', e), interpolateColor('#4a4a6a', '#ffcc82', e)] };
    } else if (t < 9) {
        const f = (t - 7) / 2;
        return { type: 'morning', colors: [interpolateColor('#4a4a7a', '#87ceeb', f), interpolateColor('#8a6a9a', '#add8e6', f), interpolateColor('#ff9a8a', '#cce7ff', f), interpolateColor('#ffcc82', '#e6f3ff', f)] };
    } else if (t < 15) {
        const f = Math.sin((t - 9) / 6 * Math.PI) * 0.2;
        return { type: 'day', colors: [interpolateColor('#4fc3f7', '#29b6f6', f), interpolateColor('#29b6f6', '#03a9f4', f), interpolateColor('#03a9f4', '#0288d1', f), interpolateColor('#0288d1', '#81d4fa', f)] };
    } else if (t < 17) {
        const f = (t - 15) / 2;
        return { type: 'afternoon', colors: [interpolateColor('#29b6f6', '#4fc3f7', f), interpolateColor('#03a9f4', '#26c6da', f), interpolateColor('#0288d1', '#4dd0e1', f), interpolateColor('#81d4fa', '#b3e5fc', f)] };
    } else if (t < 19.5) {
        const f = Math.pow((t - 17) / 2.5, 1.2);
        return { type: 'sunset', colors: [interpolateColor('#4fc3f7', '#6a4c93', f), interpolateColor('#26c6da', '#ff8a65', f), interpolateColor('#4dd0e1', '#ff6b47', f), interpolateColor('#b3e5fc', '#ff4757', f)] };
    } else if (t < 21) {
        const f = (t - 19.5) / 1.5;
        return { type: 'twilight', colors: [interpolateColor('#6a4c93', '#3c3c5c', f), interpolateColor('#ff8a65', '#5c5c7c', f), interpolateColor('#ff6b47', '#4a4a6a', f), interpolateColor('#ff4757', '#3a3a5a', f)] };
    } else if (t < 22) {
        const f = t - 21;
        return { type: 'evening', colors: [interpolateColor('#3c3c5c', '#2a2a4a', f), interpolateColor('#5c5c7c', '#3a3a5a', f), interpolateColor('#4a4a6a', '#2d2d4d', f), interpolateColor('#3a3a5a', '#1a1a3a', f)] };
    } else {
        const f = (t - 22) / 2;
        return { type: 'night', colors: [interpolateColor('#2a2a4a', '#1a1a3a', f), interpolateColor('#3a3a5a', '#2a2a4a', f), interpolateColor('#2d2d4d', '#2d2d5f', f), interpolateColor('#1a1a3a', '#1a1a3a', f)] };
    }
};

// 時刻に応じたグラデーション方向を決定
const buildGradient = (type: string, colors: string[]): string => {
    if (type === 'sunrise') {
        return `linear-gradient(0deg, ${colors[3]} 0%, ${colors[2]} 25%, ${colors[1]} 65%, ${colors[0]} 100%)`;
    }
    if (type === 'sunset') {
        return `linear-gradient(180deg, ${colors[0]} 0%, ${colors[1]} 30%, ${colors[2]} 65%, ${colors[3]} 100%)`;
    }
    // その他の時間帯はデフォルトパターン
    return `linear-gradient(180deg, ${colors[0]} 0%, ${colors[1]} 40%, ${colors[2]} 70%, ${colors[3]} 100%)`;
};

/**
 * 時刻に応じた空のグラデーションCSS文字列を返すcomposable
 * DynamicSky.vueと同じ色変化ロジックを使用
 */
export const useSkyGradient = () => {
    const gradient = computed(() => {
        const now = new Date();
        const { type, colors } = getSkyColors(now.getHours(), now.getMinutes(), now.getSeconds());
        return buildGradient(type, colors);
    });

    return { skyGradient: gradient };
};
