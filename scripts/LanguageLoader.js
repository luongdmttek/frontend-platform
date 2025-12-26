function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
import { isUndefined } from 'lodash';
import Cookies from 'universal-cookie';
import { getConfig } from '../config';

/**
 * @implements {LanguageLoader}
 */
var LanguageLoader = /*#__PURE__*/function () {
  function LanguageLoader(_ref) {
    var config = _ref.config,
      onTranslateChange = _ref.onTranslateChange,
      isTranslated = _ref.isTranslated,
      originalLang = _ref.originalLang;
    _classCallCheck(this, LanguageLoader);
    this.langCookies = config.LANGUAGE_PREFERENCE_COOKIE_NAME;
    // this.onTranslateChange = onTranslateChange;
    // isTranslated = false;
    // this.originalLang = document.documentElement.getAttribute('lang') || 'en';
  }
  return _createClass(LanguageLoader, [{
    key: "loadScript",
    value: function loadScript() {
      // if (!this.langCookies) {
      //     return;
      // }
      var cookies = new Cookies();
      var html = document.documentElement;

      // const mfeLang = cookies.get("openedx-language-preference");
      var mfeLang = cookies.get(getConfig().LANGUAGE_PREFERENCE_COOKIE_NAME);

      // const detectedLang = html.getAttribute('lang');
      html.setAttribute("lang", isUndefined(mfeLang) ? "vi" : mfeLang);
      // console.log("lang: ", getConfig().LANGUAGE_PREFERENCE_COOKIE_NAME)

      // const domainName = getConfig().LMS_BASE_URL.replace('http://', '');
      var domainName = window.location.hostname;
      var baseUrl = domainName.replace('.apps', '');

      // Function to check if the page is currently translated
      function isPageTranslated() {
        var htmlElement = document.documentElement;
        return htmlElement.classList.contains('translated-ltr') || htmlElement.classList.contains('translated-rtl');
      }

      // Set up a MutationObserver to watch for class changes on the <html> element
      var observer = new MutationObserver(function (mutations) {
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
        var detectedLang = html.getAttribute('lang');
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
          domain: baseUrl,
          // domain: '.local.openedx.io',
          sameSite: 'lax'
        });
        console.log("domain: ", baseUrl);

        // window.location.reload();
      }
    }
  }]);
}();
export default LanguageLoader;
//# sourceMappingURL=LanguageLoader.js.map