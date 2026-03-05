<template>
    <div class="cultural-platform-container" @click="returnFlagToOriginalPosition(currentCenteredFlag ?? '')">
        <!-- 背景グラデーション -->
        <div class="background-gradient" :style="{ background: bgColor }"></div>

        <!-- メインコンテンツ領域 -->
        <div class="main-content">
            <!-- メインアニメーション領域 -->
            <div class="main-animation-area" ref="animationArea">
                <!-- 回転する国旗群 - 5層構造 -->
                <div class="flags-container">
                    <!-- 各軌道レイヤー -->
                    <div v-for="(layer, layerIndex) in flagLayers" :key="`layer-${layerIndex}`" class="flag-layer">
                        <!-- 各レイヤーの国旗 -->
                        <div v-for="(flag, flagIndex) in layer.flags" :key="`flag-${layerIndex}-${flagIndex}`"
                            class="flag-orbit" :class="[
                                `flag-layer-${layerIndex + 1}`,
                                { 'flag-moving-to-center': animatingFlags.has(`${layerIndex}-${flagIndex}`) }
                            ]" :style="{
                                '--initial-angle': `${(360 / layer.flags.length) * flagIndex}deg`,
                                '--rotation-duration': `${layer.rotationSpeed}s`,
                                '--layer-radius': `${layer.radius}px`,
                                '--rotation-direction': layer.direction === 'counter-clockwise' ? 'reverse' : 'normal'
                            }">
                            <div class="flag-circle" @click.stop="handleClickFlag(flag, layerIndex, flagIndex, $event)">
                                <span :title="flag.name" :class="`fi fi-${flag.flag} fis flag-icon`"
                                    :style="{ width: isMobile ? '48px' : '55px', height: isMobile ? '48px' : '55px' }"></span>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- 中央のサイトロゴ（固定） - 国旗の後に配置 -->
                <div class="site-logo" ref="siteLogo">
                    <div class="logo-circle">
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

// レスポンシブ判定
const isMobile = ref(false);
const isXs = ref(false);
const isSm = ref(false);

const updateBreakpoints = () => {
    if (!process.client) return;
    const w = window.innerWidth;
    isXs.value = w < 600;
    isSm.value = w >= 600 && w < 960;
    isMobile.value = w < 1264;
};

const emit = defineEmits(['clickFlag'])

const now = computed(() => new Date());

const bgColor = computed(() => {
    const hours = now.value.getHours();
    const minutes = now.value.getMinutes();
    const seconds = now.value.getSeconds();

    // 時刻に応じた背景色を取得
    const skyData = getSkyColors(hours, minutes, seconds);
    const { type, colors } = skyData;

    let gradient = '';

    // 時間帯に応じて異なるグラデーションパターンを適用（全てlinear-gradientで統一）
    switch (type) {
        case 'sunrise':
            // 朝焼け：下から徐々に明るくなる（太陽が昇る効果）
            gradient = `linear-gradient(
        0deg,
        ${colors[3]} 0%,
        ${colors[2]} 25%,
        ${colors[1]} 65%,
        ${colors[0]} 100%
      )`;
            break;

        case 'sunset':
            // 夕焼け：上から徐々に暗くなり、地平線近くが燃えるような赤
            gradient = `linear-gradient(
        180deg,
        ${colors[0]} 0%,
        ${colors[1]} 30%,
        ${colors[2]} 65%,
        ${colors[3]} 100%
      )`;
            break;

        case 'twilight':
            // トワイライト：夕焼けの余韻から夜への移行
            gradient = `linear-gradient(
        180deg,
        ${colors[0]} 0%,
        ${colors[1]} 35%,
        ${colors[2]} 70%,
        ${colors[3]} 100%
      )`;
            break;

        case 'preDawn':
            // 夜明け前：夜の闇から朝の準備へ
            gradient = `linear-gradient(
        180deg,
        ${colors[0]} 0%,
        ${colors[1]} 40%,
        ${colors[2]} 75%,
        ${colors[3]} 100%
      )`;
            break;

        case 'morning':
            // 朝：爽やかな空への変化
            gradient = `linear-gradient(
        180deg,
        ${colors[0]} 0%,
        ${colors[1]} 35%,
        ${colors[2]} 70%,
        ${colors[3]} 100%
      )`;
            break;

        case 'day':
            // 昼：安定した青空
            gradient = `linear-gradient(
        180deg,
        ${colors[0]} 0%,
        ${colors[1]} 40%,
        ${colors[2]} 70%,
        ${colors[3]} 100%
      )`;
            break;

        case 'afternoon':
            // 午後：昼から夕方への準備
            gradient = `linear-gradient(
        180deg,
        ${colors[0]} 0%,
        ${colors[1]} 40%,
        ${colors[2]} 70%,
        ${colors[3]} 100%
      )`;
            break;

        case 'evening':
            // 夜：深い夜空への移行
            gradient = `linear-gradient(
        180deg,
        ${colors[0]} 0%,
        ${colors[1]} 45%,
        ${colors[2]} 75%,
        ${colors[3]} 100%
      )`;
            break;

        default:
        case 'night':
            // 夜：深い夜空
            gradient = `linear-gradient(
        180deg,
        ${colors[0]} 0%,
        ${colors[1]} 40%,
        ${colors[2]} 75%,
        ${colors[3]} 100%
      )`;
            break;
    }

    return gradient;
});

