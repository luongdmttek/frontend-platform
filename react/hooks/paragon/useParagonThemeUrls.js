const _excluded = ["fileName"],
  _excluded2 = ["fileName"];
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _objectWithoutProperties(e, t) { if (null == e) return {}; var o, r, i = _objectWithoutPropertiesLoose(e, t); if (Object.getOwnPropertySymbols) { var n = Object.getOwnPropertySymbols(e); for (r = 0; r < n.length; r++) o = n[r], -1 === t.indexOf(o) && {}.propertyIsEnumerable.call(e, o) && (i[o] = e[o]); } return i; }
function _objectWithoutPropertiesLoose(r, e) { if (null == r) return {}; var t = {}; for (var n in r) if ({}.hasOwnProperty.call(r, n)) { if (-1 !== e.indexOf(n)) continue; t[n] = r[n]; } return t; }
import { useMemo } from 'react';
import { fallbackThemeUrl, isEmptyObject } from './utils';
import { getConfig } from '../../../config';

/**
 * Replaces a wildcard in the URL string with a provided local version string.
 * This is typically used to substitute a version placeholder (e.g., `$paragonVersion`)
 * in URLs with actual version values.
 *
 * @param {Object} args - The arguments object for version substitution.
 * @param {string} args.url - The URL string that may contain a wildcard keyword (e.g., `$paragonVersion`).
 * @param {string} args.wildcardKeyword - The keyword (e.g., `$paragonVersion`) in the URL to be replaced
 * with the local version.
 * @param {string} args.localVersion - The local version string to replace the wildcard with.
 *
 * @returns {string} The URL with the wildcard keyword replaced by the provided version string.
 * If the conditions are not met (e.g., missing URL or version), the original URL is returned.
 *
 * @example
 * const url = 'https://cdn.example.com/$paragonVersion/theme.css';
 * const version = '1.0.0';
 * const updatedUrl = handleVersionSubstitution({ url, wildcardKeyword: '$paragonVersion', localVersion: version });
 * console.log(updatedUrl); // Outputs: 'https://cdn.example.com/1.0.0/theme.css'
 */
export const handleVersionSubstitution = _ref => {
  let {
    url,
    wildcardKeyword,
    localVersion
  } = _ref;
  if (!url || !url.includes(wildcardKeyword) || !localVersion) {
    return url;
  }
  return url.replaceAll(wildcardKeyword, localVersion);
};

/**
 * Custom React hook that retrieves the Paragon theme URLs, including the core theme CSS and any theme variants.
 * It supports version substitution for the Paragon and brand versions and returns a structured object containing
 * the URLs. The hook also handles fallback scenarios when the URLs are unavailable in the configuration or when
 * version substitution is required.
 *
 * @returns {Object|undefined} An object containing:
 *   - `core`: The core theme URLs (including default and brand override).
 *   - `defaults`: Any default theme variants.
 *   - `variants`: The URLs for any additional theme variants (default and brand override).
 *
 *   If the required URLs are not available or cannot be determined, `undefined` is returned.
 *
 * @example
 * const themeUrls = useParagonThemeUrls();
 * if (themeUrls) {
 *   console.log(themeUrls.core.urls.default); // Outputs the URL of the core theme CSS
 *   console.log(themeUrls.variants['dark'].urls.default); // Outputs the URL of the dark theme variant CSS
 * }
 *
 */
