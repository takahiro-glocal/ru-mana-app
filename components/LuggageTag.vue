<template>
    <div ref="luggageTagRef" class="luggage-tag" :style="style">
        <div ref="upperSectionRef" class="tag-section upper"
            :class="{ 'torn-top': isUpperTorn, 'fade-out': isUpperFaded }">
            <img src="/images/rmp_luggage_main.png" alt="Luggage Tag Main">
            <div class="country-info">
                <div class="flag-container" :class="`fi fi-${country.flag}`"></div>
                <div class="country-name">{{ country.name }}</div>
                <div class="country-name-eng">{{ country.nameEng }}</div>
            </div>
        </div>

        <div ref="middleSectionRef" class="tag-section middle"
            :class="{ 'torn-middle': isMiddleTorn, 'fade-out': isMiddleFaded }" @click="handleMiddleClick">
            <img src="/images/rmp_luggage_ticket1.png" alt="Ticket 1">
            <div class="ticket-text-container">
                <span class="ticket-text">{{ $t('luggageTag.menu1') }}</span>
            </div>
        </div>

        <div ref="lowerSectionRef" class="tag-section lower"
            :class="{ 'torn-bottom': isLowerTorn, 'fade-out': isLowerFaded }" @click="handleLowerClick">
            <img src="/images/rmp_luggage_ticket2.png" alt="Ticket 2">
            <div class="ticket-text-container">
                <span class="ticket-text">{{ $t('luggageTag.menu2') }}</span>
            </div>
        </div>
    </div>

    <div v-if="centerImageSrc" class="center-appear">
        <img src="/images/rmp_luggage_main.png" alt="Luggage Tag Main" class="main-tag-image">

        <div class="country-info">
            <div class="flag-container" :class="`fi fi-${country.flag}`"></div>
            <div class="country-name">{{ country.name }}</div>
            <div class="country-name-eng">{{ country.nameEng }}</div>
        </div>

        <img :src="centerImageSrc" alt="Selected Ticket" class="selected-ticket">
            <div class="ticket-text-container">
                <span class="ticket-text">{{ centerText }}</span>
            </div>
        </img>
    </div>
</template>

<script setup lang="ts">
import "/node_modules/flag-icons/css/flag-icons.min.css";
const { t } = useI18n()

interface Props {
    country: Country;
    width?: string | number;
    height?: string | number;
}

const props = defineProps<Props>();

const emit = defineEmits(['clickTicket'])

// refs
const luggageTagRef = ref<HTMLElement>()

// reactive states
const isUpperTorn = ref<boolean>(false)
const isMiddleTorn = ref<boolean>(false)
const isLowerTorn = ref<boolean>(false)
const isUpperFaded = ref<boolean>(false)
const isMiddleFaded = ref<boolean>(false)
const isLowerFaded = ref<boolean>(false)
const centerText = ref<string>('')
const centerImageSrc = ref<string>('')

// 中部クリック処理
const handleMiddleClick = async (): Promise<void> => {
    if (isMiddleTorn.value) return

    if (luggageTagRef.value) {
        luggageTagRef.value.style.animation = 'shake 0.1s ease-in-out 3'
    }

    setTimeout(() => {
        isMiddleTorn.value = true
        isLowerTorn.value = true

        setTimeout(() => {
            isUpperFaded.value = true

            emit('clickTicket', 'greeting')

            // 修正: パスから /public を削除
            // centerText.value = '国の文化を知る'
            // centerImageSrc.value = '/images/rmp_luggage_ticket1.png'
        }, 800)
    }, 200)
}

// 下部クリック処理
const handleLowerClick = async (): Promise<void> => {
    if (isLowerTorn.value) return

    if (luggageTagRef.value) {
        luggageTagRef.value.style.animation = 'shake 0.1s ease-in-out 3'
    }

    setTimeout(() => {
        isLowerTorn.value = true

        setTimeout(() => {
            isUpperFaded.value = true
            isMiddleFaded.value = true

            emit('clickTicket', 'quiz')

            // 修正: パスから /public を削除
            // centerText.value = 'クイズに挑戦する'
            // centerImageSrc.value = '/images/rmp_luggage_ticket2.png'
        }, 800)
    }, 200)
}

const style = computed(() => {
    let result = ''
    if (props.height) result += `width: ${props.height};`
    if (props.width) result += `width: ${props.width};`
    return result
})
</script>

<style scoped>
.luggage-tag {
    width: 100%;
    height: auto;
    position: relative;
    /* box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15); */
    /* border-radius: 8px; */
    overflow: visible;
}

.tag-section {
    position: relative;
    line-height: 0;
    padding: 0;
    margin: 0;
    transition: all 0.3s ease;
}

.tag-section img {
    width: 100%;
    height: auto;
    display: block;
}

/* 既存の .middle, .lower スタイルに追記 */
.middle,
.lower {
    cursor: pointer;
    /* この行を追加して上の要素との隙間を埋めます */
    margin-top: -1px;
}

.middle:hover,
.lower:hover {
    transform: scale(1.02);
    /* box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2); */
}

/* ▼▼▼ ここから追加 ▼▼▼ */
.tag-section .ticket-text-container {
    position: absolute;
    top: 50%;
    left: 38%;
    /* アイコンを避けて右側に配置 */
    transform: translateY(-50%);
    width: 58%;
    /* テキスト表示領域の幅 */
    display: flex;
    align-items: center;
    z-index: 3;
    pointer-events: none;
    /* テキスト部分ではクリックイベントが発生しないようにする */
}

