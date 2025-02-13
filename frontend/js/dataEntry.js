document
  .getElementById("pizzaForm")
  .addEventListener("submit", function (event) {
    event.preventDefault();

    const formData = new FormData(this);
    const data = {
      name: formData.get("name").toLowerCase(),
      date: formData.get("date"),
      source: formData.get("source"),
      variety: formData.get("variety"),
    };

    const apiKey = formData.get("apikey");

    fetch("http://localhost:3000/api/v1/pizzaStats", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify(data),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        console.log("Success:", data);
      })
      .catch((error) => {
        console.error("Error:", error);
        alert("An error occurred: " + error.message);
      });
  });
