(() => {
  console.log("Content script started execution.");
  console.log("Content script injected (v7 - improved multiple download support).");

  const TRIGGER_ICON_CLASS = '.mdi-file-excel';
  const DOWNLOAD_ICON_CLASS = '.mdi-file-download';
  const NEXT_PAGE_ICON_CLASS = '.mdi-arrow-right';

  const DELAY_AFTER_TRIGGER_CLICK_MS = 1000; // 点検表アイコンクリック後、ダウンロードボタンが表示されるまでの待機時間（ミリ秒）
  const DELAY_AFTER_DOWNLOAD_CLICK_MS = 500; // ダウンロードボタンクリック後の短い待機時間
  const DELAY_AFTER_PAGE_LOAD_MS = 3000; // ページ遷移後、コンテンツが完全に読み込まれるまでの待機時間（ミリ秒）

  async function processCurrentPageDownloads() {
    const triggerButtons = Array.from(document.querySelectorAll('button')).filter(btn => btn.querySelector(TRIGGER_ICON_CLASS));

    if (triggerButtons.length === 0) {
      console.warn("点検表のアイコン（トリガーボタン）が見つかりませんでした。このページにはダウンロード対象がないか、既に処理済みです。");
      return;
    }

    console.log(`${triggerButtons.length} 件の点検表アイコンが見つかりました。このページのダウンロードを開始します。`);

    for (let i = 0; i < triggerButtons.length; i++) {
      const triggerButton = triggerButtons[i];
      console.log(`トリガーボタン ${i + 1}/${triggerButtons.length} をクリック中...`);
      triggerButton.click();

      // ダウンロードボタンが表示されるのを待つ
      await new Promise(resolve => setTimeout(resolve, DELAY_AFTER_TRIGGER_CLICK_MS));

      // 表示されたダウンロードボタンを探してクリック
      const downloadButtons = Array.from(document.querySelectorAll('button')).filter(btn =>
        btn.querySelector(DOWNLOAD_ICON_CLASS)
      );

      if (downloadButtons.length > 0) {
        console.log(`${downloadButtons.length} 件のダウンロードボタンが見つかりました。クリックを開始します。`);
        for (const button of downloadButtons) {
          button.click();
          await new Promise(resolve => setTimeout(resolve, DELAY_AFTER_DOWNLOAD_CLICK_MS)); // 各ダウンロードボタンクリック間の短い待機
        }
      } else {
        console.warn("ダウンロードボタンが見つかりませんでした。");
      }
    }
  }

  async function processAllPages() {
    const confirmation = confirm("すべてのページの点検表をダウンロードします。よろしいですか？");
    if (!confirmation) {
      alert("ダウンロードをキャンセルしました。");
      return;
    }

    let pageCount = 1;
    while (true) {
      console.log(`--- ページ ${pageCount} の処理を開始します ---`);
      await processCurrentPageDownloads();

      // 「次へ」ボタンを探す
      const nextPageButton = Array.from(document.querySelectorAll('button')).find(btn => btn.querySelector(NEXT_PAGE_ICON_CLASS));

      if (nextPageButton && !nextPageButton.disabled) {
        console.log(`ページ ${pageCount} の処理が完了しました。「次へ」ボタンをクリックします。`);
        nextPageButton.click();
        await new Promise(resolve => setTimeout(resolve, DELAY_AFTER_PAGE_LOAD_MS)); // ページが読み込まれるのを待つ
        pageCount++;
      } else {
        console.log("「次へ」ボタンが見つからないか、無効になっています。すべてのページの処理が完了しました。");
        break; // 「次へ」ボタンがなければループを終了
      }
    }

    alert("すべての点検表のダウンロード処理が完了しました。\nダウンロードフォルダを確認してください。");
  }

  processAllPages();

})();