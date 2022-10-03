import { from, of, switchMap, timer } from 'rxjs';
declare var chr_ext_intercept: boolean;
let active = false;
declare global {
  interface Window {
    chr_ext_intercept: boolean | undefined;
  }
}

function makeOrange(color: string): void {
  document.body.style.backgroundColor = color;
}

function pageLoaded(): void {
  if (window.chr_ext_intercept) {
    return;
  }
  window.chr_ext_intercept = true;
  console.log('interceptor');

  const XHR: XMLHttpRequest & { url?: string | URL } = XMLHttpRequest.prototype;
  const send = XHR.send;
  const open = XHR.open;
  XHR.open = function (method, url) {
    this.url = url; // the request url
    return open.apply(this, arguments as any);
  };
  XHR.send = function () {
    const url = this.url;
    this.addEventListener('load', function () {
      if (
        (url instanceof URL ? url.href : url)?.includes(
          'api/lk/v1/equeue/agg/slots'
        )
      ) {
        const response = JSON.parse(this.response);
        if (!response.slots) {
          throw Error('пиздец');
        } else {
          if (!response.slots.length) {
            console.log('slots empty');
            setTimeout(() => {
              window.location.reload();
            }, 1000 * Math.random() + 1000);
          } else {
            let audio = new Audio(
              'https://zvukogram.com/mp3/cats/1354/fanfaryi-podvodyaschie-itogi.mp3'
            );
            audio.play();
            setTimeout(() => {
              const dayEl = document.querySelector(
                '.calendar-day:not(.locked)'
              ) as HTMLElement;
              if (dayEl) {
                const freeDay = Number(dayEl.innerText);
                if (
                  (document.querySelector('.no-avatar') as HTMLElement)
                    ?.innerText === 'ЗС' ||
                  !([4, 8, 12, 15, 20].includes(freeDay) || freeDay >= 23)
                ) {
                  dayEl.click();
                  setTimeout(() => {
                    (
                      document.querySelector('.time-slot-item') as HTMLElement
                    )?.click();
                    setTimeout(
                      () =>
                        (
                          document.querySelector(
                            '.submit-button button'
                          ) as HTMLElement
                        )?.click(),
                      50
                    );
                  }, 50);
                } else {
                  window.location.reload();
                }
              }
            }, 50);
          }
        }
      }
    });
    return send.apply(this, arguments as any);
  };
}
chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
  // do your things
  if (changeInfo.status == 'complete') {
    chrome.scripting
      .executeScript({
        target: { tabId: tab.id ? tab.id : -1 },
        func: pageLoaded,
        world: 'MAIN',
        args: [],
      })
      .then();
  }
});
