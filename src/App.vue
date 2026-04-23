<template>
  <router-view />
</template>

<script setup>
// JOSP-novelCharacterVue3
</script>

<style>
/* ================================================
   Ferrari Design System — Global CSS Variables
   ================================================ */
:root {
  /* Primary CTA */
  --f-color-accent-100: #DA291C;
  --f-color-accent-90:  #B01E0A;
  --f-color-accent-80:  #9D2211;

  /* Surface — Light */
  --f-color-ui-0:       #FFFFFF;

  /* Surface — Dark */
  --f-color-black:       #000000;
  --f-color-ui-90:       #303030;

  /* Neutrals */
  --f-color-ui-20:       #D2D2D2;
  --f-color-black-60:    #666666;
  --f-color-black-50:    #8F8F8F;
  --f-color-black-55:    #969696;

  /* Text on light / dark */
  --f-color-text-light:  #181818;
  --f-color-text-dark:   #FFFFFF;

  /* Semantic */
  --f-color-success:     #03904A;
  --f-color-warning:     #F13A2C;
  --f-color-info:        #4C98B9;
  --f-color-link-hover:  #3860BE;

  /* Interaction */
  --f-color-btn-hover:   #1EAEDB;

  /* Border */
  --f-color-border:      #CCCCCC;

  /* Shadows (rare — only for cookie/modals) */
  --shadow-whisper: 1px 1px 1px 0px rgba(153,153,153,0.4);
  --shadow-overlay: hsla(0, 0%, 7%, 0.8);

  /* Spacing base unit: 8px */
  --sp-1:  1px;
  --sp-2:  2px;
  --sp-4:  4px;
  --sp-5:  5px;
  --sp-6:  6px;
  --sp-8:  8px;
  --sp-10: 10px;
  --sp-12: 12px;
  --sp-13: 13px;
  --sp-14: 14px;
  --sp-15: 15px;
  --sp-16: 16px;
  --sp-20: 20px;
  --sp-24: 24px;
  --sp-25: 25px;
  --sp-30: 30px;
  --sp-32: 32px;
  --sp-40: 40px;
  --sp-48: 48px;
  --sp-60: 60px;
  --sp-80: 80px;

  /* Border radius */
  --radius-micro: 1px;
  --radius-default: 2px;
  --radius-dialog: 8px;

  /* Typography */
  --font-ferrari: 'Arial', 'Helvetica', sans-serif;
  --font-body: 'Arial', 'Helvetica', sans-serif;

  /* Button padding */
  --btn-pad-v: 12px;
  --btn-pad-h: 10px;

  /* Max content width */
  --max-w: 1280px;
}

/* ================================================
   Global Resets & Base
   ================================================ */
