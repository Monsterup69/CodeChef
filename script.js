const userList = document.getElementById("user-list");
const postsContainer = document.getElementById("posts-container");
const loadingMessage = document.querySelector(".loading");
const emptyStateMessage = document.querySelector(".empty-state");
const searchUsersInput = document.getElementById("search-users");
const searchPostsInput = document.getElementById("search-posts");
const paginationContainer = document.getElementById("pagination");

let users = [];
let posts = [];
let currentPage = 1;
const postsPerPage = 5;

// Fetch users
fetch("https://jsonplaceholder.typicode.com/users")
  .then((response) => response.json())
  .then((data) => {
    users = data;
    loadingMessage.remove();
    renderUsers(users);
  })
  .catch((error) => {
    loadingMessage.textContent = "Failed to load users. Please try again later.";
  });

// Render users
function renderUsers(users) {
  userList.innerHTML = "";
  users.forEach((user) => {
    const userCard = document.createElement("div");
    userCard.classList.add("user-card");
    userCard.innerHTML = `
      <h2>${user.name}</h2>
      <p>Email: ${user.email}</p>
      <p>Username: ${user.username}</p>
    `;
    userCard.addEventListener("click", () => {
      document.querySelectorAll(".user-card").forEach((card) => {
        card.classList.remove("active");
      });
      userCard.classList.add("active");
      fetchPosts(user.id);
    });
    userList.appendChild(userCard);
  });
}

// Fetch posts for a specific user
function fetchPosts(userId) {
  postsContainer.innerHTML = "<div class='loading'><div class='loader'></div>Loading posts...</div>";
  fetch(`https://jsonplaceholder.typicode.com/posts?userId=${userId}`)
    .then((response) => response.json())
    .then((data) => {
      posts = data.map(post => ({
        ...post,
        title: generateEnglishTitle(), // Replace Latin title with English
        body: generateEnglishText(),   // Replace Latin body with English
      }));
      currentPage = 1;
      renderPosts();
      renderPagination();
    })
    .catch((error) => {
      postsContainer.innerHTML = "<div class='empty-state'>Failed to load posts. Please try again later.</div>";
    });
}

// Generate English title
function generateEnglishTitle() {
  const titles = [
    "The Future of Technology",
    "Exploring New Horizons",
    "Innovations in Science",
    "The Art of Programming",
    "Breaking Barriers in AI",
    "The Power of Data",
    "Revolutionizing Industries",
    "The Rise of Automation",
    "The World of Cybersecurity",
    "The Journey of Discovery",
  ];
  return titles[Math.floor(Math.random() * titles.length)];
}

// Generate English text
function generateEnglishText() {
  const texts = [
    "Technology is advancing at an unprecedented pace, transforming the way we live and work.",
    "Innovation is the key to solving the world's most pressing challenges.",
    "The future belongs to those who embrace change and adapt to new realities.",
    "Artificial intelligence is reshaping industries and creating new opportunities.",
    "Data is the new oil, driving decisions and powering businesses worldwide.",
    "Cybersecurity is more important than ever in our interconnected world.",
    "Automation is revolutionizing workflows and increasing efficiency.",
    "The journey of discovery is filled with challenges and opportunities.",
    "Science and technology are the cornerstones of modern society.",
    "The rise of digital transformation is changing the way we interact with the world.",
  ];
  return texts[Math.floor(Math.random() * texts.length)];
}

// Render posts
function renderPosts() {
  postsContainer.innerHTML = "";
  if (posts.length === 0) {
    postsContainer.innerHTML = "<div class='empty-state'>No posts available for this user.</div>";
  } else {
    const start = (currentPage - 1) * postsPerPage;
    const end = start + postsPerPage;
    posts.slice(start, end).forEach((post) => {
      const postCard = document.createElement("div");
      postCard.classList.add("post-card");
      postCard.innerHTML = `
        <h3>${post.title}</h3>
        <p>${post.body}</p>
      `;
      postsContainer.appendChild(postCard);
    });
  }
}

// Render filtered posts
function renderFilteredPosts(filteredPosts) {
  postsContainer.innerHTML = "";
  if (filteredPosts.length === 0) {
    postsContainer.innerHTML = "<div class='empty-state'>No posts match your search.</div>";
  } else {
    filteredPosts.forEach((post) => {
      const postCard = document.createElement("div");
      postCard.classList.add("post-card");
      postCard.innerHTML = `
        <h3>${post.title}</h3>
        <p>${post.body}</p>
      `;
      postsContainer.appendChild(postCard);
    });
  }
}

// Render pagination
function renderPagination() {
  paginationContainer.innerHTML = "";
  const pageCount = Math.ceil(posts.length / postsPerPage);
  for (let i = 1; i <= pageCount; i++) {
    const button = document.createElement("button");
    button.textContent = i;
    button.addEventListener("click", () => {
      currentPage = i;
      renderPosts();
      updatePaginationButtons();
    });
    paginationContainer.appendChild(button);
  }
  updatePaginationButtons();
}

// Update pagination buttons
function updatePaginationButtons() {
  const buttons = paginationContainer.querySelectorAll("button");
  buttons.forEach((button, index) => {
    button.classList.toggle("active", index + 1 === currentPage);
  });
}

// Search users
searchUsersInput.addEventListener("input", (e) => {
  const query = e.target.value.toLowerCase();
  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(query) ||
      user.email.toLowerCase().includes(query) ||
      user.username.toLowerCase().includes(query)
  );
  renderUsers(filteredUsers);
});

// Search posts
searchPostsInput.addEventListener("input", (e) => {
  const query = e.target.value.toLowerCase();
  const filteredPosts = posts.filter(
    (post) => post.title.toLowerCase().includes(query)
  );
  renderFilteredPosts(filteredPosts);
  paginationContainer.innerHTML = ""; // Clear pagination when searching
});

// Back to top button
const backToTopButton = document.getElementById('back-to-top');

window.addEventListener('scroll', () => {
  if (window.scrollY > 300) {
    backToTopButton.style.display = 'block';
  } else {
    backToTopButton.style.display = 'none';
  }
});

backToTopButton.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});
