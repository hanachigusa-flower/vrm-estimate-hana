// 金額の計算と税込表示の自動計算関数
function calculateTotal() {
  let total = 0;

  // 1. メインセットの計算
  const mainSet = document.querySelector('input[name="mainSet"]:checked');
  if (mainSet) {
    total += parseInt(mainSet.value, 10) || 0;
  }

  // 2. チェックボックス（単品・オプション）の計算
  const checkboxes = document.querySelectorAll('.opt:checked');
  checkboxes.forEach(cb => {
    total += parseInt(cb.value, 10) || 0;
  });

  // 3. お急ぎ便の計算
  const express = document.getElementById('express');
  if (express) {
    total += parseInt(express.value, 10) || 0;
  }

  // 4. 追加キャラ人数の計算 (1人につき 2,500円)
  const charCount = document.getElementById('charCount');
  if (charCount) {
    const count = parseInt(charCount.value, 10) || 0;
    total += count * 2500;
  }

  // 税抜価格の更新
  const totalPriceElem = document.getElementById('totalPrice');
  if (totalPriceElem) {
    totalPriceElem.innerText = total.toLocaleString();
  }

  // 税込価格（10%）の計算と更新
  const totalPriceTaxElem = document.getElementById('totalPriceTax');
  if (totalPriceTaxElem) {
    const taxIncluded = Math.floor(total * 1.1);
    totalPriceTaxElem.innerText = taxIncluded.toLocaleString();
  }
}

// 画面読み込み完了後にイベントを設定
document.addEventListener('DOMContentLoaded', function() {
  const form = document.getElementById('estimateForm');
  if (form) {
    form.addEventListener('change', calculateTotal);
    form.addEventListener('input', calculateTotal);
    form.addEventListener('click', calculateTotal);
  }

  // メール作成ボタンの処理（Web版Gmailを起動）
  const sendEmailBtn = document.getElementById('sendEmailBtn');
  if (sendEmailBtn) {
    sendEmailBtn.addEventListener('click', function(e) {
      e.preventDefault();

      // ✉️ ご自身のメールアドレスを設定してください
      const yourEmail = "hana.chigusa@gmail.com"; 

      const priceEx = document.getElementById('totalPrice') ? document.getElementById('totalPrice').innerText : "0";
      const priceIn = document.getElementById('totalPriceTax') ? document.getElementById('totalPriceTax').innerText : "0";

      const selectedMain = document.querySelector('input[name="mainSet"]:checked');
      const mainText = selectedMain ? selectedMain.parentElement.innerText.trim() : "指定なし";

      const selectedOpts = Array.from(document.querySelectorAll('.opt:checked'))
        .map(cb => "・" + cb.parentElement.innerText.trim())
        .join("\n");

      const expressSelect = document.getElementById('express');
      const expressText = expressSelect ? expressSelect.options[expressSelect.selectedIndex].text : "通常納期";

      const charCountElem = document.getElementById('charCount');
      const charCount = charCountElem ? charCountElem.value : "0";

      const subject = "【お見積もり・ご依頼】3D 4Kお写真について";
      const body = 
        `千草はな 様\n\n` +
        `お見積もりシミュレーターより問い合わせいたします。\n\n` +
        `-----------------------------------\n` +
        `【選択内容】\n` +
        `■ メインセット:\n${mainText}\n\n` +
        `■ オプション:\n${selectedOpts || "なし"}\n\n` +
        `■ お急ぎ便: ${expressText}\n` +
        `■ 追加キャラクター: ${charCount}人\n\n` +
        `■ 概算お見積もり金額:\n` +
        `・税抜: ${priceEx} 円〜\n` +
        `・税込(10%): ${priceIn} 円〜\n` +
        `-----------------------------------\n\n` +
        `【ご要望・補足など】\n` +
        `（ここにポージングのご希望や気になる点をご記入ください）\n`;

      const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(yourEmail)}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      window.open(gmailUrl, '_blank');
    });
  }

  // 🔍 画像クリックによる拡大表示（モーダル処理）
  const modal = document.getElementById('imageModal');
  const modalImg = document.getElementById('modalImg');
  const modalClose = document.getElementById('modalClose');
  const clickableImages = document.querySelectorAll('.clickable-media');

  clickableImages.forEach(img => {
    img.addEventListener('click', function() {
      if (modal && modalImg) {
        modal.style.display = 'flex';
        modalImg.src = this.src;
      }
    });
  });

  // 閉じるボタンまたは背景クリックでモーダルを閉じる
  if (modalClose) {
    modalClose.addEventListener('click', function() {
      modal.style.display = 'none';
    });
  }

  if (modal) {
    modal.addEventListener('click', function(e) {
      if (e.target === modal || e.target === modalImg) {
        modal.style.display = 'none';
      }
    });
  }

  // 初期計算の実行
  calculateTotal();
});