// 色を補間する関数
const interpolateColor = (color1: string, color2: string, factor: number): string => {
    // カラーコードをRGBに変換
    const hex2rgb = (hex: string) => {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : null;
    };

    // RGBをカラーコードに変換
    const rgb2hex = (r: number, g: number, b: number): string => {
        return `#${Math.round(r).toString(16).padStart(2, '0')}${Math.round(g).toString(16).padStart(2, '0')}${Math.round(b).toString(16).padStart(2, '0')}`;
    };

    const rgb1 = hex2rgb(color1);
    const rgb2 = hex2rgb(color2);

    if (!rgb1 || !rgb2) return color1;

    const r = rgb1.r + factor * (rgb2.r - rgb1.r);
    const g = rgb1.g + factor * (rgb2.g - rgb1.g);
    const b = rgb1.b + factor * (rgb2.b - rgb1.b);

    return rgb2hex(r, g, b);
};

// 時刻に応じた空の色を取得する関数（自然な朝焼け・夕焼け対応）
const getSkyColors = (hour: number, minute: number, second: number = 0) => {
    const timeDecimal = hour + minute / 60 + second / 3600;

    // より自然な空の色変化を時間帯別に定義（連続性を重視）
    if (timeDecimal >= 0 && timeDecimal < 4) {
        // 深夜 (0-4時) - 深い夜空
        const factor = timeDecimal / 4;
        return {
            type: 'night',
            colors: [
                interpolateColor('#0a0a1a', '#0f0f23', factor),
                interpolateColor('#1a1a3a', '#2a2a4a', factor),
                interpolateColor('#2d2d5f', '#3d3d6f', factor),
                interpolateColor('#1a1a3a', '#2a2a4a', factor)
            ]
        };
    } else if (timeDecimal >= 4 && timeDecimal < 5.5) {
        // 夜明け前 (4-5:30時) - 夜から朝への準備
        const factor = (timeDecimal - 4) / 1.5;
        return {
            type: 'preDawn',
            colors: [
                interpolateColor('#0f0f23', '#1a1a3a', factor),
                interpolateColor('#2a2a4a', '#3d3d5f', factor),
                interpolateColor('#3d3d6f', '#5d4d7f', factor),
                interpolateColor('#2a2a4a', '#4a4a6a', factor)
            ]
        };
    } else if (timeDecimal >= 5.5 && timeDecimal < 7) {
        // 朝焼け (5:30-7時) - 下から徐々に明るく
        const factor = (timeDecimal - 5.5) / 1.5;
        const easeInOut = factor < 0.5 ? 2 * factor * factor : 1 - Math.pow(-2 * factor + 2, 3) / 2;
        return {
            type: 'sunrise',
            colors: [
                interpolateColor('#1a1a3a', '#4a4a7a', easeInOut), // 上部：暗い紫から薄い紫へ
                interpolateColor('#3d3d5f', '#8a6a9a', easeInOut), // 中上部：紫からピンクがかった紫へ
                interpolateColor('#5d4d7f', '#ff9a8a', easeInOut), // 中下部：紫からピンクオレンジへ
                interpolateColor('#4a4a6a', '#ffcc82', easeInOut)  // 下部：暗いグレーから明るい黄色へ
            ]
        };
    } else if (timeDecimal >= 7 && timeDecimal < 9) {
        // 朝 (7-9時) - 朝焼けから青空へ
        const factor = (timeDecimal - 7) / 2;
        return {
            type: 'morning',
            colors: [
                interpolateColor('#4a4a7a', '#87ceeb', factor),
                interpolateColor('#8a6a9a', '#add8e6', factor),
                interpolateColor('#ff9a8a', '#cce7ff', factor),
                interpolateColor('#ffcc82', '#e6f3ff', factor)
            ]
        };
    } else if (timeDecimal >= 9 && timeDecimal < 15) {
        // 昼 (9-15時) - 青空
        const factor = Math.sin((timeDecimal - 9) / 6 * Math.PI) * 0.2; // 昼間の微細な変化
        return {
            type: 'day',
            colors: [
                interpolateColor('#4fc3f7', '#29b6f6', factor),
                interpolateColor('#29b6f6', '#03a9f4', factor),
                interpolateColor('#03a9f4', '#0288d1', factor),
                interpolateColor('#0288d1', '#81d4fa', factor)
            ]
        };
    } else if (timeDecimal >= 15 && timeDecimal < 17) {
        // 午後 (15-17時) - 昼から夕方への準備
        const factor = (timeDecimal - 15) / 2;
        return {
            type: 'afternoon',
            colors: [
                interpolateColor('#29b6f6', '#4fc3f7', factor),
                interpolateColor('#03a9f4', '#26c6da', factor),
                interpolateColor('#0288d1', '#4dd0e1', factor),
                interpolateColor('#81d4fa', '#b3e5fc', factor)
            ]
        };
    } else if (timeDecimal >= 17 && timeDecimal < 19.5) {
        // 夕焼け (17-19:30時) - 上から徐々に暗く、地平線は燃えるような赤
        const factor = (timeDecimal - 17) / 2.5;
        const sunsetCurve = Math.pow(factor, 1.2); // 夕焼けの進行カーブ
        return {
            type: 'sunset',
            colors: [
                interpolateColor('#4fc3f7', '#6a4c93', sunsetCurve), // 上部：青から深い紫へ
                interpolateColor('#26c6da', '#ff8a65', sunsetCurve), // 中上部：水色からオレンジへ
                interpolateColor('#4dd0e1', '#ff6b47', sunsetCurve), // 中下部：薄水色から赤オレンジへ
                interpolateColor('#b3e5fc', '#ff4757', sunsetCurve)  // 下部：薄い青から鮮やかな赤へ
            ]
        };
    } else if (timeDecimal >= 19.5 && timeDecimal < 21) {
        // 日没後 (19:30-21時) - 夕焼けから夜へ
        const factor = (timeDecimal - 19.5) / 1.5;
        return {
            type: 'twilight',
            colors: [
                interpolateColor('#6a4c93', '#3c3c5c', factor),
                interpolateColor('#ff8a65', '#5c5c7c', factor),
                interpolateColor('#ff6b47', '#4a4a6a', factor),
                interpolateColor('#ff4757', '#3a3a5a', factor)
            ]
        };
    } else if (timeDecimal >= 21 && timeDecimal < 22) {
        // 夜 (21-22時) - トワイライトから夜へ
        const factor = (timeDecimal - 21) / 1;
        return {
            type: 'evening',
            colors: [
                interpolateColor('#3c3c5c', '#2a2a4a', factor),
                interpolateColor('#5c5c7c', '#3a3a5a', factor),
                interpolateColor('#4a4a6a', '#2d2d4d', factor),
                interpolateColor('#3a3a5a', '#1a1a3a', factor)
            ]
        };
    } else {
        // 深夜へ (22-24時)
        const factor = (timeDecimal - 22) / 2;
        return {
            type: 'night',
            colors: [
                interpolateColor('#2a2a4a', '#1a1a3a', factor),
                interpolateColor('#3a3a5a', '#2a2a4a', factor),
                interpolateColor('#2d2d4d', '#2d2d5f', factor),
                interpolateColor('#1a1a3a', '#1a1a3a', factor)
            ]
        };
    }
};

