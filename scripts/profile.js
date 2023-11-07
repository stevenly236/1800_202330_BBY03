const followButton = document.getElementById("followButton");

followButton.addEventListener("click", function() {
  if (followButton.classList.contains("following")) {
    followButton.textContent = "Follow";
    followButton.classList.remove("following");
    followButton.style.backgroundColor = "#4da6ff";
  } else {
    followButton.textContent = "Following";
    followButton.classList.add("following");
    followButton.style.backgroundColor = "#99ccff";
  }
});
