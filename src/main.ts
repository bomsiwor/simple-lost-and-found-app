import fetchData from "./utils/fetch";
import * as entity from "./types/losts";

const listContainer = document.getElementById("list-container");

const form = document.getElementById("lost-form");

async function renderList() {
  // Clear container
  if (listContainer) {
    listContainer.innerHTML = "";
  }

  const params = {
    sortBy: "_id"
  };

  const response = await fetchData<entity.TDataList>("GET", null, params);

  response?.forEach((item) => {
    const lostCard = document.createElement("div");

    // Create all element
    const title = document.createElement("h2");
    title.textContent = item.name;

    const status = document.createElement("p");
    status.textContent = item.found ? "Ditemukan" : "Belum ditemukan";

    const time = document.createElement("p");
    time.textContent = item.age;

    const location = document.createElement("p");
    location.textContent = item.last_seen_location;

    const id = document.createElement("p");
    id.textContent = item._id ?? "";

    const deletButton = document.createElement("button");
    deletButton.textContent = "Delete";
    deletButton.addEventListener("click", handleDelete(item._id as string));

    // Mount to card
    lostCard.append(
      title,
      status,
      time,
      location,
      id,
      deletButton,
    );

    // Mount to container
    listContainer?.appendChild(lostCard);
  })
}


// Event listener
window.addEventListener("load", () => {
  renderList();
})

// Form
form?.addEventListener("submit", async function (e) {
  e.preventDefault();

  // Construct payload
  const payload: entity.TDataPayloadStore = [
    {
      name: (document.getElementById("name") as HTMLInputElement).value,
      age: (document.getElementById("time") as HTMLInputElement).value,
      found: (document.getElementById("found") as HTMLInputElement).checked,
      chronology: (document.getElementById("chronology") as HTMLInputElement).value,
      last_seen_location: (document.getElementById("location") as HTMLInputElement).value,
      owner: (document.getElementById("owner") as HTMLInputElement).value,
      owner_contact: (document.getElementById("contact") as HTMLInputElement).value,
      user: "Test user"
    }
  ];

  // Send payload to API
  try {
    await fetchData("POST", JSON.stringify(payload));

    (this as HTMLFormElement).reset();
  } catch (error) {
    alert((error as Error).message);
  } finally {
    renderList();
  }
});

// Delete data
const handleDelete = (id: string) => (e: MouseEvent) => {
  try {
    fetchData("DELETE", JSON.stringify([id]));
  } catch (error) {
    alert((error as Error).message);
  } finally {
    renderList();
  }
}