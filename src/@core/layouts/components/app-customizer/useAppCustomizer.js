import { ref } from '@vue/composition-api'
import useAppConfig from '@core/app-config/useAppConfig'

export default function useAppCustomizer() {
  // Customizer
  const isCustomizerOpen = ref(false)

  // Skin
  const skinOptions = [
    { text: 'روشن', value: 'light' },
    { text: 'حاشیه دار', value: 'bordered' },
    { text: 'تاریک', value: 'dark' },
    { text: 'تاریک روشن', value: 'semi-dark' },
  ]

  // Content Width Options
  const contentWidthOptions = [
    { text: 'تمام عرض', value: 'full' },
    { text: 'جعبه ای', value: 'boxed' },
  ]

  // Router Transition
  const routerTransitionOptions = [
    { title: 'بزرگنمایی محو شونده', value: 'zoom-fade' },
    { title: 'محو شونده', value: 'fade' },
    { title: 'محو شونده پایین', value: 'fade-bottom' },
    { title: 'محو شونده کنار', value: 'slide-fade' },
    { title: 'بزرگنمایی خارج', value: 'zoom-out' },
    { title: 'بدون انیمیشن', value: 'none' },
  ]

  // Router Transition
  const layoutTypeOptions = [
    { text: 'عمودی', value: 'vertical' },
    { text: 'افقی', value: 'horizontal' },
  ]

  // Navbar
  const navbarColors = ['', 'primary', 'secondary', 'success', 'danger', 'warning', 'info', 'dark']

  // Navbar Types
  const navbarTypes = [
    { text: 'شناور', value: 'floating' },
    { text: 'چسبان', value: 'sticky' },
    { text: 'ثابت', value: 'static' },
    { text: 'مخفی', value: 'hidden' },
  ]

  // Footer Types
  const footerTypes = [
    { text: 'چسبان', value: 'sticky' },
    { text: 'ثابت', value: 'static' },
    { text: 'مخفی', value: 'hidden' },
  ]

  // eslint-disable-next-line object-curly-newline
  const {
    isRTL,
    skin,
    contentWidth,
    routerTransition,
    layoutType,
    isNavMenuHidden,
    isVerticalMenuCollapsed,
    navbarBackgroundColor,
    navbarType,
    footerType,
  } = useAppConfig()

  return {
    // Customizer
    isCustomizerOpen,

    // Vertical Menu
    isVerticalMenuCollapsed,

    // Skin
    skin,
    skinOptions,

    // Content Width
    contentWidth,
    contentWidthOptions,

    // RTL
    isRTL,

    // routerTransition
    routerTransition,
    routerTransitionOptions,

    // Layout Type
    layoutType,
    layoutTypeOptions,

    // NavMenu Hidden
    isNavMenuHidden,

    // Navbar
    navbarColors,
    navbarTypes,
    navbarBackgroundColor,
    navbarType,

    // Footer
    footerTypes,
    footerType,
  }
}
