import { translate } from "utils/utils"

export const languageOptions = [
    {
        id: 1,
        label: 'العربية',
        value: 'ar'
    },
    {
        id: 2,
        label: 'Français',
        value: 'fr'
    },
    {
        id: 3,
        label: 'English',
        value: 'en'
    }
]

export const darkModeOptions = [
    {
        id: 1,
        label: translate('Always light'),
        value: 'light'
    },
    {
        id: 2,
        label: translate('Always dark'),
        value: 'dark'
    },
    {
        id: 3,
        label: translate('Let client decide'),
        value: 'auto'
    }
]

