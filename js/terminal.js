document.addEventListener("DOMContentLoaded", () => {
  "use strict";
  const terminalContainer = document.getElementById("terminalCode");
  if (!terminalContainer) return;

  const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

  const codeTokens = [
    { text: "// CCIRC ｜ 精誠中學資訊讀書會\n", class: "token-comment" },
    { text: "#include ", class: "token-keyword" },
    { text: "<bits/stdc++.h>\n", class: "token-header" },
    { text: "using namespace ", class: "token-keyword" },
    { text: "std;\n", class: "token-keyword" },
    { text: "int ", class: "token-keyword" },
    { text: "main", class: "token-func" },
    { text: "() {\n" },
    { text: "    cout << ", class: "token-keyword" },
    { text: '"今天的學員，明天的講師。"', class: "token-string" },
    { text: " << endl;\n" },
    { text: "    // C++競技程式共學社群\n", class: "token-comment" },
    { text: "    return ", class: "token-keyword" },
    { text: "0;\n}" }
  ];

  if (reduce) {
    terminalContainer.textContent = codeTokens.map(t => t.text).join("");
    return;
  }

  let tokenIndex = 0;
  let charIndex = 0;
  let currentSpan = null;

  function typeCode() {
    if (tokenIndex >= codeTokens.length) {
      setTimeout(() => {
        terminalContainer.innerHTML = "";
        tokenIndex = 0;
        charIndex = 0;
        currentSpan = null;
        typeCode();
      }, 6000);
      return;
    }

    const currentToken = codeTokens[tokenIndex];

    if (charIndex === 0) {
      currentSpan = document.createElement("span");
      if (currentToken.class) currentSpan.className = currentToken.class;
      terminalContainer.appendChild(currentSpan);
    }

    currentSpan.textContent += currentToken.text[charIndex];
    charIndex++;

    if (charIndex >= currentToken.text.length) {
      tokenIndex++;
      charIndex = 0;
    }

    const typingSpeed = Math.floor(Math.random() * 28) + 18;
    setTimeout(typeCode, typingSpeed);
  }

  typeCode();
});
