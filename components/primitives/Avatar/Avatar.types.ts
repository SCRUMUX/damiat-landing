import React from 'react';

/** Avatar: 3 типа (guest, registered-no-photo, registered-with-photo), 5 размеров (xs, sm, md, lg, xl).
 *  Опциональный badge в правом нижнем углу — вставляется как инстанс <Badge>.
 */

export type AvatarVariant = 'guest' | 'registered-no-photo' | 'registered-with-photo';

export type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

export interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Тип аватара */
  variant?: AvatarVariant;
  /** Размер: xs=24px, sm=32px, md=40px, lg=48px, xl=56px */
  size?: AvatarSize;
  /** Показывать badge (инстанс Badge) в правом нижнем углу */
  showBadge?: boolean;
  /** Кастомный badge-элемент (если не передан — рендерится <Badge> с badgeContent) */
  badge?: React.ReactNode;
  /** Текст/число внутри badge (если badge не передан явно) */
  badgeContent?: React.ReactNode;
  /** Инициалы для registered-no-photo */
  initials?: string;
  /** URL фото для registered-with-photo */
  src?: string;
}
