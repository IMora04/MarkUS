const brandPrimary = '#be0f2e' // Granate US. rgba(190,15,46,255)
const brandPrimaryDisabled = `${brandPrimary}a8`
const brandPrimaryTap = '#AA001A' //  Granate US más oscuro
const brandSecondary = '#feca1b' // Amarillo US. rgba(254,202,27,255)
const brandSecondaryTap = '#EAB607' // amarillo US más oscuro
const brandSecondaryDisabled = `${brandSecondary}a8`
const brandSuccess = '#95be05' // verde US
const brandSuccessDisabled = `${brandSuccess}a8`
const brandSuccessTap = '#95be05' // verde US
const brandBackground = 'rgb(242, 242, 242)' // gris claro
const brandBlue = '#648a9f'
const brandBlueTap = '#648a9f'
const brandGreen = '#059f94'
const brandGreenTap = '#059f94'

const appWhiteTap = '#fafafa'
const appBlue = '#449DD1'
const appBlueTap = '#2877a4'
const appGreen = '#65B891'
const appGreenTap = '#408c69'
const appPurple = '#8641f4'
const appRed = '#F06543'
const appRedTap = '#bd320f'
const flashStyle = { paddingTop: 50, fontSize: 20 }
const flashTextStyle = { fontSize: 18 }

const navigationTheme = {
  dark: false,
  colors: {
    primary: brandSecondary,
    background: brandBackground,
    card: brandPrimary,
    text: '#ffffff',
    border: `${brandPrimary}99`,
    notification: `${brandSecondaryTap}ff` // badge
  }
}

export { navigationTheme, appPurple, appWhiteTap, appRed, appRedTap, appBlue, appBlueTap, appGreen, appGreenTap, brandPrimary, brandPrimaryTap, brandSecondary, brandSecondaryTap, brandSecondaryDisabled, brandSuccess, brandSuccessDisabled, brandSuccessTap, brandBackground, brandBlue, brandBlueTap, brandGreen, brandGreenTap, flashStyle, flashTextStyle, brandPrimaryDisabled }