.center-appear .ticket-text-container {
    position: absolute;
    top: 80%;
    left: 38%;
    /* アイコンを避けて右側に配置 */
    transform: translateY(-50%);
    width: 58%;
    /* テキスト表示領域の幅 */
    display: flex;
    align-items: center;
    z-index: 3;
    pointer-events: none;
    /* テキスト部分ではクリックイベントが発生しないようにする */
}

.ticket-text {
    color: #333;
    font-weight: bold;
    font-size: 0.9em;
}

/* ▲▲▲ ここまで追加 ▲▲▲ */

.torn-top {
    animation: tearAwayTop 0.8s ease-in-out forwards;
}

.torn-middle {
    animation: tearAwayMiddle 0.8s ease-in-out forwards;
}

.torn-bottom {
    animation: tearAwayBottom 0.8s ease-in-out forwards;
}

.fade-out {
    animation: fadeOut 0.8s ease-in-out 0.8s forwards;
}

.center-appear {
    position: fixed;
    top: 50%;
    left: 50%;
    /* transformはanimation側で指定 */
    z-index: 20;
    opacity: 0;
    animation: appearCenter 1s ease-in-out 0.8s forwards;
    /* display: grid から positionベースの配置に変更 */
    width: 350px;
    /* ベースとなるタグの横幅を指定 */
    height: auto;
}

/* 背景のタグ画像用のスタイル */
.main-tag-image {
    width: 100%;
    height: auto;
}

/* ▼▼▼ 変更箇所 ▼▼▼ */
.tag-section .country-info {
    width: 100%;
    /* テキストが見切れないように幅を調整 */
    position: absolute;
    top: 73%;
    left: 50%;
    transform: translate(-50%, -50%);
    display: flex;
    /* Flexbox を使用 */
    flex-direction: column;
    /* 要素を縦に並べる */
    align-items: center;
    /* 要素を中央揃えにする */
    gap: 5px;
    /* 要素間の余白を追加 */
    text-align: center;
    z-index: 3;
    line-height: 1.2;
    /* 行の高さを調整 */
}

.center-appear .country-info {
    width: 100%;
    /* テキストが見切れないように幅を調整 */
    position: absolute;
    top: 61%;
    left: 50%;
    transform: translate(-50%, -50%);
    display: flex;
    /* Flexbox を使用 */
    flex-direction: column;
    /* 要素を縦に並べる */
    align-items: center;
    /* 要素を中央揃えにする */
    gap: 5px;
    /* 要素間の余白を追加 */
    text-align: center;
    z-index: 3;
    line-height: 1.2;
    /* 行の高さを調整 */
}

.country-name,
.country-name-eng {
    width: 100%;
    color: #333;
    /* 文字色を少し濃くする */
    font-weight: bold;
    z-index: 2;
}

.country-name-eng {
    font-size: 0.9em;
    font-weight: normal;
    /* 英語名は通常の太さに */
}


.tag-section .flag-container {
    z-index: 2;
    /* チケットより手前に表示 */
    width: 100px;
    height: 80px;
}

/* 国旗を配置するコンテナのスタイル（修正） */
/* position:absolute を削除し、Flexboxで配置されるように修正 */
.center-appear .flag-container {
    z-index: 2;
    /* 国旗のサイズに合わせて調整してください */
    width: 70px;
    height: 50px;
}

/* ▲▲▲ 変更箇所 ▲▲▲ */


/* 選択されたチケット用のスタイル（追加） */
.selected-ticket {
    position: absolute;
    left: 50%;
    top: 80%;
    /* 中央よりやや下に配置 */
    transform: translate(-50%, -50%);
    width: 85%;
    /* 横幅を少し小さくする */
    height: auto;
    z-index: 1;
    /* 国旗より後ろに表示 */
}

@keyframes tearAwayTop {
    0% {
        transform: translateY(0) rotate(0deg);
        opacity: 1;
    }

    50% {
        transform: translateY(-20px) rotate(3deg);
        opacity: 0.8;
    }

    100% {
        transform: translateY(-150px) rotate(8deg);
        opacity: 0;
    }
}

@keyframes tearAwayMiddle {
    0% {
        transform: translateY(0) rotate(0deg);
        opacity: 1;
    }

    50% {
        transform: translateY(20px) rotate(-2deg);
        opacity: 0.8;
    }

    100% {
        transform: translateY(150px) rotate(-6deg);
        opacity: 0;
    }
}

@keyframes tearAwayBottom {
    0% {
        transform: translateY(0) rotate(0deg);
        opacity: 1;
    }

    50% {
        transform: translateY(20px) rotate(-2deg);
        opacity: 0.8;
    }

    100% {
        transform: translateY(150px) rotate(-6deg);
        opacity: 0;
    }
}

@keyframes fadeOut {
    0% {
        opacity: 1;
    }

    100% {
        opacity: 0;
    }
}

@keyframes appearCenter {
    0% {
        opacity: 0;
        transform: translate(-50%, -50%) scale(0.3);
    }

    100% {
        opacity: 1;
        transform: translate(-50%, -50%) scale(1);
    }
}

@keyframes shake {

    0%,
    100% {
        transform: translateX(0);
    }

    25% {
        transform: translateX(-1px);
    }

    75% {
        transform: translateX(1px);
    }
}
</style>