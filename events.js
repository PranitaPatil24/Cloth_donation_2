document.addEventListener("DOMContentLoaded", async () => {
  const eventList = document.getElementById("eventList");
  const searchInput = document.getElementById("searchInput");

  async function fetchEvents() {
    try {
      const response = await fetch("https://cloth-donation-2.onrender.com");
      const events = await response.json();

      if (events.length === 0) {
        eventList.innerHTML = `<p class="text-center text-muted">No upcoming events found.</p>`;
        return;
      }

      renderEvents(events);

      searchInput.addEventListener("input", () => {
        const query = searchInput.value.toLowerCase();
        const filtered = events.filter(e =>
          e.title.toLowerCase().includes(query) ||
          (e.location && e.location.toLowerCase().includes(query))
        );
        renderEvents(filtered);
      });

    } catch (err) {
      console.error("❌ Error fetching events:", err);
      eventList.innerHTML = `<p class="text-center text-danger">Server error! Please try again later.</p>`;
    }
  }

  function renderEvents(events) {
    eventList.innerHTML = events.map(e => `
      <div class="col-md-4 mb-4 d-flex">
        <div class="card shadow-sm border-0 flex-fill event-card">
          <img src="${e.imageUrl || 'https://via.placeholder.com/400x200?text=Donation+Event'}" 
               class="card-img-top event-img" alt="Event image">
          <div class="card-body d-flex flex-column">
            <h5 class="card-title fw-bold text-primary text-capitalize">${e.title}</h5>
            <p class="card-text text-muted flex-grow-1">${e.description || 'No description available.'}</p>
            <p class="mb-1"><i class="bi bi-calendar-event text-danger"></i> <strong>${e.date || 'TBA'}</strong></p>
            <p><i class="bi bi-geo-alt-fill text-success"></i> ${e.location || 'Location not specified'}</p>
          </div>
          <div class="card-footer bg-white border-0 text-center pb-4">
            <button class="btn btn-donate w-75 register-btn" data-eventid="${e._id}">
              <i class="bi bi-person-check me-1"></i> Register Now
            </button>
          </div>
        </div>
      </div>
    `).join('');
  }

  document.addEventListener("click", (e) => {
    if (e.target.classList.contains("register-btn")) {
      const eventId = e.target.dataset.eventid;
      localStorage.setItem("selectedEventId", eventId);

      const user = JSON.parse(localStorage.getItem("loggedInUser"));
      if (!user) {
        alert("Please log in as a donor to register for this event.");
        window.location.href = "signup.html";
      } else if (user.userType !== "donor") {
        alert("Only donors can register for events.");
      } else {
        window.location.href = "donation.html";
      }
    }
  });

  fetchEvents();
});
