let scripts = [];

document.addEventListener("DOMContentLoaded", function () {
  const searchButton = document.getElementById("searchButton");
  const sortOrder = document.getElementById("sortOrder");
  const scriptList = document.getElementById("scriptList");

  // 検索ボタン処理
  if (searchButton) {
    searchButton.addEventListener("click", filterScripts);
  }

  // 並べ替え処理
  if (sortOrder) {
    sortOrder.addEventListener("change", function () {
      if (!scripts) return;
      const sortOrderValue = sortOrder.value;
      scripts.sort((a, b) => sortOrderValue === "asc" ? a.time - b.time : b.time - a.time);
      displayScripts(scripts);
    });
  }

  // JSON読み込み
  fetch("data.json")
    .then(response => response.json())
    .then(data => {
      console.log("読み込んだJSON:", data);

      scripts = data;
      const scriptList = document.getElementById("scriptList");
      if (scriptList) {
        displayScripts(scripts);
      }
    });
}); // ← ここ！DOMContentLoaded を閉じる中カッコ

// 一覧表示
function displayScripts(scriptsToShow) {
  const scriptContainer = document.getElementById("scriptList");
  scriptContainer.innerHTML = "";

  console.log("scriptsToShow:", scriptsToShow);

  scriptsToShow.forEach((script) => {
    const scriptElement = document.createElement("div");
    scriptElement.classList.add("script-item");

    // その他人数の表示（0や未定義なら表示しない）
    let otherText = "";
    if (script.other && script.other > 0) {
      otherText = " | その他: " + script.other + "人";
    }

    // HTMLの組み立て
    scriptElement.innerHTML = `
      <h3><a href="scripts.html?id=${script.id}">${script.title}</a></h3>
      <p>ジャンル: ${script.genre} | 時間: ${script.time}分</p>
      <p>
        男性: ${script.male}人 | 女性: ${script.female}人${otherText} | 合計: ${script.cast}人
      </p>
    `;

    // containerに追加！
    scriptContainer.appendChild(scriptElement);
  });
}

// 絞り込み処理
function filterScripts() {
  const time = parseInt(document.getElementById("timeFilter").value) || Infinity;
  const male = parseInt(document.getElementById("maleFilter").value) || -1;
  const female = parseInt(document.getElementById("femaleFilter").value) || -1;
  const genre = document.getElementById("genreFilter").value;
  const cast = parseInt(document.getElementById("castFilter").value) || Infinity;

  const filtered = scripts.filter(s => {
    return (
      s.time <= time &&
      (male === -1 || s.male === male) &&
      (female === -1 || s.female === female) &&
      (genre === "" || s.genre === genre) &&
      s.cast <= cast
    );
  });

  displayScripts(filtered);
}
