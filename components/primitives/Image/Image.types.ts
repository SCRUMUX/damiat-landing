import React from 'react';

/**
 * Image (@UI/Image, Figma node 161:93092)
 *
 * Изображение с aspect ratio, fallback, placeholder и skeleton-анимацией.
 *
 * Оси: layout × size × ratio × state
 *
 * Layout:
 *   image     — стандартное изображение с cornerRadius=4px
 *   hero-full — фоновое изображение на весь экран (1920×1080), без скругления
 *   hero-half — фоновое изображение на полэкрана (960×1080), без скругления
 *
 * Размеры (layout=image):
 *   xs: ширина 120px, cornerRadius=4px — для мобильных карточек
 *   sm: ширина 200px, cornerRadius=4px
 *   md: ширина 320px, cornerRadius=4px
 *   lg: ширина 480px, cornerRadius=4px
 *
 * Соотношения сторон (ratio):
 *   1:1  — квадрат
 *   4:3  — стандарт
 *   16:9 — широкоформатный
 *   3:2  — фото
 *
 * Состояния:
 *   loading — skeleton shimmer (surface-3 + скользящий градиент)
 *   loaded  — показывает <img> object-cover
 *   error   — surface-2 + иконка + текст ошибки
 *   empty   — surface-2 + иконка + placeholder текст
 */
export type ImageLayout = 'image' | 'hero-full' | 'hero-half';

export type ImageSize = 'xs' | 'sm' | 'md' | 'lg';

export type ImageRatio = '1:1' | '4:3' | '16:9' | '3:2';

export type ImageState = 'loading' | 'loaded' | 'error' | 'empty';

export interface ImageProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'children'> {
  /** Тип компоновки */
  layout?: ImageLayout;
  /** Размер (только для layout=image) */
  size?: ImageSize;
  /** Соотношение сторон (только для layout=image) */
  ratio?: ImageRatio;
  /**
   * Состояние:
   *   loading — skeleton shimmer
   *   loaded  — отображает src
   *   error   — иконка + текст ошибки
   *   empty   — иконка + placeholder
   */
  state?: ImageState;
  /** URL изображения (для state=loaded) */
  src?: string;
  /** Alt текст */
  alt?: string;
  /** Текст для state=error (по умолчанию "Failed to load") */
  errorText?: string;
  /** Текст для state=empty (по умолчанию "No image") */
  emptyText?: string;
  /** Иконка для error и empty состояний */
  icon?: React.ReactNode;
  /** onLoad callback */
  onLoad?: () => void;
  /** onError callback */
  onError?: () => void;
}
