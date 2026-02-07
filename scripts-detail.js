document.addEventListener("DOMContentLoaded", function () {
  // URLから `id` を取得する
  const urlParams = new URLSearchParams(window.location.search);
  const scriptId = urlParams.get("id");

  if (!scriptId) {
    document.getElementById("script-content").innerHTML = "<p>脚本が見つかりません</p>";
    return;
  }

  // `data.json` を取得して、対応する `id` の脚本を探す
  fetch("data.json")
    .then(response => response.json())
    .then(data => {
      const script = data.find(item => item.id == scriptId);

      if (!script) {
        document.getElementById("script-content").innerHTML = "<p>脚本が見つかりません</p>";
        return;
      }

      // ✅ 「その他」がある場合だけ表示用に文字列を準備
      let otherText = "";
      if (script.other && script.other > 0) {
        otherText = ` | その他: ${script.other}人`;
      }

      // タイトルや概要を表示
      document.getElementById("script-title").textContent = script.title;

      document.getElementById("script-details").innerHTML = `
        <p>ジャンル: ${script.genre} | 時間: ${script.time}分</p>
        <p>
          男性: ${script.male}人 | 女性: ${script.female}人${otherText} | 合計: ${script.cast}人
        </p>
        <h4>本編:</h4>
      `;

      // 本文を <pre> に入れて改行保持
      const contentBox = document.createElement("pre");
      contentBox.textContent = script.content.replace(/\\n/g, "\n");
      document.getElementById("script-details").appendChild(contentBox);
    })
    .catch(error => {
      console.error("データの取得に失敗しました:", error);
      document.getElementById("script-content").innerHTML = "<p>データの取得に失敗しました。</p>";
    });
});