// テンプレート参照
const animationArea = ref<HTMLElement | null>(null);
const siteLogo = ref<HTMLElement | null>(null);

// アニメーション中の国旗を追跡
const animatingFlags = ref(new Set<string>());

// 現在中央に表示されている国旗のキー
const currentCenteredFlag = ref<string | null>(null);

// デバイス別のアニメーション設定
const getResponsiveConfig = () => {
    if (isXs.value) {
        // 極小画面 (< 600px)
        return {
            animationSize: Math.min(window.innerWidth * 0.8, window.innerHeight * 0.6),
            logoSize: 80,
            flagSize: 35,
            layerRadii: [110, 180, 250, 320, 390],
            flagCounts: [5, 7, 9, 11, 13],
            rotationSpeeds: [100, 140, 160, 180, 200]
        };
    } else if (isSm.value) {
        // 小画面 (600px - 960px)
        return {
            animationSize: Math.min(window.innerWidth * 0.9, window.innerHeight * 0.7),
            logoSize: 100,
            flagSize: 45,
            layerRadii: [80, 130, 180, 230, 280],
            flagCounts: [5, 7, 9, 11, 13],
            rotationSpeeds: [90, 140, 160, 180, 200]
        };
    } else if (isMobile.value) {
        // 中画面 (960px - 1264px)
        return {
            animationSize: Math.min(window.innerWidth * 0.85, window.innerHeight * 0.75),
            logoSize: 120,
            flagSize: 50,
            layerRadii: [100, 160, 220, 280, 340],
            flagCounts: [6, 8, 10, 12, 14],
            rotationSpeeds: [100, 150, 170, 190, 210]
        };
    } else {
        // デスクトップ (>= 1264px)
        return {
            animationSize: 800,
            logoSize: 140,
            flagSize: 60,
            layerRadii: [150, 260, 370, 480, 590],
            flagCounts: [6, 8, 10, 12, 14],
            rotationSpeeds: [180, 240, 260, 360, 320]
        };
    }
};

