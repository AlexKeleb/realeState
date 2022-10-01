const inputs = document.querySelectorAll('input[type="text"]');

for (const input of inputs) {
  const inputPlaceholder = input.placeholder;

  input.addEventListener("focus", function (e) {
    input.placeholder = "";
  });
  input.addEventListener("blur", function (e) {
    input.placeholder = inputPlaceholder;
  });
}
