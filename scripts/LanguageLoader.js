import { isUndefined } from 'lodash';
import Cookies from 'universal-cookie';
import { getConfig } from '../config';

/**
 * @implements {LanguageLoader}
 */
class LanguageLoader {
  constructor(_ref) {
    let {
      config,
      onTranslateChange,
      isTranslated,
      originalLang
    } = _ref;
    this.langCookies = config.LANGUAGE_PREFERENCE_COOKIE_NAME;
    // this.onTranslateChange = onTranslateChange;
    // isTranslated = false;
    // this.originalLang = document.documentElement.getAttribute('lang') || 'en';
  }
  loadScript() {
    // if (!this.langCookies) {
    //     return;
    // }
    const cookies = new Cookies();
    const html = document.documentElement;

    // const mfeLang = cookies.get("openedx-language-preference");
    const mfeLang = cookies.get(getConfig().LANGUAGE_PREFERENCE_COOKIE_NAME);

    // const detectedLang = html.getAttribute('lang');
    html.setAttribute("lang", isUndefined(mfeLang) ? "vi" : mfeLang);
    // console.log("lang: ", getConfig().LANGUAGE_PREFERENCE_COOKIE_NAME)

    // const domainName = getConfig().LMS_BASE_URL.replace('http://', '');
    const domainName = window.location.hostname;

    // Function to check if the page is currently translated
    function isPageTranslated() {
      const htmlElement = document.documentElement;
      return htmlElement.classList.contains('translated-ltr') || htmlElement.classList.contains('translated-rtl');
    }

    // Set up a MutationObserver to watch for class changes on the <html> element
    const observer = new MutationObserver(function (mutations) {
      mutations.forEach(function (mutation) {
        if (mutation.attributeName === 'class') {
          if (isPageTranslated()) {
            console.log("The page has been translated.");
            // Add your custom logic here (e.g., track for analytics, adjust UI)
            handleTranslationEvent(true);
            // document.documentElement.getAttribute('lang') || 'en';
            // console.log(document.documentElement.getAttribute('lang'))
          } else {
            console.log("The page has reverted to its original language.");
            // Add your custom logic here (e.g., reset UI)
            handleTranslationEvent(false);
          }
        }
      });
    });

    // Start observing the document element for attribute changes (specifically 'class')
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
      childList: false,
      characterData: false
    });
    function handleTranslationEvent(isTranslated) {
      const detectedLang = html.getAttribute('lang');
      if (isTranslated) {
        // Actions to take when translated
        // alert("Translation detected! You can run custom code now.");
      } else {
        // Actions to take when original language is restored
      }
      // cookies.set("openedx-language-preference", detectedLang);
      cookies.set(getConfig().LANGUAGE_PREFERENCE_COOKIE_NAME, detectedLang, {
        maxAge: 120,
        path: '/',
        // domain: domainName,
        domain: '.local.openedx.io',
        sameSite: 'lax'
      });
      console.log("domain: ", domainName);

      // window.location.reload();
    }
  }
}
export default LanguageLoader;
//# sourceMappingURL=LanguageLoader.js.map