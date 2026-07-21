export const GA_MEASUREMENT_ID = import.meta.env.VITE_GA_MEASUREMENT_ID ?? ''

export const IS_GA_ENABLED = /^G-[A-Z0-9]+$/i.test(GA_MEASUREMENT_ID)
