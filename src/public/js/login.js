const form = document.getElementById("loginForm");

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const email = document.getElementById("email");
  const password = document.getElementById("password");
  const body = { email, password };

  fetch("api/sessions/login", {
    method: "POST",
    body: JSON.stringify(body),
    headers: {
      "Content-Type": "application/json",
    },
  }).then(() => {
    document.location.href = "/products";
  });
});
