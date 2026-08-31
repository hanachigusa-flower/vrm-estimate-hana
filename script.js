document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("estimateForm");
  const totalPriceEl = document.getElementById("totalPrice");
  const charCountInput = document.getElementById("charCount");

  function calculateTotal() {
    let total = 0;

    // 1. ラジオボタン（メインセット）の加算
    const selectedMainSet = form.querySelector('input[name="mainSet"]:checked');
    if (selectedMainSet) {
      total += parseInt(selectedMainSet.value, 10);
    }

    // 2. チェックボックス（単品・オプション）の加算
    const checkedBoxes = form.querySelectorAll('.opt:checked');
    checkedBoxes.forEach(box => {
      total += parseInt(box.value, 10);
    });

    // 3. お急ぎ便（セレクトボックス）の加算
    const expressValue = parseInt(document.getElementById("express").value, 10);
    total += expressValue;

    // 4. キャラクター追加人数の加算 (1人あたり2500円)
    const charCount = parseInt(charCountInput.value, 10) || 0;
    if (charCount > 0) {
      total += charCount * 2500;
    }

    // カンマ区切りで画面表示を更新
    totalPriceEl.textContent = total.toLocaleString();
  }

  // フォーム全体の変更イベントを監視
  form.addEventListener("change", calculateTotal);
  charCountInput.addEventListener("input", calculateTotal);

  // 初期計算
  calculateTotal();
});
