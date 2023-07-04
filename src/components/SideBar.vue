<template lang="pug">
.sidebar-layout
	.sidebar
		nav
			slot(name="sidebar")
	.sidebar-content
		slot
</template>

<script setup lang="ts"></script>

<style scoped>
.sidebar {
	background-color: var(--color-foreground);
	color: var(--color-background);
}

@media screen and (min-width: 768px) {
	.sidebar-layout {
		display: flex;
		flex-flow: row nowrap;
		justify-content: start;
		align-items: flex-start;
		position: relative;
		min-height: 100vh;
	}

	.sidebar {
		position: sticky;
		top: 0;
		height: 100vh;
		font-size: 1.3em;
	}

	.sidebar nav {
		height: 100%;
		width: max-content;
	}

	.sidebar nav :deep(a:hover) {
		background-color: var(--color-gray);
	}

	.sidebar nav :deep(a.router-link-active) {
		background-color: var(--color-background);
		color: var(--color-foreground);
	}

	.sidebar-content {
		flex-grow: 1;
	}
}

@media screen and (max-width: 768px) {
	.sidebar nav {
		display: flex;
		flex-flow: row wrap;
		background-color: var(--color-accent);
		border-top: 1px solid var(--color-blue);
	}

	.sidebar nav :deep(a:hover) {
		background-color: var(--color-blue-bright);
	}

	.sidebar nav :deep(a.router-link-active) {
		background-color: var(--color-background);
		color: var(--color-accent);
	}
}

.sidebar nav :deep(a) {
	padding: 0.3em 1ch;
	display: block;
	transition: background-color 0.2s ease;
}
</style>