const useParagonThemeUrls = () => useMemo(() => {
  const {
    PARAGON_THEME_URLS: paragonThemeUrls
  } = getConfig();
  if (!paragonThemeUrls) {
    return undefined;
  }
  const paragonCoreCssUrl = typeof paragonThemeUrls?.core?.urls === 'object' ? paragonThemeUrls.core.urls.default : paragonThemeUrls?.core?.url;
  const brandCoreCssUrl = typeof paragonThemeUrls?.core?.urls === 'object' ? paragonThemeUrls.core.urls.brandOverride : undefined;
  const defaultThemeVariants = paragonThemeUrls.defaults;

  // Local versions of @openedx/paragon and @edx/brand
  // these are only used when passed into handleVersionSubstitution
  // which does not attempt substitution using falsy value
  const localParagonVersion = PARAGON_THEME?.paragon?.version;
  const localBrandVersion = PARAGON_THEME?.brand?.version;
  const coreCss = {
    default: handleVersionSubstitution({
      url: paragonCoreCssUrl,
      wildcardKeyword: '$paragonVersion',
      localVersion: localParagonVersion
    }),
    brandOverride: handleVersionSubstitution({
      url: brandCoreCssUrl,
      wildcardKeyword: '$brandVersion',
      localVersion: localBrandVersion
    })
  };
  const themeVariantsCss = {};
  const themeVariantsEntries = Object.entries(paragonThemeUrls.variants || {});
  themeVariantsEntries.forEach(_ref2 => {
    let [themeVariant, {
      url,
      urls
    }] = _ref2;
    const themeVariantMetadata = {
      urls: null
    };
    if (url) {
      themeVariantMetadata.urls = {
        default: handleVersionSubstitution({
          url,
          wildcardKeyword: '$paragonVersion',
          localVersion: localParagonVersion
        })
      };
    } else {
      themeVariantMetadata.urls = {
        default: handleVersionSubstitution({
          url: urls.default,
          wildcardKeyword: '$paragonVersion',
          localVersion: localParagonVersion
        }),
        brandOverride: handleVersionSubstitution({
          url: urls.brandOverride,
          wildcardKeyword: '$brandVersion',
          localVersion: localBrandVersion
        })
      };
    }
    themeVariantsCss[themeVariant] = themeVariantMetadata;
  });

  // If we don't have  the core default or any theme variants, use the PARAGON_THEME
  if (!coreCss.default || isEmptyObject(themeVariantsCss) || isEmptyObject(defaultThemeVariants)) {
    const localParagonCoreUrl = PARAGON_THEME?.paragon?.themeUrls?.core;
    const localParagonThemeVariants = PARAGON_THEME?.paragon?.themeUrls?.variants;
    const localParagonDefaultThemeVariants = PARAGON_THEME?.paragon?.themeUrls?.defaults;
    const localBrandCoreUrl = PARAGON_THEME?.brand?.themeUrls?.core;
    const localBrandThemeVariants = PARAGON_THEME?.brand?.themeUrls?.variants;
    const localBrandDefaultThemeVariants = PARAGON_THEME?.brand?.themeUrls?.defaults;
    if (isEmptyObject(localParagonCoreUrl) || isEmptyObject(localParagonThemeVariants)) {
      return undefined;
    }
    if (!coreCss.default) {
      coreCss.default = fallbackThemeUrl(localParagonCoreUrl?.fileName);
    }
    if (!coreCss.brandOverride && !isEmptyObject(localBrandCoreUrl)) {
      coreCss.brandOverride = fallbackThemeUrl(localBrandCoreUrl?.fileName);
    }
    Object.entries(localParagonThemeVariants).forEach(_ref4 => {
      let [themeVariant, _ref3] = _ref4;
      let {
          fileName
        } = _ref3,
        rest = _objectWithoutProperties(_ref3, _excluded);
      if (!themeVariantsCss[themeVariant]?.urls?.default) {
        themeVariantsCss[themeVariant] = {
          urls: _objectSpread(_objectSpread({}, themeVariantsCss[themeVariant]?.urls), {}, {
            default: fallbackThemeUrl(fileName)
          }, rest.urls)
        };
      }
    });
    Object.entries(localBrandThemeVariants).forEach(_ref6 => {
      let [themeVariant, _ref5] = _ref6;
      let {
          fileName
        } = _ref5,
        rest = _objectWithoutProperties(_ref5, _excluded2);
      if (!themeVariantsCss[themeVariant]?.urls?.brandOverride) {
        themeVariantsCss[themeVariant] = {
          urls: _objectSpread(_objectSpread({}, themeVariantsCss[themeVariant]?.urls), {}, {
            brandOverride: fallbackThemeUrl(fileName)
          }, rest.urls)
        };
      }
    });
    return {
      core: {
        urls: coreCss
      },
      defaults: defaultThemeVariants || _objectSpread(_objectSpread({}, localParagonDefaultThemeVariants), localBrandDefaultThemeVariants),
      variants: themeVariantsCss
    };
  }
  return {
    core: {
      urls: coreCss
    },
    defaults: defaultThemeVariants,
    variants: themeVariantsCss
  };
}, []);
export default useParagonThemeUrls;
//# sourceMappingURL=useParagonThemeUrls.js.map