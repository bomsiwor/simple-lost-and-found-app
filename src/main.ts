import fetchData from "./utils/fetch";
import * as entity from "./types/losts";
import Typed from "typed.js";
import randomizer from "./utils/randomizer";
import { IUser } from "./types/user";

const mainArea = document.getElementById("main") as HTMLDivElement;

const listContainer = document.getElementById("list-container");

const userForm = document.getElementById("user-form");

const form = document.getElementById("lost-form");

const typed = new Typed("#heading", {
  strings: ["Get ur beloved stuff back", "Lost <s>and found</s>", "..."],
  typeSpeed: 50,
  backSpeed: 100,
  loop: true,
  showCursor: false,
});

// Render List by fetching list data
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
    lostCard.classList.add("lost-card");

    // Create all element
    const header = document.createElement("div");
    header.classList.add("lost-card-header");

    const title = document.createElement("h2");
    title.classList.add("lost-name");
    title.textContent = item.name;

    const status = document.createElement("span");
    status.textContent = item.found ? "FOUND" : "Not Found, help :(";
    status.classList.add(item.found ? "found" : "not-found");

    // Mount to header
    header.append(
      title,
      status
    );

    const time = document.createElement("p");
    time.textContent = `lost around ${item.last_seen_location} at ${item.age}`;

    const id = document.createElement("p");
    id.textContent = item._id ?? "";

    const footer = document.createElement("div");
    footer.classList.add("lost-card-footer");

    const detailButton = document.createElement("button");
    detailButton.textContent = "Detail";
    detailButton.addEventListener("click", handleDetail(item._id as string));

    // User can only delete their post
    // Get user id and name
    const user = JSON.parse(localStorage.getItem("user") as string) as IUser;
    console.log(user);

    const deletButton = document.createElement("button");
    deletButton.textContent = "Delete";
    deletButton.addEventListener("click", handleDelete(item._id as string));

    footer.append(
      detailButton,
    );

    if (user?.id == item.user_id) {
      footer.append(deletButton);
    }

    // Mount to card
    lostCard.append(
      header,
      time,
      id,
      footer,
    );

    // Mount to container
    listContainer?.appendChild(lostCard);
  })
}

// After page is loaded
window.addEventListener("load", () => {
  renderList();

  // Get user name from localstorage
  const storedUser = localStorage.getItem("user");
  if (!storedUser) {
    return;
  }

  const user = JSON.parse(storedUser) as IUser;
  const username = user.name;
  const userInput = document.getElementById("username") as HTMLInputElement;

  if (username) {
    userInput.value = username;

    mainArea.style.display = "grid";

    (document.getElementById("user-form-submit") as HTMLButtonElement).textContent = "Change ur Identity???!";
  }

})

// User Form
userForm?.addEventListener("submit", (e) => {
  e.preventDefault();

  const userInput = document.getElementById("username") as HTMLInputElement;

  if (!userInput.value) {
    alert("Tell everyone ur name! Dont be shy.");
    return;
  }

  // Check if user already exists
  const storedUser = localStorage.getItem("user");
  const id: string = storedUser ? (JSON.parse(storedUser) as IUser).id : randomizer(5);

  // Generate random string as user ID
  // Set user object to localstorage
  // Construct user object
  const user: IUser = {
    name: userInput.value,
    id
  }

  localStorage.setItem("user", JSON.stringify(user));

  if (mainArea && userInput.value) {
    mainArea.style.display = "grid";
  }
})

// Form
form?.addEventListener("submit", async function (e) {
  e.preventDefault();
  // Get user id and name
  const user = JSON.parse(localStorage.getItem("user") as string) as IUser;

  // Construct payload
  const payload: entity.TDataPayloadStore = [
    {
      name: (document.getElementById("name") as HTMLInputElement).value,
      age: (document.getElementById("time") as HTMLInputElement).value,
      found: (document.getElementById("found") as HTMLInputElement).checked,
      chronology: (document.getElementById("chronology") as HTMLInputElement).value,
      last_seen_location: (document.getElementById("location") as HTMLInputElement).value,
      owner: user.name,
      user_id: user.id,
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

const handleDetail = (id: string) => async (e: MouseEvent) => {
  try {
    const response = await fetchData<entity.IData[]>("GET", null, null, id);

    if (!response?.length) {
      throw new Error("Not found!");
    }

    // Get data from response
    // Always take first element if response successs
    const data: entity.IData = response[0];

    // Set form title
    (document.getElementById("lost-title") as HTMLHeadingElement).innerHTML = `<u> ${data.owner}</u> has lost something`;

    // Set data to form
    (document.getElementById("name") as HTMLInputElement).value = data.name;
    (document.getElementById("time") as HTMLInputElement).value = data.age;
    (document.getElementById("found") as HTMLInputElement).checked = data.found;
    (document.getElementById("chronology") as HTMLInputElement).value = data.chronology;
    (document.getElementById("location") as HTMLInputElement).value = data.last_seen_location;
    (document.getElementById("contact") as HTMLInputElement).value = data.owner_contact;

    const submitBtn = (document.getElementById("submit-lost") as HTMLButtonElement);
    submitBtn.classList.add("disabled");
    submitBtn.disabled = true;
    submitBtn.textContent = "Can't update rn";

  } catch (error) {
    alert((error as Error).message);
  }
}

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