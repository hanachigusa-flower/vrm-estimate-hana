// メール送信先アドレス
const RECIPIENT_EMAIL = "hana.chigusa@gmail.com";

// 💰 計算処理
function calculateTotal() {
  let total = 0;

  // 1. メインセット
  const mainSet = document.querySelector('input[name="mainSet"]:checked');
  if (mainSet) {
    total += parseInt(mainSet.value);
  }

  // 2. 単品・オプション（チェックボックス）
  const checkboxes = document.querySelectorAll('.opt:checked');
  checkboxes.forEach(cb => {
    total += parseInt(cb.value);
  });

  // 3. お急ぎ便
  const express = document.getElementById('express');
  if (express) {
    total += parseInt(express.value);
  }

  // 4. 追加キャラクター人数
  const charCount = document.getElementById('charCount');
  if (charCount && charCount.value > 0) {
    total += parseInt(charCount.value) * 2500;
  }

  // 金額表示の更新
  const taxExcluded = total;
  const taxIncluded = Math.floor(total * 1.1);

  document.getElementById('totalPrice').innerText = taxExcluded.toLocaleString();
  document.getElementById('totalPriceTax').innerText = taxIncluded.toLocaleString();

  return { taxExcluded, taxIncluded };
}

// 💌 本文作成 ＆ 必ずGmailの新規作成画面を開く処理
function sendEmail() {
  const { taxExcluded, taxIncluded } = calculateTotal();

  let bodyText = "【3D 4K photo 制作ご依頼・お見積もり内容】\n\n";

  // 1. メインセット
  const mainSet = document.querySelector('input[name="mainSet"]:checked');
  if (mainSet) {
    const labelText = mainSet.parentElement.innerText.trim();
    bodyText += `■ メインセット:\n・${labelText}\n\n`;
  }

  // 2. 単品・オプション
  const checkboxes = document.querySelectorAll('.opt:checked');
  if (checkboxes.length > 0) {
    bodyText += "■ 単品・オプション:\n";
    checkboxes.forEach(cb => {
      const labelText = cb.parentElement.innerText.trim();
      bodyText += `・${labelText}\n`;
    });
    bodyText += "\n";
  }

  // 3. お急ぎ便
  const express = document.getElementById('express');
  if (express && express.value !== "0") {
    const selectedOption = express.options[express.selectedIndex].text;
    bodyText += `■ お急ぎ便:\n・${selectedOption}\n\n`;
  }

  // 4. 追加キャラクター人数
  const charCount = document.getElementById('charCount');
  if (charCount && parseInt(charCount.value) > 0) {
    bodyText += `■ 追加キャラクター:\n・${charCount.value} 人分追加\n\n`;
  }

  // 概算金額
  bodyText += "----------------------------\n";
  bodyText += `概算お見積もり（税抜）: ¥${taxExcluded.toLocaleString()}〜\n`;
  bodyText += `お支払予想額（税込10%）: ¥${taxIncluded.toLocaleString()}〜\n`;
  bodyText += "----------------------------\n\n";
  bodyText += "【ご要望・詳細等（自由にご記入ください）】\n";

  // エンコード処理
  const subject = encodeURIComponent("【ご依頼】3D 4K photo お見積もり問い合わせ");
  const body = encodeURIComponent(bodyText);

  // ブラウザで必ずGmailの作成画面（Web版）を開くURLを生成
  const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${RECIPIENT_EMAIL}&su=${subject}&body=${body}`;

  // 新しいタブでGmailを開く
  window.open(gmailUrl, '_blank');
}

// 🔍 拡大モーダルの制御（強力保護構造）
function openModal(src, type) {
  const modal = document.getElementById('imageModal');
  const container = document.getElementById('modalMediaContainer');
  if (!modal || !container) return;

  container.innerHTML = '';

  if (type === 'img') {
    const img = document.createElement('img');
    img.src = src;
    img.className = 'protected-media';
    container.appendChild(img);
  } else if (type === 'video') {
    const video = document.createElement('video');
    video.src = src;
    video.controls = true;
    video.autoplay = true;
    video.className = 'protected-media';
    container.appendChild(video);
  }

  // モーダル側にも透明シールドを追加
  const shield = document.createElement('div');
  shield.className = 'media-shield';
  container.appendChild(shield);

  modal.style.display = 'flex';
}

function closeModal() {
  const modal = document.getElementById('imageModal');
  const container = document.getElementById('modalMediaContainer');
  if (container) container.innerHTML = '';
  if (modal) modal.style.display = 'none';
}

// イベントリスナーの設定
document.addEventListener('DOMContentLoaded', () => {
  document.addEventListener('change', calculateTotal);
  document.addEventListener('input', calculateTotal);

  const sendBtn = document.getElementById('sendEmailBtn');
  if (sendBtn) {
    sendBtn.addEventListener('click', sendEmail);
  }

  calculateTotal();
});

// 🛡️ ページ全体の右クリック禁止・ドラッグ禁止・ショートカット禁止
document.addEventListener('contextmenu', e => e.preventDefault());
document.addEventListener('dragstart', e => e.preventDefault());
document.addEventListener('keydown', e => {
  // Sキー保存 (Ctrl+S / Cmd+S) をブロック
  if ((e.ctrlKey || e.metaKey) && (e.key === 's' || e.key === 'S')) {
    e.preventDefault();
  }
});
