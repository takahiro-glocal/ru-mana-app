<template>
  <!-- <div class="tw-min-h-screen tw-bg-[#F9F5E7]"> -->
    <!-- <SettingsHeader title="ポイント" /> -->
    <!-- <div class="tw-p-6 tw-max-w-md tw-mx-auto"> -->
      <div class="tw-bg-gradient-to-br tw-from-[#FFD700] tw-to-[#FDB931] tw-rounded-3xl tw-p-8 tw-text-white tw-shadow-lg tw-mb-6 tw-relative tw-overflow-hidden">
        <div class="tw-absolute tw-top-[-20%] tw-right-[-20%] tw-w-40 tw-h-40 tw-bg-white tw-rounded-full tw-opacity-20"></div>
        <h3 class="tw-font-bold tw-opacity-90 tw-mb-1">現在の保有ポイント</h3>
        <div class="tw-text-5xl tw-font-black">1,250 <span class="tw-text-xl">pt</span></div>
      </div>

      <div class="tw-bg-white tw-rounded-3xl tw-p-6 tw-shadow-sm">
        <h3 class="tw-font-bold tw-text-gray-700 tw-mb-4">ポイント履歴</h3>
        <ul class="tw-space-y-4">
          <li v-for="i in 5" :key="i" class="tw-flex tw-justify-between tw-items-center tw-pb-4 tw-border-b tw-border-gray-50 last:tw-border-0">
            <div>
              <p class="tw-text-sm tw-font-bold tw-text-gray-600">スレッド投稿</p>
              <p class="tw-text-xs tw-text-gray-400">2025/02/{{ 20 - i }}</p>
            </div>
            <span class="tw-font-bold tw-text-[#85C441]">+10 pt</span>
          </li>
        </ul>
      </div>
    <!-- </div> -->
  <!-- </div> -->
</template>