// 重複しない国旗選択を管理するクラス
class UniqueCountrySelector {
    private availableCountries: Country[];
    private usedCountries: Set<string>;

    constructor(allCountries: Country[]) {
        this.availableCountries = [...allCountries];
        this.usedCountries = new Set();
        this.shuffle();
    }

    private shuffle(): void {
        for (let i = this.availableCountries.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.availableCountries[i], this.availableCountries[j]] =
                [this.availableCountries[j], this.availableCountries[i]];
        }
    }

    selectCountries(count: number, fixed?: string): Country[] {
        const selectedCountries: Country[] = [];
        let attempts = 0;
        const maxAttempts = this.availableCountries.length * 2;

        if (fixed) {
            const fixedCountry = this.availableCountries.find(a => a.flag === fixed);
            if (fixedCountry) {
                selectedCountries.push(fixedCountry);
                this.usedCountries.add(fixedCountry.flag);
            }
        }

        while (selectedCountries.length < count && attempts < maxAttempts) {
            for (const country of this.availableCountries) {
                if (selectedCountries.length >= count) break;

                if (!this.usedCountries.has(country.flag)) {
                    selectedCountries.push(country);
                    this.usedCountries.add(country.flag);
                }
            }

            // 必要な数に達しない場合は再シャッフル
            if (selectedCountries.length < count) {
                this.shuffle();
                attempts++;
            }
        }

        // それでも足りない場合は、使用済みから再利用（重複チェックをリセット）
        if (selectedCountries.length < count) {
            console.warn('利用可能な国旗数が不足しています。一部重複する可能性があります。');
            this.usedCountries.clear();

            while (selectedCountries.length < count) {
                const remainingNeeded = count - selectedCountries.length;
                const additionalCountries = this.availableCountries
                    .slice(0, remainingNeeded)
                    .filter(country => !selectedCountries.some(selected => selected.flag === country.flag));

                selectedCountries.push(...additionalCountries);

                if (selectedCountries.length < count) {
                    // 最終手段：残りを強制的に追加
                    const remaining = this.availableCountries.slice(0, count - selectedCountries.length);
                    selectedCountries.push(...remaining);
                }
            }
        }

        return selectedCountries.slice(0, count);
    }

    reset(): void {
        this.usedCountries.clear();
        this.shuffle();
    }

    getRemainingCount(): number {
        return this.availableCountries.length - this.usedCountries.size;
    }
}

