setInterval(() => {
    location.reload();
}, 5000);

// button click animation
document.querySelectorAll(".btn").forEach(btn => {
    btn.addEventListener("click", () => {
        btn.style.transform = "scale(0.9)";
        setTimeout(() => {
            btn.style.transform = "scale(1)";
        }, 150);
    });
});