// 金額の計算と税込表示の自動計算
function calculateTotal() {
  let total = 0;

  // 1. メインセットの計算
  const mainSet = document.querySelector('input[name="mainSet"]:checked');
  if (mainSet) {
    total += parseInt(mainSet.value, 10);
  }

  // 2. チェックボックス（単品・オプション）の計算
  const checkboxes = document.querySelectorAll('.opt:checked');
  checkboxes.forEach(cb => {
    total += parseInt(cb.value, 10);
  });

  // 3. お急ぎ便の計算
  const express = document.getElementById('express');
  if (express) {
    total += parseInt(express.value, 10);
  }

  // 4. 追加キャラ人数の計算 (1人につき 2,500円)
  const charCount = document.getElementById('charCount');
  if (charCount) {
    const count = parseInt(charCount.value, 10) || 0;
    total += count * 2500;
  }

  // 税抜表示の更新
  document.getElementById('totalPrice').innerText = total.toLocaleString();

  // 税込表示（10%）の計算と更新
  const taxIncluded = Math.floor(total * 1.1);
  document.getElementById('totalPriceTax').innerText = taxIncluded.toLocaleString();
}

// フォームの入力変更を検知して自動計算
document.getElementById('estimateForm').addEventListener('change', calculateTotal);
document.getElementById('charCount').addEventListener('input', calculateTotal);

// メール作成ボタンの処理
document.getElementById('sendEmailBtn').addEventListener('click', function() {
  // ✉️ ここに千草はな様のメールアドレスを設定してください
  const yourEmail = "hana.chigusa@gmail.com"; 

  const priceEx = document.getElementById('totalPrice').innerText;
  const priceIn = document.getElementById('totalPriceTax').innerText;

  const selectedMain = document.querySelector('input[name="mainSet"]:checked');
  const mainText = selectedMain ? selectedMain.parentElement.innerText.trim() : "指定なし";

  const selectedOpts = Array.from(document.querySelectorAll('.opt:checked'))
    .map(cb => "・" + cb.parentElement.innerText.trim())
    .join("\n");

  const expressSelect = document.getElementById('express');
  const expressText = expressSelect.options[expressSelect.selectedIndex].text;

  const charCount = document.getElementById('charCount').value;

  const subject = encodeURIComponent("【お見積もり・ご依頼】3D 4Kお写真について");
  const body = encodeURIComponent(
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
    `（ここにポージングのご希望や気になる点をご記入ください）\n`
  );

  window.location.href = `mailto:${yourEmail}?subject=${subject}&body=${body}`;
});

// 初期計算の実行
calculateTotal();