// 各レイヤーの国旗データを重複なしで生成
const generateFlagLayers = () => {
    const selector = new UniqueCountrySelector(Array.from(countries));
    const config = getResponsiveConfig();

    // 必要な総国旗数を計算
    const totalNeededFlags = config.flagCounts.reduce((sum, count) => sum + count, 0);

    // 利用可能な国旗数をチェック
    if (totalNeededFlags > countries.length) {
        console.warn(`必要な国旗数(${totalNeededFlags})が利用可能な国旗数(${countries.length})を超えています。`);
    }

    const layers = config.layerRadii.map((radius, index) => ({
        radius,
        rotationSpeed: config.rotationSpeeds[index],
        flags: selector.selectCountries(config.flagCounts[index], index === 0 ? 'jp' : undefined),
        direction: index % 2 === 0 ? 'clockwise' : 'counter-clockwise'
    }));

    // デバッグ情報
    console.log('生成されたレイヤー情報:', {
        totalFlags: layers.reduce((sum, layer) => sum + layer.flags.length, 0),
        remainingCountries: selector.getRemainingCount(),
        layerDetails: layers.map((layer, index) => ({
            layer: index + 1,
            flagCount: layer.flags.length,
            radius: layer.radius,
            flags: layer.flags.map(f => f.flag)
        }))
    });

    return layers;
};

// 中央の国旗をリセットする関数
const resetCenteredFlags = () => {
    if (animationArea.value) {
        const centeredElements = animationArea.value.querySelectorAll('.flag-centered, .flag-returning');
        centeredElements.forEach((element) => {
            const flagElement = element as HTMLElement;

            // スタイルとクラスをリセット
            flagElement.style.removeProperty('--move-x');
            flagElement.style.removeProperty('--move-y');
            flagElement.classList.remove('flag-centered', 'flag-moving-to-center', 'flag-returning');
        });
    }

    // 状態もリセット
    animatingFlags.value.clear();
    currentCenteredFlag.value = null;
};

// 国旗の重複チェック関数（デバッグ用）
const checkForDuplicates = (layers: FlagLayer[]) => {
    const allFlags = new Set<string>();
    const duplicates = new Set<string>();

    layers.forEach((layer, layerIndex) => {
        layer.flags.forEach((flag: Country) => {
            if (allFlags.has(flag.flag)) {
                duplicates.add(flag.flag);
                console.warn(`重複検出: ${flag.flag} がレイヤー${layerIndex + 1}で重複しています`);
            } else {
                allFlags.add(flag.flag);
            }
        });
    });

    return {
        totalUniqueFlags: allFlags.size,
        duplicateCount: duplicates.size,
        duplicateFlags: Array.from(duplicates)
    };
};

// 国旗クリック処理
const handleClickFlag = (country: Country, _layerIndex: number, _flagIndex: number, _event: Event) => {
    emit('clickFlag', country)
};

// 国旗を元の位置に戻す関数
const returnFlagToOriginalPosition = (flagKey: string) => {
    if (!animationArea.value) return;

    // 該当する国旗要素を検索
    const flagElements = animationArea.value.querySelectorAll('.flag-orbit');
    let targetElement: HTMLElement | null = null;

    // flagKeyに対応する要素を特定
    flagElements.forEach((element) => {
        const flagElement = element as HTMLElement;
        if (flagElement.classList.contains('flag-centered')) {
            // 中央に表示されている要素を見つけた場合、それが対象かチェック
            const moveX = flagElement.style.getPropertyValue('--move-x');
            const moveY = flagElement.style.getPropertyValue('--move-y');
            if (moveX && moveY) {
                targetElement = flagElement;
            }
        }
    });

    if (!targetElement) return;

    console.log('Returning flag to original position:', flagKey);

    // 元の位置に戻るアニメーションクラスを追加
    (targetElement as HTMLElement).classList.remove('flag-centered');
    (targetElement as HTMLElement).classList.add('flag-returning');

    // アニメーション完了後の処理
    const handleReturnAnimationEnd = () => {
        // 全てのスタイルとクラスをリセット
        targetElement!.style.removeProperty('--move-x');
        targetElement!.style.removeProperty('--move-y');
        targetElement!.classList.remove('flag-returning', 'flag-moving-to-center');

        // アニメーション中フラグもリセット
        animatingFlags.value.delete(flagKey);

        // 現在中央の国旗をクリア（既に新しい国旗に更新される予定）
        if (currentCenteredFlag.value === flagKey) {
            currentCenteredFlag.value = null;
        }
    };

    // アニメーション完了イベントを監視
    (targetElement as HTMLElement).addEventListener('animationend', handleReturnAnimationEnd, { once: true });
};

