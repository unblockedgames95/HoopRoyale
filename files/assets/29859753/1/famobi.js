window.famobi = window.famobi || {};
window.famobi.localStorage = window.famobi.localStorage || window.localStorage;
window.famobi.sessionStorage = window.famobi.sessionStorage || window.sessionStorage;

window.famobi.getBrandingButtonImage = window.famobi.getBrandingButtonImage || function () { return null; };
window.famobi.openBrandingLink = window.famobi.openBrandingLink || function () {};
window.famobi.showInterstitialAd = window.famobi.showInterstitialAd || function () { return Promise.resolve(); };
window.famobi.hasRewardedAd = window.famobi.hasRewardedAd || function () { return true; };
window.famobi.rewardedAd = window.famobi.rewardedAd || function (callback) { callback(); };
window.famobi.log = window.famobi.log || console.log;

window.famobi_analytics = window.famobi_analytics || {};
window.famobi_analytics.trackEvent = window.famobi_analytics.trackEvent || function () { return Promise.resolve(); };
window.famobi_analytics.trackStats = window.famobi_analytics.trackStats || function () { return Promise.resolve(); };

window.famobi_tracking = window.famobi_tracking || {};
window.famobi_tracking.init = window.famobi_tracking.init || function () {};
window.famobi_tracking.trackEvent = window.famobi_tracking.trackEvent || function () {};
window.famobi_tracking.EVENTS = window.famobi_tracking.EVENTS || {};