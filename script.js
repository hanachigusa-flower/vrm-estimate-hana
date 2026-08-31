// --- ✉️ メール送信先アドレス ---
const TARGET_EMAIL = "hanachigusa.ch@gmail.com"; // 必要に応じてご自身の宛先に変更してください

// --- 🔢 金額計算＆連動システム ---
document.addEventListener("DOMContentLoaded", function() {
  const form = document.getElementById("estimateForm");
  const totalPriceSpan = document.getElementById("totalPrice");
  const totalPriceTaxSpan = document.getElementById("totalPriceTax");
  const mainSetRadios = document.querySelectorAll('input[name="mainSet"]');
  
  // セット詳細サブボックスの切り替え要素
  const detailBoxes = {
    "3000": document.getElementById("detail_box_set1"),
    "4000": document.getElementById("detail_box_set2"),
    "2000_1": document.getElementById("detail_box_set3"), // 全部持ち込み
    "2000_2": document.getElementById("detail_box_set4"), // VRCレタッチ
    "other": document.getElementById("detail_box_set5")  // 完全こだわり・セットなし
  };

  function updateDetailVisibility() {
    // すべて非表示にする
    Object.values(detailBoxes).forEach(box => {
      if (box) box.style.display = "none";
    });

    // 選択されているメインセットの価格とインデックスを確認
    let selectedRadio = document.querySelector('input[name="mainSet"]:checked');
    if (!selectedRadio) return;

    let val = selectedRadio.value;
    let cardLabel = selectedRadio.closest('.set-card');
    let allCards = Array.from(document.querySelectorAll('.card-radio-group .set-card'));
    let cardIndex = allCards.indexOf(cardLabel);

    // インデックスまたは価格に応じて該当ボックスを表示
    if (cardIndex === 0) { // 背景持ち込み
      if (detailBoxes["3000"]) detailBoxes["3000"].style.display = "block";
    } else if (cardIndex === 1) { // おまかせ
      if (detailBoxes["4000"]) detailBoxes["4000"].style.display = "block";
    } else if (cardIndex === 2) { // 全部持ち込み
      if (detailBoxes["2000_1"]) detailBoxes["2000_1"].style.display = "block";
    } else if (cardIndex === 3) { // VRCレタッチ
      if (detailBoxes["2000_2"]) detailBoxes["2000_2"].style.display = "block";
    } else { // 完全こだわり または セットなし
      if (detailBoxes["other"]) detailBoxes["other"].style.display = "block";
    }
  }

  function calculatePrice() {
    let total = 0;

    // 1. メインセット
    const selectedSet = document.querySelector('input[name="mainSet"]:checked');
    if (selectedSet) {
      total += parseInt(selectedSet.value, 10);
    }

    // 2. 単品メニュー ＆ 3. オプション
    const checkboxes = document.querySelectorAll(".opt:checked");
    checkboxes.forEach(function(box) {
      total += parseInt(box.value, 10);
    });

    // お急ぎ便
    const expressSelect = document.getElementById("express");
    if (expressSelect) {
      total += parseInt(expressSelect.value, 10);
    }

    // 追加キャラクター人数 (+2,500円/人)
    const charCountInput = document.getElementById("charCount");
    if (charCountInput) {
      let count = parseInt(charCountInput.value, 10) || 0;
      if (count > 0) {
        total += count * 2500;
      }
    }

    // 税込計算 (10%)
    let taxIncluded = Math.round(total * 1.1);

    // 表示更新
    if (totalPriceSpan) totalPriceSpan.textContent = total.toLocaleString();
    if (totalPriceTaxSpan) totalPriceTaxSpan.textContent = taxIncluded.toLocaleString();
  }

  // イベントリスナー登録
  if (form) {
    form.addEventListener("change", function() {
      updateDetailVisibility();
      calculatePrice();
    });
    form.addEventListener("input", calculatePrice);
  }

  // 初期実行
  updateDetailVisibility();
  calculatePrice();

  // ✉️ メール作成ボタンの動作
  const sendEmailBtn = document.getElementById("sendEmailBtn");
  if (sendEmailBtn) {
    sendEmailBtn.addEventListener("click", function() {
      // テンプレート情報の取得
      let usage = document.getElementById("t_usage").value || "未入力";
      let deadline = document.getElementById("t_deadline").value || "未入力";
      let format = document.getElementById("t_format").value || "PNG";
      let modelType = document.querySelector('input[name="t_modelType"]:checked')?.value || "未選択";
      let budget = document.getElementById("t_budget").value || "未入力";
      let publish = document.getElementById("t_publish").value || "未入力";
      let aiUse = document.querySelector('input[name="t_ai"]:checked')?.value || "未選択";

      // 選択中セット名
      let selectedSetRadio = document.querySelector('input[name="mainSet"]:checked');
      let setName = selectedSetRadio ? selectedSetRadio.getAttribute("data-setname") : "未選択";
      let setPriceText = selectedSetRadio ? selectedSetRadio.value : "0";

      // セット詳細情報の取得
      let setSpecificDetails = "";
      let allCards = Array.from(document.querySelectorAll('.card-radio-group .set-card'));
      let cardIndex = selectedSetRadio ? allCards.indexOf(selectedSetRadio.closest('.set-card')) : -1;

      if (cardIndex === 0) {
        let pose = document.getElementById("sub_pose1").value || "未入力";
        let bg = document.getElementById("sub_bg1").value || "未入力";
        let face = document.getElementById("sub_face1").value || "未入力";
        setSpecificDetails = `【背景持ち込みセット詳細】\n・指定のポージング: ${pose}\n・使用する背景: ${bg}\n・表情1点(＋差分): ${face}\n`;
      } else if (cardIndex === 1) {
        let season = document.getElementById("sub_season").value;
        let sit = document.getElementById("sub_situation").value || "未入力";
        let face2 = document.getElementById("sub_face2").value || "未入力";
        setSpecificDetails = `【おまかせセット詳細】\n・欲しいお写真の季節: ${season}\n・シチュエーション: ${sit}\n・表情1点(＋差分表情1点): ${face2}\n`;
      } else if (cardIndex === 2) {
        let bg3 = document.getElementById("sub_bg3").value || "未入力";
        let tachi3 = document.getElementById("sub_tachi3").value || "未入力";
        let mood3 = document.getElementById("sub_mood3").value || "未入力";
        setSpecificDetails = `【全部持ち込みセット詳細】\n・背景: ${bg3}\n・透過png形式の立ち絵: ${tachi3}\n・雰囲気: ${mood3}\n`;
      } else if (cardIndex === 3) {
        let vrcUser = document.querySelector('input[name="sub_vrc_user"]:checked')?.value || "未選択";
        setSpecificDetails = `【VRChatレタッチセット詳細】\n・ご依頼者様区分: ${vrcUser}\n`;
      } else {
        let free = document.getElementById("sub_free").value || "なし";
        setSpecificDetails = `【ご要望・備考】\n${free}\n`;
      }

      // 単品メニューの取得
      let optList = [];
      document.querySelectorAll(".opt:checked").forEach(function(box) {
        optList.push("・" + box.parentElement.textContent.trim());
      });

      // お急ぎ便 ＆ キャラ人数
      let expressText = document.getElementById("express").selectedOptions[0].text;
      let charCount = document.getElementById("charCount").value;

      // 金額
      let priceVal = totalPriceSpan ? totalPriceSpan.textContent : "0";
      let priceTaxVal = totalPriceTaxSpan ? totalPriceTaxSpan.textContent : "0";

      // メール本文の組み立て
      let mailBody = 
        `【3D 4K photo ご依頼テンプレート】\n\n` +
        `・使用用途\n【 ${usage} 】\n\n` +
        `・納期\n【 ${deadline} 】\n\n` +
        `・納品ファイル形式\n【 ${format} 】\n\n` +
        `・フルスクラッチモデルかVroidか\n【 ${modelType} 】\n\n` +
        `・人数\n【 ${charCount > 0 ? charCount + '人追加' : '基本人数のみ'} 】\n\n` +
        `・ご予算\n【 ${budget} 】\n\n` +
        `・SNS/ポートフォリオへの公開許可 /公開して良い時期\n【 ${publish} 】\n\n` +
        `・セットの選択\n【 ${setName} (¥${setPriceText}〜) 】\n\n` +
        `・AI画像の使用の可否\n【 ${aiUse} 】\n\n` +
        `-----------------------------------\n` +
        setSpecificDetails +
        `-----------------------------------\n` +
        `【選択された単品メニュー・オプション】\n` +
        (optList.length > 0 ? optList.join("\n") + "\n" : "なし\n") +
        `・お急ぎ便: ${expressText}\n` +
        `・追加キャラクター人数: ${charCount}人\n\n` +
        `【お見積もり金額】\n` +
        `概算お見積もり（税抜）: ${priceVal} 円〜\n` +
        `お支払予想額（税込10%）: ${priceTaxVal} 円〜\n\n` +
        `よろしくお願いいたします！`;

      let mailSubject = encodeURIComponent("【ご依頼】3D 4K photo 制作お見積もり");
      let encodedBody = encodeURIComponent(mailBody);

      window.location.href = `mailto:${TARGET_EMAIL}?subject=${mailSubject}&body=${encodedBody}`;
    });
  }
});

// --- 🔍 モーダル拡大表示機能 ---
function openModal(mediaSrc, type) {
  const modal = document.getElementById("imageModal");
  const container = document.getElementById("modalMediaContainer");
  if (!modal || !container) return;

  container.innerHTML = "";

  if (type === "img") {
    const img = document.createElement("img");
    img.src = mediaSrc;
    img.className = "protected-media";
    container.appendChild(img);
  } else if (type === "video") {
    const video = document.createElement("video");
    video.src = mediaSrc;
    video.autoplay = true;
    video.loop = true;
    video.muted = true;
    video.playsInline = true;
    video.className = "protected-media";
    container.appendChild(video);
  }

  modal.style.display = "flex";
}

function closeModal() {
  const modal = document.getElementById("imageModal");
  const container = document.getElementById("modalMediaContainer");
  if (modal) modal.style.display = "none";
  if (container) container.innerHTML = "";
}