// 国旗レイヤーを再生成する関数
const regenerateFlags = () => {
    // 現在中央に表示されている国旗の状態を保存
    const centeredFlagData = { moveX: '', moveY: '', element: null as HTMLElement | null };

    // DOM要素から中央に固定されている国旗を検索
    if (animationArea.value && currentCenteredFlag.value) {
        const centeredElement = animationArea.value.querySelector('.flag-centered') as HTMLElement;
        if (centeredElement) {
            centeredFlagData.moveX = centeredElement.style.getPropertyValue('--move-x');
            centeredFlagData.moveY = centeredElement.style.getPropertyValue('--move-y');
            centeredFlagData.element = centeredElement;
        }
    }

    flagLayers.value = generateFlagLayers();
    const duplicateInfo = checkForDuplicates(flagLayers.value);
    console.log('重複チェック結果:', duplicateInfo);

    // 中央に固定されていた国旗の状態を復元
    nextTick(() => {
        if (centeredFlagData.element && centeredFlagData.moveX && centeredFlagData.moveY) {
            if (centeredFlagData.element.parentNode) { // 要素がまだ存在する場合
                centeredFlagData.element.style.setProperty('--move-x', centeredFlagData.moveX);
                centeredFlagData.element.style.setProperty('--move-y', centeredFlagData.moveY);
                centeredFlagData.element.classList.add('flag-centered');
            }
        }
    });
};

// リアクティブな国旗レイヤーデータ
const flagLayers = ref(generateFlagLayers());

// ウィンドウリサイズ時の再生成
const handleResize = () => {
    updateBreakpoints();
    regenerateFlags();
};

// コンポーネントがマウントされたときに初期化
onMounted(() => {
    updateBreakpoints();
    regenerateFlags();
    window.addEventListener('resize', handleResize);
});

// アンマウント時にイベントリスナーを削除
onUnmounted(() => {
    window.removeEventListener('resize', handleResize);
});

// 開発環境でのデバッグ機能
if (process.dev) {
    // グローバルに関数を公開（開発時のデバッグ用）
    const win = window as unknown as Window & Record<string, unknown>;
    win.regenerateFlags = regenerateFlags;
    win.checkDuplicates = () => checkForDuplicates(flagLayers.value);
    win.resetCenteredFlags = resetCenteredFlags;
    win.returnToOriginal = (flagKey: string) => returnFlagToOriginalPosition(flagKey);
    win.getCurrentCentered = () => currentCenteredFlag.value;
    win.testTimeColor = (hour: number, minute: number = 0, second: number = 0) => {
        const skyData = getSkyColors(hour, minute, second);
        console.log(`時刻 ${hour}:${minute.toString().padStart(2, '0')}:${second.toString().padStart(2, '0')} の空:`, skyData);
        console.log('色配列:', skyData.colors);
        return skyData;
    };
    // 特定の時刻の背景をプレビュー
    win.previewTimeBackground = (hour: number, minute: number = 0, second: number = 0) => {
        const skyData = getSkyColors(hour, minute, second);
        const { type, colors } = skyData;

        let testGradient = '';
        switch (type) {
            case 'sunrise':
                testGradient = `linear-gradient(0deg, ${colors[3]} 0%, ${colors[2]} 25%, ${colors[1]} 65%, ${colors[0]} 100%)`;
                break;
            case 'sunset':
                testGradient = `linear-gradient(180deg, ${colors[0]} 0%, ${colors[1]} 30%, ${colors[2]} 65%, ${colors[3]} 100%)`;
                break;
            default:
                testGradient = `linear-gradient(180deg, ${colors[0]} 0%, ${colors[1]} 40%, ${colors[2]} 70%, ${colors[3]} 100%)`;
        }

        console.log(`${hour}:${minute}:${second} (${type}) の背景をプレビュー中...`);
        console.log('グラデーション:', testGradient);

        // 5秒後に現在時刻に戻す
        setTimeout(() => {
            console.log('現在時刻の背景に戻しました');
        }, 5000);
    };
}

// Nuxt3 + TypeScript setup
interface FlagLayer {
    radius: number;
    rotationSpeed: number;
    flags: Country[];
    direction: string;
}

// メタデータ
useHead({
    title: 'Cultural Sharing Platform',
    meta: [
        { name: 'description', content: '世界の文化を共有するプラットフォーム' }
    ]
});
</script>

