// Type declarations for packages without type definitions

declare module 'lucide-react' {
  import { FC, SVGProps } from 'react';
  export interface IconProps extends SVGProps<SVGSVGElement> {
    size?: string | number;
    color?: string;
    strokeWidth?: string | number;
  }
  
  export const Heart: FC<IconProps>;
  export const ShoppingCart: FC<IconProps>;
  export const Search: FC<IconProps>;
  export const User: FC<IconProps>;
  export const Menu: FC<IconProps>;
  export const X: FC<IconProps>;
  export const ChevronRight: FC<IconProps>;
  export const ChevronLeft: FC<IconProps>;
  export const Plus: FC<IconProps>;
  export const Minus: FC<IconProps>;
  export const Trash: FC<IconProps>;
  export const Check: FC<IconProps>;
  export const Upload: FC<IconProps>;
  export const Image: FC<IconProps>;
  export const Star: FC<IconProps>;
  export const StarHalf: FC<IconProps>;
  export const Calendar: FC<IconProps>;
  export const Clock: FC<IconProps>;
  export const MapPin: FC<IconProps>;
  export const Phone: FC<IconProps>;
  export const Mail: FC<IconProps>;
  export const Globe: FC<IconProps>;
  export const Facebook: FC<IconProps>;
  export const Twitter: FC<IconProps>;
  export const Instagram: FC<IconProps>;
  export const Linkedin: FC<IconProps>;
  export const Youtube: FC<IconProps>;
  // Add more icons as needed
}

declare module 'framer-motion' {
  import * as React from 'react';
  
  export interface AnimatePresenceProps {
    children?: React.ReactNode;
    initial?: boolean;
    exitBeforeEnter?: boolean;
    onExitComplete?: () => void;
  }
  
  export interface MotionProps {
    initial?: any;
    animate?: any;
    exit?: any;
    transition?: any;
    variants?: any;
    whileHover?: any;
    whileTap?: any;
    layoutId?: string;
    layout?: boolean | string;
    className?: string;
    style?: React.CSSProperties;
    [key: string]: any;
  }
  
  export const motion: {
    div: React.FC<MotionProps & React.HTMLAttributes<HTMLDivElement>>;
    span: React.FC<MotionProps & React.HTMLAttributes<HTMLSpanElement>>;
    button: React.FC<MotionProps & React.ButtonHTMLAttributes<HTMLButtonElement>>;
    a: React.FC<MotionProps & React.AnchorHTMLAttributes<HTMLAnchorElement>>;
    ul: React.FC<MotionProps & React.HTMLAttributes<HTMLUListElement>>;
    li: React.FC<MotionProps & React.LiHTMLAttributes<HTMLLIElement>>;
    img: React.FC<MotionProps & React.ImgHTMLAttributes<HTMLImageElement>>;
    // Add more HTML elements as needed
  };
  
  export const AnimatePresence: React.FC<AnimatePresenceProps>;
  
  export function useAnimation(): any;
  export function useMotionValue(initialValue: number): any;
  export function useTransform(value: any, input: number[], output: any[]): any;
  export function useViewportScroll(): { scrollY: any };
}

declare module 'sonner' {
  import * as React from 'react';
  
  export interface ToasterProps {
    position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'top-center' | 'bottom-center';
    toastOptions?: any;
    theme?: 'light' | 'dark' | 'system';
    richColors?: boolean;
    expand?: boolean;
    visibleToasts?: number;
    closeButton?: boolean;
    offset?: string | number;
    dir?: 'auto' | 'ltr' | 'rtl';
    hotkey?: string[];
    className?: string;
    style?: React.CSSProperties;
    invert?: boolean;
  }
  
  export interface ToastOptions {
    id?: string;
    icon?: React.ReactNode;
    description?: React.ReactNode;
    action?: React.ReactNode;
    cancel?: React.ReactNode;
    onDismiss?: (id: string) => void;
    onAutoClose?: (id: string) => void;
    duration?: number;
    className?: string;
    style?: React.CSSProperties;
    position?: ToasterProps['position'];
    important?: boolean;
    dismissible?: boolean;
    promise?: Promise<any>;
  }
  
  export function Toaster(props: ToasterProps): JSX.Element;
  
  export const toast: {
    (message: React.ReactNode, options?: ToastOptions): string;
    success(message: React.ReactNode, options?: ToastOptions): string;
    error(message: React.ReactNode, options?: ToastOptions): string;
    warning(message: React.ReactNode, options?: ToastOptions): string;
    info(message: React.ReactNode, options?: ToastOptions): string;
    loading(message: React.ReactNode, options?: ToastOptions): string;
    promise<T>(
      promise: Promise<T>,
      options: {
        loading: React.ReactNode;
        success: React.ReactNode | ((data: T) => React.ReactNode);
        error: React.ReactNode | ((error: any) => React.ReactNode);
      } & ToastOptions
    ): Promise<T>;
    dismiss(id?: string): void;
    update(
      id: string,
      message: React.ReactNode,
      options?: ToastOptions
    ): void;
    custom(
      message: React.ReactNode,
      options?: ToastOptions
    ): string;
    default(
      message: React.ReactNode,
      options?: ToastOptions
    ): string;
  };
}