*, *::before, *::after {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html {
  scroll-behavior: smooth;
}

body {
  font-family: var(--font-ferrari);
  font-size: 16px;
  color: var(--f-color-text-light);
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  background: var(--f-color-black);
}

::selection {
  background: var(--f-color-accent-100);
  color: var(--f-color-text-dark);
}

/* ================================================
   Ferrari Typography Helpers
   ================================================ */
.label-upper {
  font-family: var(--font-body);
  font-size: 12px;
  font-weight: 400;
  letter-spacing: 1px;
  text-transform: uppercase;
  color: var(--f-color-black-50);
}

.label-micro {
  font-family: var(--font-body);
  font-size: 11px;
  font-weight: 400;
  letter-spacing: 1px;
  text-transform: uppercase;
  color: var(--f-color-black-50);
}

/* ================================================
   Dark Surface Text — High contrast on black
   WCAG AA: #BFBFBF on #000000 = 11:1
   ================================================ */
.text-ds-primary { color: #FFFFFF; }
.text-ds-secondary { color: #D1D1D1; }
.text-ds-label { color: #BFBFBB; letter-spacing: 1px; text-transform: uppercase; font-size: 11px; }
.text-ds-muted { color: #8F8F8F; }

/* ================================================
   Element Plus — Global Overrides (Ferrari style)
   ================================================ */

/* Buttons */
.el-button {
  border-radius: var(--radius-default) !important;
  border: 1px solid var(--f-color-border) !important;
  font-family: var(--font-ferrari) !important;
  font-size: 14px !important;
  font-weight: 500 !important;
  padding: var(--btn-pad-v) var(--btn-pad-h) !important;
  letter-spacing: 0.5px;
  transition: background 0.15s ease, border-color 0.15s ease, color 0.15s ease, opacity 0.15s ease !important;
  background: var(--f-color-ui-0) !important;
  color: var(--f-color-text-light) !important;
}

/* Primary CTA — Ferrari Red */
.el-button--primary {
  background: var(--f-color-accent-100) !important;
  border-color: var(--f-color-accent-100) !important;
  color: var(--f-color-text-dark) !important;
  font-size: 16px !important;
  letter-spacing: 1.28px !important;
  font-weight: 400 !important;
}
.el-button--primary:hover {
  background: var(--f-color-btn-hover) !important;
  border-color: var(--f-color-btn-hover) !important;
  opacity: 0.9;
}

/* Danger */
.el-button--danger {
  background: var(--f-color-accent-100) !important;
  border-color: var(--f-color-accent-100) !important;
  color: var(--f-color-text-dark) !important;
}
.el-button--danger:hover {
  background: var(--f-color-btn-hover) !important;
  border-color: var(--f-color-btn-hover) !important;
  opacity: 0.9;
}

/* Ghost / text */
.el-button--text,
.el-button.is-text {
  border: none !important;
  background: transparent !important;
  color: var(--f-color-text-dark) !important;
}

/* Sizes */
.el-button--large {
  font-size: 16px !important;
  padding: 14px 16px !important;
}
.el-button--small {
  font-size: 12px !important;
  padding: 8px 10px !important;
}

/* Form Inputs */
.el-input__wrapper,
.el-textarea__inner {
  border-radius: var(--radius-default) !important;
  box-shadow: none !important;
  border: 1px solid var(--f-color-border) !important;
  font-family: var(--font-ferrari) !important;
  font-size: 14px !important;
  color: var(--f-color-text-light) !important;
  background: var(--f-color-ui-0) !important;
}
.el-input__wrapper:focus-within,
.el-textarea__inner:focus {
  border-color: var(--f-color-accent-100) !important;
}
.el-input__wrapper:hover,
.el-textarea__inner:hover {
  border-color: var(--f-color-black-50) !important;
}
.el-input__inner {
  font-family: var(--font-ferrari) !important;
  color: var(--f-color-text-light) !important;
}
.el-input__inner::placeholder {
  color: var(--f-color-black-55) !important;
}

/* Select */
.el-select .el-input__wrapper {
  border-radius: var(--radius-default) !important;
}

/* Radio */
.el-radio__inner {
  border-radius: var(--radius-micro) !important;
  border-color: var(--f-color-border) !important;
}
.el-radio__input.is-checked .el-radio__inner {
  background: var(--f-color-accent-100) !important;
  border-color: var(--f-color-accent-100) !important;
}
.el-radio__label {
  font-family: var(--font-ferrari) !important;
  font-size: 14px !important;
}

/* Checkbox */
.el-checkbox__inner {
  border-radius: var(--radius-micro) !important;
  border-color: var(--f-color-border) !important;
}
.el-checkbox__input.is-checked .el-checkbox__inner {
  background: var(--f-color-accent-100) !important;
  border-color: var(--f-color-accent-100) !important;
}

/* Tags */
.el-tag {
  border-radius: var(--radius-default) !important;
  border: 1px solid var(--f-color-ui-20) !important;
  font-family: var(--font-ferrari) !important;
  font-size: 12px !important;
  letter-spacing: 0.5px;
  background: transparent !important;
  color: var(--f-color-black-60) !important;
}
.el-tag--success {
  border-color: var(--f-color-success) !important;
  color: var(--f-color-success) !important;
}
.el-tag--warning {
  border-color: #E6A23C !important;
  color: #E6A23C !important;
}
.el-tag--danger {
  border-color: var(--f-color-warning) !important;
  color: var(--f-color-warning) !important;
}
.el-tag--info {
  border-color: var(--f-color-black-50) !important;
  color: var(--f-color-black-50) !important;
}

/* Cards */
.el-card {
  border-radius: var(--radius-default) !important;
  border: 1px solid var(--f-color-ui-20) !important;
  box-shadow: none !important;
  background: var(--f-color-ui-0) !important;
}
.el-card__header {
  border-bottom: 1px solid var(--f-color-ui-20) !important;
  font-family: var(--font-ferrari) !important;
  font-size: 16px !important;
  font-weight: 600 !important;
  color: var(--f-color-text-light) !important;
  padding: var(--sp-16) var(--sp-20) !important;
}
.el-card__body {
  padding: var(--sp-20) !important;
}

/* Tabs */
.el-tabs__item {
  font-family: var(--font-ferrari) !important;
  font-size: 15px !important;
  font-weight: 500 !important;
  color: var(--f-color-black-50) !important;
}
.el-tabs__item.is-active {
  color: var(--f-color-accent-100) !important;
}
.el-tabs__active-bar {
  background: var(--f-color-accent-100) !important;
  height: 2px !important;
}
.el-tabs__nav-wrap::after {
  display: none !important;
}

/* Pagination */
.el-pagination {
  font-family: var(--font-ferrari) !important;
}
.el-pager li {
  border-radius: var(--radius-default) !important;
  font-family: var(--font-ferrari) !important;
}
.el-pager li.is-active {
  background: var(--f-color-accent-100) !important;
}

/* Rate */
.el-rate__icon {
  font-size: 16px !important;
}

/* Message */
.el-message {
  border-radius: var(--radius-dialog) !important;
  font-family: var(--font-ferrari) !important;
}

/* Dialog / Modal */
.el-dialog {
  border-radius: var(--radius-dialog) !important;
  box-shadow: var(--shadow-whisper) !important;
}
.el-dialog__header {
  font-family: var(--font-ferrari) !important;
  font-weight: 600 !important;
}
.el-overlay {
  background: var(--shadow-overlay) !important;
}

/* Form labels */
.el-form-item__label {
  font-family: var(--font-ferrari) !important;
  font-size: 13px !important;
  font-weight: 600 !important;
  color: var(--f-color-text-light) !important;
  letter-spacing: 0.5px !important;
}

/* Loading */
.el-loading-mask {
  background: rgba(255,255,255,0.9) !important;
}
.el-loading-spinner .circular {
  stroke: var(--f-color-accent-100) !important;
}

/* Empty */
.el-empty__description {
  font-family: var(--font-ferrari) !important;
  color: var(--f-color-black-50) !important;
}

/* Scrollbar */
::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}
::-webkit-scrollbar-track {
  background: var(--f-color-ui-90);
}
::-webkit-scrollbar-thumb {
  background: var(--f-color-black-50);
  border-radius: 3px;
}
::-webkit-scrollbar-thumb:hover {
  background: var(--f-color-black-60);
}

/* Focus visible */
:focus-visible {
  outline: 2px solid var(--f-color-accent-100);
  outline-offset: 2px;
}
</style>