<style scoped>
.cultural-platform-container {
    position: relative;
    width: 100%;
    height: 100vh;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    font-family: 'Helvetica Neue', Arial, sans-serif;
    padding: 0;
    margin: 0;
}

.reflesh-btn {
    position: absolute;
    top: 20px;
    right: 20px;
    z-index: 1000;
}

.reflesh-btn:hover {
    transform: scale(1.1);
}

/* 背景グラデーション - より自然で複雑な変化 */
.background-gradient {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    animation: naturalSkyShift 45s ease-in-out infinite;
    z-index: 0;
    transition: background 4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
    /* より自然なトランジション */
}

@keyframes naturalSkyShift {

    0%,
    100% {
        opacity: 1;
        filter: brightness(1) saturate(1) hue-rotate(0deg);
        transform: scale(1);
    }

    15% {
        opacity: 0.98;
        filter: brightness(1.02) saturate(1.05) hue-rotate(2deg);
        transform: scale(1.002);
    }

    30% {
        opacity: 0.95;
        filter: brightness(1.08) saturate(1.15) hue-rotate(3deg);
        transform: scale(1.005);
    }

    45% {
        opacity: 0.93;
        filter: brightness(0.98) saturate(0.98) hue-rotate(-1deg);
        transform: scale(1.003);
    }

    60% {
        opacity: 0.96;
        filter: brightness(1.05) saturate(1.08) hue-rotate(1deg);
        transform: scale(1.001);
    }

    75% {
        opacity: 0.94;
        filter: brightness(0.96) saturate(0.94) hue-rotate(-2deg);
        transform: scale(1.004);
    }

    90% {
        opacity: 0.97;
        filter: brightness(1.03) saturate(1.02) hue-rotate(1deg);
        transform: scale(1.002);
    }
}

/* メインコンテンツ領域 */
.main-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100vh;
    width: 100vw;
    position: relative;
    z-index: 1;
    padding: 20px;
    box-sizing: border-box;
}

/* タイトルセクション */
.title-section {
    position: absolute;
    top: 5vh;
    left: 50%;
    transform: translateX(-50%);
    text-align: center;
    z-index: 10;
    width: 90%;
    max-width: 600px;
}

.main-title {
    font-size: clamp(1.5rem, 4vw, 2.5rem);
    font-weight: 700;
    color: #4a5568;
    margin-bottom: 10px;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    animation: titleFadeIn 1s ease-out;
}

.subtitle {
    font-size: clamp(0.8rem, 2.5vw, 1.2rem);
    color: #718096;
    margin: 0;
    animation: titleFadeIn 1s ease-out 0.5s both;
}

.time-debug {
    font-size: 0.9rem;
    color: #4a5568;
    margin-top: 8px;
    opacity: 0.8;
}

