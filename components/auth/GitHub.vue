<script setup lang="ts">
const authStore = useAuthStore();
const canvasStore = useCanvasStore();

const onGitHubSubmit = async () => {
  await authStore.gitHubSession();
  await canvasStore.setBoard();
};
</script>

<template>
  <UiButton @click="onGitHubSubmit" :variant="'outline'" :disabled="authStore.isLoading" class="w-full gap-2 flex items-center">
    <NuxtImg width="16" height="16" src="/icons/github-mark.svg" />
    GitHub
  </UiButton>
</template>