@keyframes titleFadeIn {
    from {
        opacity: 0;
        transform: translateY(20px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}

/* メインアニメーション領域 */
.main-animation-area {
    position: relative;
    width: min(90vw, 90vh, 800px);
    height: min(90vw, 90vh, 800px);
    margin-top: 10vh;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 0;
}

/* 中央のサイトロゴ（固定） */
.site-logo {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 1;
    width: clamp(80px, 12vw, 140px);
    height: clamp(80px, 12vw, 140px);
    display: flex;
    align-items: center;
    justify-content: center;
}

.logo-circle {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 3px solid rgba(255, 255, 255, 0.8);
    animation: logoGlow 3s ease-in-out infinite;
}

.logo-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 50%;
}

@keyframes logoGlow {

    0%,
    100% {
        transform: scale(1);
        box-shadow: 0 8px 32px rgba(102, 126, 234, 0.3);
    }

    50% {
        transform: scale(1.05);
        box-shadow: 0 12px 40px rgba(102, 126, 234, 0.5);
    }
}

/* 国旗コンテナ */
.flags-container {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 2;
}

/* レイヤー */
.flag-layer {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 100%;
    height: 100%;
    pointer-events: none;
    z-index: 3;
}

/* 国旗の軌道 */
.flag-orbit {
    position: absolute;
    top: 50%;
    left: 50%;
    width: clamp(35px, 6vw, 60px);
    height: clamp(35px, 6vw, 60px);
    transform-origin: 50% 50%;
    transform: translate(-50%, -50%) rotate(var(--initial-angle)) translate(var(--layer-radius), 0) rotate(calc(-1 * var(--initial-angle)));
    animation: rotateOrbit var(--rotation-duration, 20s) linear infinite;
    animation-direction: var(--rotation-direction, normal);
    pointer-events: auto;
    z-index: 5;
}

/* クリック時のアニメーション */
.flag-orbit.flag-moving-to-center {
    animation-play-state: paused;
    z-index: 50;
    position: relative;
}

.flag-orbit.flag-moving-to-center .flag-circle {
    animation: flagMoveToCenter 1.5s ease-in-out forwards;
    z-index: 51;
    position: relative;
}

@keyframes flagMoveToCenter {
    0% {
        /* transform: translate(0, 0) scale(1); */
        transform: translate(0, 0);
        opacity: 1;
    }

    100% {
        /* transform: translate(var(--move-x, 0px), var(--move-y, 0px)) scale(0.7); */
        transform: translate(var(--move-x, 0px), var(--move-y, 0px));
        opacity: 0.9;
        box-shadow: 0 8px 20px rgba(252, 182, 159, 0.6);
    }
}

/* 中央で固定表示されるスタイル */
.flag-orbit.flag-centered {
    z-index: 100;
    animation-play-state: paused;
    position: relative;
}

.flag-orbit.flag-centered .flag-circle {
    /* transform: translate(var(--move-x, 0px), var(--move-y, 0px)) scale(0.7); */
    transform: translate(var(--move-x, 0px), var(--move-y, 0px));
    opacity: 0.9;
    box-shadow: 0 8px 20px rgba(252, 182, 159, 0.6);
    border: 2px solid rgba(255, 255, 255, 1);
    z-index: 101;
    position: relative;
}

/* 元の位置に戻るアニメーション */
.flag-orbit.flag-returning {
    z-index: 80;
    animation-play-state: paused;
    position: relative;
}

.flag-orbit.flag-returning .flag-circle {
    animation: flagReturnToOriginal 1.2s ease-in-out forwards;
    z-index: 81;
    position: relative;
}

@keyframes flagReturnToOriginal {
    0% {
        /* transform: translate(var(--move-x, 0px), var(--move-y, 0px)) scale(0.7); */
        transform: translate(var(--move-x, 0px), var(--move-y, 0px));
        opacity: 0.9;
        box-shadow: 0 8px 20px rgba(252, 182, 159, 0.6);
    }

    100% {
        /* transform: translate(0, 0) scale(1); */
        transform: translate(0, 0);
        opacity: 1;
        box-shadow: 0 6px 20px rgba(252, 182, 159, 0.4);
    }
}

.flag-circle {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    /* background: linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%); */
    display: flex;
    align-items: center;
    justify-content: center;
    /* box-shadow: 0 6px 20px rgba(252, 182, 159, 0.4); */
    /* border: 2px solid rgba(255, 255, 255, 0.9); */
    transition: transform 0.3s ease, box-shadow 0.3s ease;
    cursor: pointer;
    pointer-events: auto;
    position: relative;
    z-index: 6;
}

.flag-circle:hover {
    transform: scale(1.15);
    box-shadow: 0 8px 25px rgba(252, 182, 159, 0.6);
}

.flag-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
    border: 2px solid rgba(255, 255, 255, 0.8);
    pointer-events: auto;
    cursor: pointer;
}

@keyframes flagFloat {

    0%,
    100% {
        transform: translateY(0);
    }

    50% {
        transform: translateY(-3px);
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

/* 極小画面対応 (< 400px) */
@media (max-width: 400px) {
    .main-content {
        padding: 10px;
    }

    .title-section {
        top: 3vh;
    }

    .main-animation-area {
        margin-top: 8vh;
        width: min(95vw, 95vh, 350px);
        height: min(95vw, 95vh, 350px);
    }
}

/* 横向きモバイル対応 */
@media (max-height: 500px) and (orientation: landscape) {
    .title-section {
        top: 2vh;
    }

    .main-title {
        font-size: clamp(1rem, 3vw, 1.8rem);
        margin-bottom: 5px;
    }

    .subtitle {
        font-size: clamp(0.7rem, 2vw, 1rem);
    }

    .main-animation-area {
        margin-top: 5vh;
        width: min(80vw, 80vh, 400px);
        height: min(80vw, 80vh, 400px);
    }
}
</style>